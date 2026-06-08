import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateGP200SystemPrompt } from '../lib/gp200-knowledge-base';
import { getCachedResults, cacheResults, logSearchAnalytics } from '../lib/cache';
import { isSupabaseConfigured } from '../lib/supabase';
import type { ToneCacheResult } from '../lib/database.types';

// Initialize Gemini with server-side API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Response format for the AI
const responseFormat = `
You must respond with a valid JSON array containing tone recommendations. Each item should have this exact structure:
{
  "preset": {
    "id": "unique-id-string",
    "name": "Preset Name",
    "description": "Brief description of the tone",
    "genre": "Genre category",
    "settings": {
      "amp": {
        "model": "GP-200 amp model name",
        "gain": 0-100,
        "bass": 0-100,
        "mid": 0-100,
        "treble": 0-100,
        "presence": 0-100,
        "volume": 0-100
      },
      "cab": {
        "model": "GP-200 cab model name",
        "micPosition": "center/off-axis/edge"
      },
      "drive": {
        "type": "GP-200 drive effect name",
        "gain": 0-100,
        "tone": 0-100,
        "level": 0-100
      },
      "modulation": {
        "type": "GP-200 mod effect name",
        "rate": 0-100,
        "depth": 0-100,
        "mix": 0-100
      },
      "delay": {
        "type": "GP-200 delay effect name",
        "time": 0-2000 (ms),
        "feedback": 0-100,
        "mix": 0-100
      },
      "reverb": {
        "type": "GP-200 reverb effect name",
        "decay": 0-100,
        "mix": 0-100
      }
    }
  },
  "confidence": 0.0-1.0,
  "reasoning": "Explanation of why this preset matches the requested tone"
}

Notes:
- drive, modulation, delay, and reverb are optional - only include if needed for the tone
- Use ONLY the exact GP-200 effect names from your knowledge base
- Provide 1-3 preset variations for the requested tone
- Return ONLY the JSON array, no additional text
`;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const startTime = Date.now();

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: API key not configured' });
  }

  try {
    // Check if Supabase is configured
    const supabaseReady = isSupabaseConfigured();
    console.log(`[search-tones] Supabase configured: ${supabaseReady}`);

    // Check cache first
    console.log(`[search-tones] Checking cache for query: "${query}"`);
    const cachedResults = await getCachedResults(query);

    if (cachedResults) {
      const responseTime = Date.now() - startTime;
      console.log(`[search-tones] CACHE HIT - returning ${cachedResults.length} cached presets`);

      // Log analytics (cache hit)
      await logSearchAnalytics(query, responseTime, true);

      return res.status(200).json(cachedResults);
    }

    console.log(`[search-tones] CACHE MISS - calling Gemini AI`);
    // No cache hit, generate with AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = generateGP200SystemPrompt();

    const prompt = `${systemPrompt}

${responseFormat}

User request: "${query}"

Generate GP-200 preset recommendations for this tone request. Remember to use ONLY the exact GP-200 effect names from the knowledge base above.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    let presets: ToneCacheResult[];

    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      let jsonText = text;
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      }

      presets = JSON.parse(jsonText);

      // Ensure it's an array
      if (!Array.isArray(presets)) {
        presets = [presets];
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      return res.status(500).json({
        error: 'Failed to parse tone recommendations',
        details: 'The AI response was not in the expected format'
      });
    }

    const responseTime = Date.now() - startTime;

    // Cache the results for future requests
    console.log(`[search-tones] Caching ${presets.length} presets to Supabase`);
    await cacheResults(query, presets);

    // Log analytics (cache miss)
    await logSearchAnalytics(query, responseTime, false);

    console.log(`[search-tones] Response complete - ${presets.length} presets, ${responseTime}ms`);
    return res.status(200).json(presets);

  } catch (error) {
    const responseTime = Date.now() - startTime;

    console.error('API Error:', error);

    // Log failed search
    await logSearchAnalytics(query, responseTime, false);

    if (error instanceof Error) {
      // Handle rate limiting
      if (error.message.includes('429') || error.message.includes('quota')) {
        return res.status(429).json({
          error: 'Rate limit exceeded. Please try again later.'
        });
      }

      return res.status(500).json({
        error: 'Failed to generate tone recommendations',
        details: error.message
      });
    }

    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
