// Database types for Supabase
// These types match the schema defined in supabase/migrations/

export interface Database {
  public: {
    Tables: {
      // Cached tone search results
      tone_cache: {
        Row: {
          id: string;
          query: string;
          query_hash: string;
          results: ToneCacheResult[];
          created_at: string;
          expires_at: string;
          hit_count: number;
        };
        Insert: {
          id?: string;
          query: string;
          query_hash: string;
          results: ToneCacheResult[];
          created_at?: string;
          expires_at: string;
          hit_count?: number;
        };
        Update: {
          id?: string;
          query?: string;
          query_hash?: string;
          results?: ToneCacheResult[];
          created_at?: string;
          expires_at?: string;
          hit_count?: number;
        };
      };
      // User saved presets
      user_presets: {
        Row: {
          id: string;
          user_id: string;
          preset_data: PresetData;
          name: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          preset_data: PresetData;
          name: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          preset_data?: PresetData;
          name?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Search analytics
      search_analytics: {
        Row: {
          id: string;
          query: string;
          user_id: string | null;
          device_type: string | null;
          response_time_ms: number;
          cache_hit: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          query: string;
          user_id?: string | null;
          device_type?: string | null;
          response_time_ms: number;
          cache_hit: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          query?: string;
          user_id?: string | null;
          device_type?: string | null;
          response_time_ms?: number;
          cache_hit?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

// Preset data structure stored in the database
export interface PresetData {
  id: string;
  name: string;
  description: string;
  genre: string;
  settings: {
    amp: {
      model: string;
      gain: number;
      bass: number;
      mid: number;
      treble: number;
      presence: number;
      volume: number;
    };
    cab: {
      model: string;
      micPosition?: string;
    };
    drive?: {
      type: string;
      gain: number;
      tone: number;
      level: number;
    };
    modulation?: {
      type: string;
      rate: number;
      depth: number;
      mix: number;
    };
    delay?: {
      type: string;
      time: number;
      feedback: number;
      mix: number;
    };
    reverb?: {
      type: string;
      decay: number;
      mix: number;
    };
  };
}

// Cached result structure
export interface ToneCacheResult {
  preset: PresetData;
  confidence: number;
  reasoning: string;
}
