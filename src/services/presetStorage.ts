import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GP200Preset } from '../types';

const SAVED_PRESETS_KEY = 'saved_presets';

// Get all saved presets
export async function getSavedPresets(): Promise<GP200Preset[]> {
  try {
    const data = await AsyncStorage.getItem(SAVED_PRESETS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Failed to load saved presets:', error);
    return [];
  }
}

// Save a preset
export async function savePreset(preset: GP200Preset): Promise<void> {
  try {
    const presets = await getSavedPresets();

    // Check if preset already exists (by id or song+artist combo)
    const existingIndex = presets.findIndex(
      p => p.id === preset.id ||
      (p.songName === preset.songName && p.artistName === preset.artistName)
    );

    const presetToSave: GP200Preset = {
      ...preset,
      isUserSaved: true,
      createdAt: existingIndex >= 0 ? presets[existingIndex].createdAt : new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing preset
      presets[existingIndex] = presetToSave;
    } else {
      // Add new preset at the beginning
      presets.unshift(presetToSave);
    }

    await AsyncStorage.setItem(SAVED_PRESETS_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save preset:', error);
    throw new Error('Failed to save preset');
  }
}

// Delete a saved preset
export async function deletePreset(presetId: string): Promise<void> {
  try {
    const presets = await getSavedPresets();
    const filtered = presets.filter(p => p.id !== presetId);
    await AsyncStorage.setItem(SAVED_PRESETS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete preset:', error);
    throw new Error('Failed to delete preset');
  }
}

// Check if a preset is saved
export async function isPresetSaved(presetId: string): Promise<boolean> {
  const presets = await getSavedPresets();
  return presets.some(p => p.id === presetId);
}
