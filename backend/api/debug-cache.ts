import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const debug: Record<string, unknown> = {
    supabase_configured: isSupabaseConfigured(),
    supabase_url_set: !!process.env.SUPABASE_URL,
    supabase_key_set: !!process.env.SUPABASE_SERVICE_KEY,
    gemini_key_set: !!process.env.GEMINI_API_KEY,
  };

  // Test Supabase connection if configured
  if (isSupabaseConfigured()) {
    try {
      // Count cached entries
      const { count, error: countError } = await supabase
        .from('tone_cache')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        debug.supabase_error = countError.message;
        debug.supabase_connection = 'failed';
      } else {
        debug.supabase_connection = 'success';
        debug.cached_entries_count = count;
      }

      // Get recent cache entries
      const { data: recentEntries, error: recentError } = await supabase
        .from('tone_cache')
        .select('query, hit_count, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!recentError && recentEntries) {
        debug.recent_cached_queries = recentEntries.map((e: any) => ({
          query: e.query,
          hits: e.hit_count,
          created: e.created_at,
        }));
      }
    } catch (error) {
      debug.supabase_error = error instanceof Error ? error.message : 'Unknown error';
      debug.supabase_connection = 'failed';
    }
  } else {
    debug.supabase_connection = 'not_configured';
  }

  return res.status(200).json(debug);
}
