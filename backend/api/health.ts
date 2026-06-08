import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isSupabaseConfigured } from '../lib/supabase';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    apiKeyConfigured: !!process.env.GEMINI_API_KEY,
    cacheEnabled: isSupabaseConfigured(),
  });
}
