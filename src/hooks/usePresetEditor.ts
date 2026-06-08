import { useState, useCallback, useEffect } from 'react';
import { getSavedPresets, savePreset } from '../services/presetStorage';
import type { GP200Preset, AmpBlock, EffectCategory } from '../types';

export interface UsePresetEditorReturn {
  preset: GP200Preset | null;
  loading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  volume: number;

  // Amp controls
  updateAmpModel: (model: string) => void;
  updateAmpParam: (param: keyof Omit<AmpBlock, 'enabled' | 'model' | 'bright'>, value: number) => void;

  // Block controls
  updateBlockParam: (block: keyof GP200Preset['blocks'], param: string, value: number) => void;
  toggleBlock: (block: keyof GP200Preset['blocks'], enabled: boolean) => void;

  // Local controls
  setVolume: (value: number) => void;
  toggleModuleMidi: (module: EffectCategory, enabled: boolean) => void;

  // Actions
  save: () => Promise<void>;
  reset: () => void;
  setPreset: (preset: GP200Preset) => void;
}

export function usePresetEditor(presetId?: string): UsePresetEditorReturn {
  const [originalPreset, setOriginalPreset] = useState<GP200Preset | null>(null);
  const [preset, setPreset] = useState<GP200Preset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [volume, setVolumeState] = useState(50);

  // Load preset by ID
  useEffect(() => {
    if (!presetId) return;

    const loadPreset = async () => {
      setLoading(true);
      setError(null);
      try {
        const presets = await getSavedPresets();
        const found = presets.find(p => p.id === presetId);
        if (found) {
          setOriginalPreset(found);
          setPreset({ ...found });
        } else {
          setError('Preset not found');
        }
      } catch (e) {
        setError('Failed to load preset');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadPreset();
  }, [presetId]);

  // Track changes
  useEffect(() => {
    if (!originalPreset || !preset) {
      setHasUnsavedChanges(false);
      return;
    }
    const changed = JSON.stringify(originalPreset) !== JSON.stringify(preset);
    setHasUnsavedChanges(changed);
  }, [originalPreset, preset]);

  // Set preset directly (for unsaved presets from search)
  const setPresetDirect = useCallback((newPreset: GP200Preset) => {
    setOriginalPreset(newPreset);
    setPreset({ ...newPreset });
    setHasUnsavedChanges(false);
  }, []);

  // Amp controls
  const updateAmpModel = useCallback((model: string) => {
    setPreset(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          amp: { ...prev.blocks.amp, model },
        },
      };
    });
  }, []);

  const updateAmpParam = useCallback((
    param: keyof Omit<AmpBlock, 'enabled' | 'model' | 'bright'>,
    value: number
  ) => {
    setPreset(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          amp: { ...prev.blocks.amp, [param]: value },
        },
      };
    });
  }, []);

  // Generic block controls
  const updateBlockParam = useCallback((
    block: keyof GP200Preset['blocks'],
    param: string,
    value: number
  ) => {
    setPreset(prev => {
      if (!prev) return prev;
      const currentBlock = prev.blocks[block];
      if (!currentBlock) return prev;

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [block]: { ...currentBlock, [param]: value },
        },
      };
    });
  }, []);

  const toggleBlock = useCallback((block: keyof GP200Preset['blocks'], enabled: boolean) => {
    setPreset(prev => {
      if (!prev) return prev;
      const currentBlock = prev.blocks[block];
      if (!currentBlock) return prev;

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [block]: { ...currentBlock, enabled },
        },
      };
    });
  }, []);

  // Local-only controls (no MIDI - use Pedal Editor for hardware control)
  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
  }, []);

  const toggleModuleMidi = useCallback((module: EffectCategory, enabled: boolean) => {
    const blockMap: Record<EffectCategory, keyof GP200Preset['blocks']> = {
      PRE: 'pre',
      WAH: 'wah',
      DST: 'dst',
      AMP: 'amp',
      CAB: 'cab',
      NR: 'nr',
      EQ: 'eq',
      MOD: 'mod',
      DLY: 'dly',
      REV: 'rev',
    };

    const block = blockMap[module];
    toggleBlock(block, enabled);
  }, [toggleBlock]);

  // Save preset
  const save = useCallback(async () => {
    if (!preset) return;
    await savePreset(preset);
    setOriginalPreset(preset);
    setHasUnsavedChanges(false);
  }, [preset]);

  // Reset to original
  const reset = useCallback(() => {
    if (originalPreset) {
      setPreset({ ...originalPreset });
    }
  }, [originalPreset]);

  return {
    preset,
    loading,
    error,
    hasUnsavedChanges,
    volume,
    updateAmpModel,
    updateAmpParam,
    updateBlockParam,
    toggleBlock,
    setVolume,
    toggleModuleMidi,
    save,
    reset,
    setPreset: setPresetDirect,
  };
}
