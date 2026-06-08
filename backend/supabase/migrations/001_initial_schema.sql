-- GP Patch Lab Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Tone Cache Table
-- Stores cached AI-generated tone recommendations
-- ============================================
CREATE TABLE IF NOT EXISTS tone_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query TEXT NOT NULL,
  query_hash TEXT NOT NULL UNIQUE,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  hit_count INTEGER DEFAULT 0
);

-- Index for faster cache lookups
CREATE INDEX IF NOT EXISTS idx_tone_cache_query_hash ON tone_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_tone_cache_expires_at ON tone_cache(expires_at);

-- ============================================
-- User Presets Table
-- Stores user-saved presets
-- ============================================
CREATE TABLE IF NOT EXISTS user_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preset_data JSONB NOT NULL,
  name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user preset lookups
CREATE INDEX IF NOT EXISTS idx_user_presets_user_id ON user_presets(user_id);

-- ============================================
-- Search Analytics Table
-- Tracks search patterns and performance
-- ============================================
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  device_type TEXT,
  response_time_ms INTEGER NOT NULL,
  cache_hit BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_search_analytics_cache_hit ON search_analytics(cache_hit);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE tone_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Tone cache: Allow service role full access (backend only)
CREATE POLICY "Service role can manage tone cache"
  ON tone_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- User presets: Users can only access their own presets
CREATE POLICY "Users can view own presets"
  ON user_presets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own presets"
  ON user_presets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presets"
  ON user_presets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own presets"
  ON user_presets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can manage all presets (for admin)
CREATE POLICY "Service role can manage all presets"
  ON user_presets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Search analytics: Service role only (backend writes)
CREATE POLICY "Service role can manage analytics"
  ON search_analytics
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Functions
-- ============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on user_presets
CREATE TRIGGER update_user_presets_updated_at
  BEFORE UPDATE ON user_presets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM tone_cache WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Scheduled Jobs (optional - requires pg_cron extension)
-- Uncomment if pg_cron is enabled in your Supabase project
-- ============================================

-- Schedule cache cleanup to run daily at midnight
-- SELECT cron.schedule('cleanup-expired-cache', '0 0 * * *', 'SELECT cleanup_expired_cache()');
