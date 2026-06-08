// GP-200 Effect Types and Interfaces

export type EffectCategory =
  | 'PRE'
  | 'WAH'
  | 'DST'
  | 'AMP'
  | 'CAB'
  | 'NR'
  | 'EQ'
  | 'MOD'
  | 'DLY'
  | 'REV';

export type AmpType = 'Clean' | 'Drive' | 'Hi Gain' | 'Bass' | 'Acoustic';
export type EffectType =
  | 'Compressor' | 'Boost' | 'Overdrive' | 'Distortion' | 'Fuzz'
  | 'Wah' | 'Pitch' | 'Filter' | 'Acoustic' | 'Special'
  | 'Gate' | 'EQ' | 'Chorus' | 'Flanger' | 'Vibrato' | 'Phaser' | 'Tremolo'
  | 'Delay' | 'Reverb' | 'Volume' | 'Bass Drive' | 'Bass Preamp';

export interface EffectModel {
  name: string;
  type: EffectType;
  basedOn: string;
  description?: string;
}

export interface AmpModel {
  name: string;
  type: AmpType;
  basedOn: string;
  description?: string;
}

export interface CabModel {
  name: string;
  size: string;
  basedOn: string;
}

// Preset block interfaces
export interface BaseBlock {
  enabled: boolean;
  code?: number;  // Official GP-200 effect code for export
}

export interface PreBlock extends BaseBlock {
  model: string;
  level: number;
  // Additional params vary by effect type
  param1?: number;
  param2?: number;
  param3?: number;
}

export interface WahBlock extends BaseBlock {
  model: string;
  position: number; // 0-100 (heel to toe)
  minFreq?: number;
  maxFreq?: number;
}

export interface DstBlock extends BaseBlock {
  model: string;
  gain: number;
  tone: number;
  level: number;
  // Some have additional params
  bass?: number;
  treble?: number;
}

export interface AmpBlock extends BaseBlock {
  model: string;
  gain: number;
  bass: number;
  mid: number;
  treble: number;
  presence: number;
  master: number;
  bright?: boolean;
}

export interface CabBlock extends BaseBlock {
  model: string;
  micType?: string;
  micPosition?: number;
  lowCut?: number;
  highCut?: number;
}

export interface NRBlock extends BaseBlock {
  model: string;
  threshold: number;
  decay?: number;
}

export interface EQBlock extends BaseBlock {
  model: string;
  bands: number[];
  level: number;
}

export interface ModBlock extends BaseBlock {
  model: string;
  rate: number;
  depth: number;
  mix: number;
  // Additional params
  tone?: number;
  predelay?: number;
}

export interface DlyBlock extends BaseBlock {
  model: string;
  time: number;      // ms
  feedback: number;  // 0-100
  mix: number;       // 0-100
  // Additional params
  tone?: number;
  modRate?: number;
  modDepth?: number;
}

export interface RevBlock extends BaseBlock {
  model: string;
  decay: number;
  predelay: number;
  mix: number;
  tone?: number;
  damping?: number;
}

// Complete Preset
export interface GP200Preset {
  id: string;
  songName: string;
  artistName: string;
  genre?: string;
  description: string;
  toneNotes?: string;

  blocks: {
    pre?: PreBlock;
    wah?: WahBlock;
    dst?: DstBlock;
    amp: AmpBlock;
    cab: CabBlock;
    nr?: NRBlock;
    eq?: EQBlock;
    mod?: ModBlock;
    dly?: DlyBlock;
    rev?: RevBlock;
  };

  createdAt: string;
  isUserSaved: boolean;
}

// API Response from Claude
export interface ToneAnalysisResponse {
  preset: GP200Preset;
  confidence: number;
  alternativeSuggestions?: string[];
}

// Storage types
export interface AppSettings {
  claudeApiKey: string;
  darkMode: boolean;
  recentSearches: string[];
}

// Export types for GP-200 hardware
export interface ExportablePreset {
  name: string;
  volume: number;
  modules: ExportModule[];
}

export interface ExportModule {
  module: string;
  name: string;
  code: number;
  enabled: boolean;
  parameters: ExportParameter[];
}

export interface ExportParameter {
  id: number;
  name: string;
  value: number;
}
