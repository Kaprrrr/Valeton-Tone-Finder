import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cleanupExpiredCache } from '../lib/cache';
import { isSupabaseConfigured } from '../lib/supabase';

// This endpoint can be triggered by a Vercel cron job
// Add to vercel.json: { "crons": [{ "path": "/api/cache-cleanup", "schedule": "0 0 * * *" }] }

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Only allow GET for cron jobs
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify this is a Vercel cron request (optional security)
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Allow without auth in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (!isSupabaseConfigured()) {
    return res.status(200).json({
      message: 'Cache not configured, nothing to clean up',
      deletedCount: 0
    });
  }

  try {
    const deletedCount = await cleanupExpiredCache();

    return res.status(200).json({
      message: 'Cache cleanup completed',
      deletedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cache cleanup error:', error);
    return res.status(500).json({
      error: 'Cache cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
