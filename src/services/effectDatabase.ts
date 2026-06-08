// GP-200 Effect Database
// Parsed from algorithm.xml - contains all effects and their parameters

export type ParamType = 'knob' | 'switch' | 'combox';

export interface EffectParam {
  name: string;
  idx: number;
  type: ParamType;
  default: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  options?: { name: string; id: number }[]; // For switches and comboboxes
}

export interface Effect {
  name: string;
  module: string;
  code: number;
  index: number;
  params: EffectParam[];
  cabCode?: number; // For amps that have associated cabs
}

export interface EffectCatalog {
  [module: string]: Effect[];
}

// Block IDs for SysEx (from MIDI capture analysis)
export const BLOCK_IDS: Record<string, number> = {
  PRE: 0x00,  // TODO: Capture to confirm
  WAH: 0x01,  // TODO: Capture to confirm
  DST: 0x02,
  AMP: 0x03,
  NR: 0x04,
  CAB: 0x05,
  EQ: 0x06,   // TODO: Capture to confirm
  MOD: 0x07,
  DLY: 0x08,
  RVB: 0x09,
  VOL: 0x0A,  // TODO: Capture to confirm
};

// Module colors for UI
export const MODULE_COLORS: Record<string, string> = {
  PRE: '#9C27B0',
  WAH: '#E91E63',
  DST: '#F44336',
  AMP: '#FF9800',
  CAB: '#795548',
  NR: '#607D8B',
  EQ: '#4CAF50',
  MOD: '#2196F3',
  DLY: '#00BCD4',
  RVB: '#3F51B5',
  VOL: '#9E9E9E',
};

// Module display names
export const MODULE_NAMES: Record<string, string> = {
  PRE: 'Pre',
  WAH: 'Wah',
  DST: 'Drive',
  AMP: 'Amp',
  CAB: 'Cab',
  NR: 'Gate',
  EQ: 'EQ',
  MOD: 'Mod',
  DLY: 'Delay',
  RVB: 'Reverb',
  VOL: 'Volume',
};

// Signal chain order (11 pedals including VOL)
export const SIGNAL_CHAIN = ['PRE', 'WAH', 'DST', 'AMP', 'CAB', 'NR', 'EQ', 'MOD', 'DLY', 'RVB', 'VOL'];

class EffectDatabaseService {
  private catalog: EffectCatalog = {};
  private loaded = false;
  private loadPromise: Promise<void> | null = null;

  async load(): Promise<void> {
    if (this.loaded) return;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = this.parseAlgorithmXML();
    await this.loadPromise;
    this.loaded = true;
  }

  private async parseAlgorithmXML(): Promise<void> {
    try {
      // Import the pre-parsed data
      const data = await import('../data/effectCatalog.json');
      this.catalog = (data.default || data) as unknown as EffectCatalog;
    } catch (error) {
      console.warn('Failed to load effect catalog, using fallback:', error);
      // Fallback to empty catalog - will be populated by effectCatalog.json
      this.catalog = {};
    }
  }

  getModules(): string[] {
    return SIGNAL_CHAIN;
  }

  getEffectsForModule(module: string): Effect[] {
    return this.catalog[module] || [];
  }

  getEffect(module: string, effectName: string): Effect | undefined {
    const effects = this.catalog[module] || [];
    return effects.find(e => e.name === effectName);
  }

  getEffectByCode(module: string, code: number): Effect | undefined {
    const effects = this.catalog[module] || [];
    return effects.find(e => e.code === code);
  }

  getBlockId(module: string): number {
    return BLOCK_IDS[module] ?? 0;
  }

  getModuleColor(module: string): string {
    return MODULE_COLORS[module] || '#888888';
  }

  getModuleName(module: string): string {
    return MODULE_NAMES[module] || module;
  }
}

export const effectDatabase = new EffectDatabaseService();
