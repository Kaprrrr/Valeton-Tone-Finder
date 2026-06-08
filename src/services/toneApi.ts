import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { ToneAnalysisResponse, GP200Preset } from '../types';

// Backend API URL
const API_BASE_URL = 'https://backend-wheat-one-35.vercel.app';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

// Use SecureStore on native, AsyncStorage on web
const isWeb = Platform.OS === 'web';

// Store the API key securely (kept for backward compatibility during transition)
export async function setApiKey(apiKey: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  } else {
    await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, apiKey);
  }
}

// Get the stored API key
export async function getApiKey(): Promise<string | null> {
  if (isWeb) {
    return await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
  }
  return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
}

// Check if API key is set - now always returns true since backend handles the API key
export async function hasApiKey(): Promise<boolean> {
  // Backend handles the API key, so we always return true
  return true;
}

// Clear the API key
export async function clearApiKey(): Promise<void> {
  if (isWeb) {
    await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
  } else {
    await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
  }
}

// Parse backend response into ToneAnalysisResponse format
function parseBackendResponse(data: any[]): ToneAnalysisResponse[] {
  return data.map((item: any, index: number) => {
    // Check if the response is in the old format (with settings) or new format (with blocks)
    const hasSettings = item.preset?.settings;
    const hasBlocks = item.preset?.blocks;

    let preset: GP200Preset;

    if (hasBlocks) {
      // New format from backend - already has blocks structure
      preset = {
        id: item.preset.id || `${Date.now()}-${index}`,
        songName: item.preset.name || item.preset.songName || 'Unknown Song',
        artistName: item.preset.artistName || 'Unknown Artist',
        genre: item.preset.genre,
        description: item.preset.description || item.reasoning || '',
        blocks: item.preset.blocks,
        createdAt: new Date().toISOString(),
        isUserSaved: false,
      };
    } else if (hasSettings) {
      // Old format - convert settings to blocks
      const settings = item.preset.settings;
      preset = {
        id: item.preset.id || `${Date.now()}-${index}`,
        songName: item.preset.name || 'Unknown Song',
        artistName: 'Unknown Artist',
        genre: item.preset.genre,
        description: item.preset.description || item.reasoning || '',
        blocks: {
          amp: {
            enabled: true,
            model: settings.amp?.model || 'UK 800',
            gain: settings.amp?.gain ?? 50,
            bass: settings.amp?.bass ?? 50,
            mid: settings.amp?.mid ?? 50,
            treble: settings.amp?.treble ?? 50,
            presence: settings.amp?.presence ?? 50,
            master: settings.amp?.volume ?? 50,
          },
          cab: {
            enabled: true,
            model: settings.cab?.model || 'UK LD',
          },
        },
        createdAt: new Date().toISOString(),
        isUserSaved: false,
      };

      // Add optional blocks from settings
      if (settings.drive) {
        preset.blocks.dst = {
          enabled: true,
          model: settings.drive.type,
          gain: settings.drive.gain ?? 50,
          tone: settings.drive.tone ?? 50,
          level: settings.drive.level ?? 50,
        };
      }
      if (settings.modulation) {
        preset.blocks.mod = {
          enabled: true,
          model: settings.modulation.type,
          rate: settings.modulation.rate ?? 50,
          depth: settings.modulation.depth ?? 50,
          mix: settings.modulation.mix ?? 50,
        };
      }
      if (settings.delay) {
        preset.blocks.dly = {
          enabled: true,
          model: settings.delay.type,
          time: settings.delay.time ?? 300,
          feedback: settings.delay.feedback ?? 30,
          mix: settings.delay.mix ?? 30,
        };
      }
      if (settings.reverb) {
        preset.blocks.rev = {
          enabled: true,
          model: settings.reverb.type,
          decay: settings.reverb.decay ?? 50,
          predelay: 20,
          mix: settings.reverb.mix ?? 30,
        };
      }
    } else {
      // Fallback - create a default preset
      preset = {
        id: `${Date.now()}-${index}`,
        songName: item.preset?.name || 'Unknown Song',
        artistName: 'Unknown Artist',
        genre: item.preset?.genre || 'Rock',
        description: item.preset?.description || item.reasoning || '',
        blocks: {
          amp: {
            enabled: true,
            model: 'UK 800',
            gain: 50,
            bass: 50,
            mid: 50,
            treble: 50,
            presence: 50,
            master: 50,
          },
          cab: {
            enabled: true,
            model: 'UK LD',
          },
        },
        createdAt: new Date().toISOString(),
        isUserSaved: false,
      };
    }

    return {
      preset,
      confidence: item.confidence ?? 0.85,
      alternativeSuggestions: item.alternativeSuggestions,
    };
  });
}

// Main search function using backend API
export async function searchTones(query: string): Promise<ToneAnalysisResponse[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(`${API_BASE_URL}/api/search-tones.ts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (response.status === 500) {
        throw new Error(errorData.error || 'Server error. Please try again later.');
      }
      throw new Error(errorData.error || `Request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No tone suggestions found. Try a different search.');
    }

    return parseBackendResponse(data);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
}

// Health check function to test backend connectivity
export async function checkBackendHealth(): Promise<{ status: string; apiKeyConfigured: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health.ts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Backend health check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Backend health check error:', error);
    return { status: 'error', apiKeyConfigured: false };
  }
}
