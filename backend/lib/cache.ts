import { supabase, isSupabaseConfigured } from './supabase';
import type { ToneCacheResult } from './database.types';
import crypto from 'crypto';

// Cache duration in hours - effectively forever since guitar tones for songs never change
const CACHE_DURATION_HOURS = 24 * 365 * 100; // 100 years (effectively forever)

// Generate a hash for the query to use as cache key
function hashQuery(query: string): string {
  const normalizedQuery = query.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalizedQuery).digest('hex');
}

// Get cached results for a query
export async function getCachedResults(query: string): Promise<ToneCacheResult[] | null> {
  if (!isSupabaseConfigured()) {
    console.log('[cache] Supabase not configured - skipping cache lookup');
    return null;
  }

  const queryHash = hashQuery(query);
  console.log(`[cache] Looking up hash: ${queryHash.substring(0, 16)}...`);

  try {
    const { data, error } = await supabase
      .from('tone_cache')
      .select('results, hit_count')
      .eq('query_hash', queryHash)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) {
      console.log(`[cache] Lookup error: ${error.message}`);
      return null;
    }

    if (!data) {
      console.log('[cache] No cached data found');
      return null;
    }

    console.log(`[cache] Found cached result with ${((data as any).results as ToneCacheResult[])?.length || 0} presets`);

    // Update hit count
    await supabase
      .from('tone_cache')
      .update({ hit_count: ((data as any).hit_count || 0) + 1 })
      .eq('query_hash', queryHash);

    return (data as any).results as ToneCacheResult[];
  } catch (error) {
    console.error('Cache lookup error:', error);
    return null;
  }
}

// Store results in cache
export async function cacheResults(query: string, results: ToneCacheResult[]): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('[cache] Supabase not configured - skipping cache write');
    return;
  }

  const queryHash = hashQuery(query);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + CACHE_DURATION_HOURS);

  console.log(`[cache] Writing ${results.length} presets to cache for query: "${query}"`);

  try {
    // Upsert to handle both new and existing entries
    const { error } = await supabase
      .from('tone_cache')
      .upsert({
        query: query.toLowerCase().trim(),
        query_hash: queryHash,
        results: results,
        expires_at: expiresAt.toISOString(),
        hit_count: 0,
      } as any, {
        onConflict: 'query_hash'
      });

    if (error) {
      console.error('[cache] Write error:', error.message);
    } else {
      console.log('[cache] Successfully cached results');
    }
  } catch (error) {
    console.error('[cache] Write error:', error);
  }
}

// Log search analytics
export async function logSearchAnalytics(
  query: string,
  responseTimeMs: number,
  cacheHit: boolean,
  userId?: string,
  deviceType?: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    await supabase
      .from('search_analytics')
      .insert({
        query: query.toLowerCase().trim(),
        user_id: userId || null,
        device_type: deviceType || null,
        response_time_ms: responseTimeMs,
        cache_hit: cacheHit,
      } as any);
  } catch (error) {
    console.error('Analytics logging error:', error);
  }
}

// Clean up expired cache entries (run periodically)
export async function cleanupExpiredCache(): Promise<number> {
  if (!isSupabaseConfigured()) {
    return 0;
  }

  try {
    const { data, error } = await supabase
      .from('tone_cache')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error('Cache cleanup error:', error);
    return 0;
  }
}
