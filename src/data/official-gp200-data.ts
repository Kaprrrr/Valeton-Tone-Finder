// Official GP-200 Effect Data with Hardware Codes
// These codes are used for exporting presets to GP-200 hardware

export interface ParameterDef {
  id: number;
  name: string;
  min: number;
  max: number;
  defaultValue: number;
  type: 'knob' | 'switch' | 'combox';
}

export interface OfficialEffect {
  code: number;
  name: string;
  module: 'PRE' | 'WAH' | 'DST' | 'AMP' | 'CAB' | 'NR' | 'EQ' | 'MOD' | 'DLY' | 'RVB';
  basedOn: string;
  description?: string;
  parameters: ParameterDef[];
}

// Common parameter definitions
const KNOB_0_100: Omit<ParameterDef, 'id' | 'name'> = { min: 0, max: 100, defaultValue: 50, type: 'knob' };
const SWITCH_ON_OFF: Omit<ParameterDef, 'id' | 'name'> = { min: 0, max: 1, defaultValue: 0, type: 'switch' };

// ============================================
// PRE BLOCK EFFECTS
// ============================================
export const PRE_EFFECTS: OfficialEffect[] = [
  // Compressors
  { code: 16777216, name: 'COMP', module: 'PRE', basedOn: 'Ross Compressor', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Sustain', ...KNOB_0_100 },
    { id: 2, name: 'Attack', ...KNOB_0_100 },
  ]},
  { code: 16777217, name: 'COMP4', module: 'PRE', basedOn: 'Keeley C4 Compressor', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Sustain', ...KNOB_0_100 },
    { id: 2, name: 'Attack', ...KNOB_0_100 },
    { id: 3, name: 'Clipping', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},
  { code: 16777218, name: 'S-Comp', module: 'PRE', basedOn: 'VALETON', description: 'Flexible compressor', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Threshold', ...KNOB_0_100 },
    { id: 2, name: 'Ratio', min: 0, max: 100, defaultValue: 30, type: 'knob' },
    { id: 3, name: 'Attack', ...KNOB_0_100 },
    { id: 4, name: 'Release', ...KNOB_0_100 },
  ]},

  // Boosts
  { code: 16777219, name: 'Micro Boost', module: 'PRE', basedOn: 'MXR M133 Micro Amp', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
  ]},
  { code: 16777220, name: 'AC Boost', module: 'PRE', basedOn: 'Xotic AC Booster', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 16777221, name: 'B-Boost', module: 'PRE', basedOn: 'Xotic BB Preamp', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 16777222, name: 'P-Boost', module: 'PRE', basedOn: 'Xotic RC Booster', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 16777223, name: '14 Boost', module: 'PRE', basedOn: 'Fortin Grind Booster', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Tight', ...KNOB_0_100 },
  ]},
  { code: 16777224, name: 'FAT BB', module: 'PRE', basedOn: 'Xotic BB Preamp variant', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Lo Cut', ...KNOB_0_100 },
  ]},
  { code: 16777225, name: 'Boost', module: 'PRE', basedOn: 'Xotic EP Booster', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Bright', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},

  // Overdrives
  { code: 16777226, name: 'OD 9', module: 'PRE', basedOn: 'Ibanez Tube Screamer TS9', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 16777227, name: 'Yellow OD', module: 'PRE', basedOn: 'Boss OD-1 Overdrive', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
  ]},
  { code: 16777228, name: 'Penesas', module: 'PRE', basedOn: 'Klon Centaur', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 16777229, name: 'Super OD', module: 'PRE', basedOn: 'Boss Super Overdrive SD-1', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 16777230, name: 'Blues OD', module: 'PRE', basedOn: 'Boss Blues Driver BD-2', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},

  // Acoustic
  { code: 16777231, name: 'AC Refiner', module: 'PRE', basedOn: 'VALETON', description: 'Acoustic refiner', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Body', ...KNOB_0_100 },
    { id: 2, name: 'Top', ...KNOB_0_100 },
  ]},
  { code: 16777232, name: 'AC Sim', module: 'PRE', basedOn: 'VALETON', description: 'Acoustic Simulator', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Body', ...KNOB_0_100 },
    { id: 2, name: 'Top', ...KNOB_0_100 },
  ]},

  // Filters
  { code: 16777233, name: 'T-Wah', module: 'PRE', basedOn: 'VALETON', description: 'Touch Wah', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Sens', ...KNOB_0_100 },
    { id: 2, name: 'Q', ...KNOB_0_100 },
    { id: 3, name: 'Mode', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},
  { code: 16777234, name: 'A-WAH', module: 'PRE', basedOn: 'VALETON', description: 'Auto Wah', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Rate', ...KNOB_0_100 },
    { id: 2, name: 'Depth', ...KNOB_0_100 },
  ]},
  { code: 16777235, name: 'Step Filter', module: 'PRE', basedOn: 'VALETON', description: 'Step Filter', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Rate', ...KNOB_0_100 },
    { id: 2, name: 'Depth', ...KNOB_0_100 },
    { id: 3, name: 'Res', ...KNOB_0_100 },
  ]},

  // Pitch
  { code: 16777236, name: 'OCTA', module: 'PRE', basedOn: 'VALETON', description: 'Polyphonic octave', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Dry', ...KNOB_0_100 },
    { id: 2, name: 'Oct -1', ...KNOB_0_100 },
    { id: 3, name: 'Oct +1', ...KNOB_0_100 },
  ]},
  { code: 16777237, name: 'Pitch', module: 'PRE', basedOn: 'VALETON', description: 'Pitch shifter', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Shift', min: -24, max: 24, defaultValue: 0, type: 'knob' },
    { id: 2, name: 'Fine', min: -50, max: 50, defaultValue: 0, type: 'knob' },
    { id: 3, name: 'Mix', ...KNOB_0_100 },
  ]},
  { code: 16777238, name: 'P-Bend', module: 'PRE', basedOn: 'VALETON', description: 'Pitch bend', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Shift', min: -24, max: 24, defaultValue: 0, type: 'knob' },
    { id: 2, name: 'Mix', ...KNOB_0_100 },
  ]},
  { code: 16777239, name: 'Hammy', module: 'PRE', basedOn: 'Digitech Whammy', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Position', ...KNOB_0_100 },
    { id: 2, name: 'Mode', min: 0, max: 9, defaultValue: 0, type: 'combox' },
  ]},
  { code: 16777240, name: 'Harmonizer 1', module: 'PRE', basedOn: 'VALETON', description: 'Single harmonizer', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Key', min: 0, max: 11, defaultValue: 0, type: 'combox' },
    { id: 2, name: 'Scale', min: 0, max: 7, defaultValue: 0, type: 'combox' },
    { id: 3, name: 'Harmony', min: -8, max: 8, defaultValue: 3, type: 'knob' },
    { id: 4, name: 'Mix', ...KNOB_0_100 },
  ]},
  { code: 16777241, name: 'Harmonizer 2', module: 'PRE', basedOn: 'VALETON', description: 'Dual harmonizer', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Key', min: 0, max: 11, defaultValue: 0, type: 'combox' },
    { id: 2, name: 'Scale', min: 0, max: 7, defaultValue: 0, type: 'combox' },
    { id: 3, name: 'Harm 1', min: -8, max: 8, defaultValue: 3, type: 'knob' },
    { id: 4, name: 'Harm 2', min: -8, max: 8, defaultValue: 5, type: 'knob' },
    { id: 5, name: 'Mix', ...KNOB_0_100 },
  ]},

  // Special
  { code: 16777242, name: 'Ring Mod', module: 'PRE', basedOn: 'VALETON', description: 'Ring modulator', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Freq', ...KNOB_0_100 },
    { id: 2, name: 'Mix', ...KNOB_0_100 },
  ]},
  { code: 16777243, name: 'Saturate', module: 'PRE', basedOn: 'VALETON', description: 'Tape saturation', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 16777244, name: 'Auto Swell', module: 'PRE', basedOn: 'VALETON', description: 'Auto swell', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Attack', ...KNOB_0_100 },
    { id: 2, name: 'Release', ...KNOB_0_100 },
  ]},
  { code: 16777245, name: 'Hold', module: 'PRE', basedOn: 'VALETON', description: 'Freeze effect', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Mode', min: 0, max: 2, defaultValue: 0, type: 'combox' },
    { id: 2, name: 'Decay', ...KNOB_0_100 },
  ]},
];

// ============================================
// WAH BLOCK EFFECTS
// ============================================
export const WAH_EFFECTS: OfficialEffect[] = [
  { code: 33554432, name: 'V-Wah', module: 'WAH', basedOn: 'VOX V846 Wah Pedal', parameters: [
    { id: 0, name: 'Position', ...KNOB_0_100 },
    { id: 1, name: 'Min', min: 0, max: 100, defaultValue: 0, type: 'knob' },
    { id: 2, name: 'Max', min: 0, max: 100, defaultValue: 100, type: 'knob' },
  ]},
  { code: 33554433, name: 'C-Wah', module: 'WAH', basedOn: 'Dunlop Cry Baby Wah Pedal', parameters: [
    { id: 0, name: 'Position', ...KNOB_0_100 },
    { id: 1, name: 'Min', min: 0, max: 100, defaultValue: 0, type: 'knob' },
    { id: 2, name: 'Max', min: 0, max: 100, defaultValue: 100, type: 'knob' },
  ]},
  { code: 33554434, name: 'P-Wah', module: 'WAH', basedOn: 'Dunlop Cry-Baby JP95 (John Petrucci)', parameters: [
    { id: 0, name: 'Position', ...KNOB_0_100 },
    { id: 1, name: 'Min', min: 0, max: 100, defaultValue: 0, type: 'knob' },
    { id: 2, name: 'Max', min: 0, max: 100, defaultValue: 100, type: 'knob' },
  ]},
  { code: 33554435, name: 'S-Wah', module: 'WAH', basedOn: 'VALETON', description: 'Classic Wah', parameters: [
    { id: 0, name: 'Position', ...KNOB_0_100 },
    { id: 1, name: 'Min', min: 0, max: 100, defaultValue: 0, type: 'knob' },
    { id: 2, name: 'Max', min: 0, max: 100, defaultValue: 100, type: 'knob' },
  ]},
  { code: 33554436, name: 'B-Wah', module: 'WAH', basedOn: 'VALETON', description: 'Bass Wah', parameters: [
    { id: 0, name: 'Position', ...KNOB_0_100 },
    { id: 1, name: 'Min', min: 0, max: 100, defaultValue: 0, type: 'knob' },
    { id: 2, name: 'Max', min: 0, max: 100, defaultValue: 100, type: 'knob' },
  ]},
  { code: 33554437, name: 'Hammy', module: 'WAH', basedOn: 'Digitech Whammy', parameters: [
    { id: 0, name: 'Position', ...KNOB_0_100 },
    { id: 1, name: 'Mode', min: 0, max: 9, defaultValue: 0, type: 'combox' },
  ]},
];

// ============================================
// DST BLOCK EFFECTS
// ============================================
export const DST_EFFECTS: OfficialEffect[] = [
  // Overdrives
  { code: 50331648, name: 'Green OD', module: 'DST', basedOn: 'Ibanez TS-808 Tube Screamer', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 50331649, name: 'OD 9', module: 'DST', basedOn: 'Ibanez Tube Screamer TS9', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 50331650, name: 'Yellow OD', module: 'DST', basedOn: 'Boss OD-1 Overdrive', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
  ]},
  { code: 50331651, name: 'Penesas', module: 'DST', basedOn: 'Klon Centaur', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 50331652, name: 'Swarm', module: 'DST', basedOn: 'Providence SOV-2 Stampede Overdrive', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 50331653, name: 'Super OD', module: 'DST', basedOn: 'Boss Super Overdrive SD-1', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 50331654, name: 'Scream OD', module: 'DST', basedOn: 'VALETON', description: 'TS variant', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
    { id: 3, name: 'Bass', ...KNOB_0_100 },
  ]},
  { code: 50331655, name: 'Blues OD', module: 'DST', basedOn: 'Boss Blues Driver BD-2', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 50331656, name: 'Force', module: 'DST', basedOn: 'Fulltone OCD', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
    { id: 3, name: 'HP/LP', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},
  { code: 50331657, name: 'Blues Master', module: 'DST', basedOn: 'Marshall Blues Breaker', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 50331658, name: 'Master OD', module: 'DST', basedOn: 'Marshall JCM800', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Middle', ...KNOB_0_100 },
    { id: 4, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 50331659, name: 'Tube Clipper', module: 'DST', basedOn: 'BK Butler Tube Driver', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Hi', ...KNOB_0_100 },
    { id: 3, name: 'Lo', ...KNOB_0_100 },
  ]},
  { code: 50331660, name: 'TaiChi', module: 'DST', basedOn: 'Hermida Zendrive', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Voice', ...KNOB_0_100 },
    { id: 3, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 50331661, name: 'Timmy OD', module: 'DST', basedOn: 'Timmy Overdrive V2/V3', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Mode', min: 0, max: 2, defaultValue: 0, type: 'combox' },
  ]},
  { code: 50331662, name: 'Precise OD', module: 'DST', basedOn: 'Horizon Devices Precision Drive', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Bright', ...KNOB_0_100 },
    { id: 3, name: 'Attack', ...KNOB_0_100 },
    { id: 4, name: 'Gate', ...KNOB_0_100 },
  ]},
  { code: 50331663, name: 'Empire OD', module: 'DST', basedOn: 'Analog Man Prince of Tone', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
    { id: 3, name: 'Mode', min: 0, max: 2, defaultValue: 0, type: 'combox' },
  ]},

  // Fuzz
  { code: 50331664, name: 'Lazaro', module: 'DST', basedOn: 'Electro-Harmonix Big Muff Pi', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Sustain', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 50331665, name: 'Red Haze', module: 'DST', basedOn: 'Dallas-Arbiter Fuzz Face', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Fuzz', ...KNOB_0_100 },
  ]},
  { code: 50331666, name: 'Sora Fuzz', module: 'DST', basedOn: 'Sola Sound Tone Bender', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Attack', ...KNOB_0_100 },
  ]},
  { code: 50331667, name: 'Plustortion', module: 'DST', basedOn: 'MXR Distortion+ M104', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Distortion', ...KNOB_0_100 },
  ]},

  // Distortion
  { code: 50331668, name: 'SM Dist', module: 'DST', basedOn: 'Boss DS-1 Distortion', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Dist', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
  ]},
  { code: 50331669, name: 'Darktale', module: 'DST', basedOn: 'ProCo RAT', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Distortion', ...KNOB_0_100 },
    { id: 2, name: 'Filter', ...KNOB_0_100 },
  ]},
  { code: 50331670, name: 'Chief', module: 'DST', basedOn: "Marshall Guv'nor", parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Middle', ...KNOB_0_100 },
    { id: 4, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 50331671, name: 'Master Dist', module: 'DST', basedOn: 'Marshall Shredmaster', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Contour', ...KNOB_0_100 },
    { id: 4, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 50331672, name: 'La Charger', module: 'DST', basedOn: 'MI Audio Crunch Box', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Presence', ...KNOB_0_100 },
  ]},
  { code: 50331673, name: 'Revolt', module: 'DST', basedOn: 'Suhr Riot Distortion', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
    { id: 3, name: 'Voice', min: 0, max: 2, defaultValue: 1, type: 'combox' },
  ]},
  { code: 50331674, name: 'Flagman', module: 'DST', basedOn: 'Friedman BE-OD', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Tight', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},

  // Bass
  { code: 50331675, name: 'Flex OD', module: 'DST', basedOn: 'VALETON', description: 'Guitar/Bass drive', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 50331676, name: 'Bass OD', module: 'DST', basedOn: 'VALETON', description: 'Bass overdrive', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Tone', ...KNOB_0_100 },
    { id: 3, name: 'Blend', ...KNOB_0_100 },
  ]},
  { code: 50331677, name: 'Black Bass', module: 'DST', basedOn: 'Darkglass Microtubes B7K', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Blend', ...KNOB_0_100 },
    { id: 3, name: 'Low', ...KNOB_0_100 },
    { id: 4, name: 'Low Mid', ...KNOB_0_100 },
    { id: 5, name: 'High Mid', ...KNOB_0_100 },
    { id: 6, name: 'High', ...KNOB_0_100 },
    { id: 7, name: 'Attack', min: 0, max: 1, defaultValue: 0, type: 'switch' },
    { id: 8, name: 'Grunt', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},
  { code: 50331678, name: 'Bass Hammer', module: 'DST', basedOn: 'Aguilar Tone Hammer', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Drive', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Mid', ...KNOB_0_100 },
    { id: 4, name: 'Treble', ...KNOB_0_100 },
    { id: 5, name: 'Mid Freq', min: 0, max: 100, defaultValue: 50, type: 'knob' },
  ]},

  // Boosts in DST
  { code: 50331679, name: 'Micro Boost', module: 'DST', basedOn: 'MXR M133 Micro Amp', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
  ]},
  { code: 50331680, name: 'AC Boost', module: 'DST', basedOn: 'Xotic AC Booster', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 50331681, name: 'B-Boost', module: 'DST', basedOn: 'Xotic BB Preamp', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 50331682, name: 'P-Boost', module: 'DST', basedOn: 'Xotic RC Booster', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
  ]},
  { code: 50331683, name: '14 Boost', module: 'DST', basedOn: 'Fortin Grind Booster', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Tight', ...KNOB_0_100 },
  ]},
  { code: 50331684, name: 'FAT BB', module: 'DST', basedOn: 'Xotic BB Preamp variant', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Gain', ...KNOB_0_100 },
    { id: 2, name: 'Bass', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Lo Cut', ...KNOB_0_100 },
  ]},
  { code: 50331685, name: 'Boost', module: 'DST', basedOn: 'Xotic EP Booster', parameters: [
    { id: 0, name: 'Level', ...KNOB_0_100 },
    { id: 1, name: 'Bright', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},
];

// ============================================
// AMP BLOCK
// ============================================
export const AMP_EFFECTS: OfficialEffect[] = [
  // Clean - Fender
  { code: 117440512, name: 'Tweedy', module: 'AMP', basedOn: 'Fender Tweed Deluxe', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440513, name: 'Bellman 59N', module: 'AMP', basedOn: 'Fender 59 Bassman Normal Channel', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440514, name: 'Bellman 59B', module: 'AMP', basedOn: 'Fender 59 Bassman Bright Channel', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440515, name: 'Dark Twin', module: 'AMP', basedOn: 'Fender 65 Twin Reverb', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
    { id: 6, name: 'Bright', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},
  { code: 117440516, name: 'Dark DLX', module: 'AMP', basedOn: 'Fender Deluxe Reverb', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440517, name: 'Dark Vibra', module: 'AMP', basedOn: 'Fender Vibraverb 1963 6G16', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440518, name: 'Silver Twin', module: 'AMP', basedOn: 'Fender Silverface Twin Reverb', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
    { id: 6, name: 'Bright', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},

  // Supro
  { code: 117440519, name: 'SUPDual CL', module: 'AMP', basedOn: 'Supro Dual Tone 1624T', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440520, name: 'SUPDual OD', module: 'AMP', basedOn: 'Supro Dual Tone 1624T', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // Vox
  { code: 117440521, name: 'Foxy 15TB', module: 'AMP', basedOn: 'VOX AC-100 Bass Amp 4x12', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440522, name: 'Foxy 30N', module: 'AMP', basedOn: 'VOX AC30HW', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440523, name: 'Foxy 30TB', module: 'AMP', basedOn: 'VOX AC30 Top Boost', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // Roland
  { code: 117440524, name: 'J-120 CL', module: 'AMP', basedOn: 'Roland Jazz Chorus JC-120', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
    { id: 6, name: 'Bright', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},

  // Boutique
  { code: 117440525, name: 'Match CL', module: 'AMP', basedOn: 'Matchless Chieftain 212 Combo', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440526, name: 'Match OD', module: 'AMP', basedOn: 'Matchless Chieftain 212 Combo', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440527, name: 'L-Star CL', module: 'AMP', basedOn: 'Mesa Boogie Lone Star CH1', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440528, name: 'L-Star OD', module: 'AMP', basedOn: 'Mesa Boogie Lone Star CH2', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440529, name: 'BogSV CL', module: 'AMP', basedOn: 'Bogner Shiva 20th Anniversary CH1', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
    { id: 6, name: 'Bright', min: 0, max: 1, defaultValue: 0, type: 'switch' },
  ]},
  { code: 117440530, name: 'BogSV OD', module: 'AMP', basedOn: 'Bogner Shiva 20th Anniversary CH2', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440531, name: 'Bog BlueV', module: 'AMP', basedOn: 'Bogner Ecstasy XTC Blue Channel', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440532, name: 'Bog BluM', module: 'AMP', basedOn: 'Bogner Ecstasy XTC Blue Channel', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440533, name: 'Bog RedV', module: 'AMP', basedOn: 'Bogner Ecstasy XTC Red Channel', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440534, name: 'Bog RedM', module: 'AMP', basedOn: 'Bogner Ecstasy XTC Red Channel', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440535, name: 'Z38 CL', module: 'AMP', basedOn: 'Dr. Z Maz 38 Sr. Combo', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440536, name: 'ZL38 OD', module: 'AMP', basedOn: 'Dr. Z Maz 38 Sr. Combo', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440537, name: 'Knights CL', module: 'AMP', basedOn: 'Pendragon Grindrod PG20C', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440538, name: 'Knights CL+', module: 'AMP', basedOn: 'Pendragon Grindrod PG20C', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440539, name: 'Knights OD', module: 'AMP', basedOn: 'Pendragon Grindrod PG20C', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440540, name: 'Bad-KT CL', module: 'AMP', basedOn: 'Bad Cat Hot Cat 30', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440541, name: 'Bad-KT OD', module: 'AMP', basedOn: 'Bad Cat Hot Cat 30', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // Soldano
  { code: 117440542, name: 'Solo100 CL', module: 'AMP', basedOn: 'Soldano SLO100 Clean Channel', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440543, name: 'Solo100 OD', module: 'AMP', basedOn: 'Soldano SLO100 Crunch Channel', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440544, name: 'Solo100 LD', module: 'AMP', basedOn: 'Soldano SLO100 Overdrive Channel', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // Marshall
  { code: 117440545, name: 'UK 45', module: 'AMP', basedOn: 'Marshall JMP45 Plexi', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440546, name: 'UK 45+', module: 'AMP', basedOn: 'Marshall JMP45 Plexi', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440547, name: 'UK 45JP', module: 'AMP', basedOn: 'Marshall JMP45 Plexi', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440548, name: 'UK 50', module: 'AMP', basedOn: 'Marshall JMP50 (1966)', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440549, name: 'UK 50+', module: 'AMP', basedOn: 'Marshall JMP50 (1966)', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440550, name: 'UK 50JP', module: 'AMP', basedOn: 'Marshall JMP50 (1966)', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440551, name: 'UK SLP', module: 'AMP', basedOn: 'Marshall 1959HW Super Lead Plexi', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440552, name: 'UK 800', module: 'AMP', basedOn: 'Marshall JCM800', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440553, name: 'UK 900', module: 'AMP', basedOn: 'Marshall JCM900', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // Friedman
  { code: 117440554, name: 'Flagman 1', module: 'AMP', basedOn: 'Friedman Brown Eye (BE-100)', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440555, name: 'Flagman 2', module: 'AMP', basedOn: 'Friedman Brown Eye (BE-100)', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440556, name: 'Flagman+ 1', module: 'AMP', basedOn: 'Friedman Brown Eye (BE-100)', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440557, name: 'Flagman+ 2', module: 'AMP', basedOn: 'Friedman Brown Eye (BE-100)', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // Mesa Boogie
  { code: 117440558, name: 'Mess2C+ 1', module: 'AMP', basedOn: 'Mesa/Boogie Mark IIC+', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440559, name: 'Mess2C+ 2', module: 'AMP', basedOn: 'Mesa/Boogie Mark IIC+', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440560, name: 'Mess2C+ 3', module: 'AMP', basedOn: 'Mesa/Boogie Mark IIC+', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440561, name: 'Mess4 LD 1', module: 'AMP', basedOn: 'Mesa/Boogie Mark IV', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440562, name: 'Mess4 LD 2', module: 'AMP', basedOn: 'Mesa/Boogie Mark IV', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440563, name: 'Mess4 LD 3', module: 'AMP', basedOn: 'Mesa/Boogie Mark IV', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440564, name: 'Mess DualV', module: 'AMP', basedOn: 'Mesa/Boogie Dual Rectifier Vintage', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440565, name: 'Mess DualM', module: 'AMP', basedOn: 'Mesa/Boogie Dual Rectifier Modern', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // Orange
  { code: 117440566, name: 'Juice30 OD', module: 'AMP', basedOn: 'Orange AD30', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440567, name: 'Juice R100', module: 'AMP', basedOn: 'Orange Rockerverb 100', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // EVH/Peavey
  { code: 117440568, name: 'EV 51', module: 'AMP', basedOn: 'Peavey 5150 / EVH 5150', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // ENGL
  { code: 117440569, name: 'Eagle 120', module: 'AMP', basedOn: 'ENGL Savage 120', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440570, name: 'Eagle 120+', module: 'AMP', basedOn: 'ENGL Savage 120', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440571, name: 'Power LD', module: 'AMP', basedOn: 'ENGL Powerball II E645/2', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // Diezel
  { code: 117440572, name: 'Dizz VH', module: 'AMP', basedOn: 'Diezel VH4', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440573, name: 'Dizz VH S', module: 'AMP', basedOn: 'Diezel VH4', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440574, name: 'Dizz VH+', module: 'AMP', basedOn: 'Diezel VH4', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440575, name: 'Dizz VH+ S', module: 'AMP', basedOn: 'Diezel VH4', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // Bass Amps
  { code: 117440576, name: 'Classic Bass', module: 'AMP', basedOn: 'Ampeg SVT', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440577, name: 'Foxy Bass', module: 'AMP', basedOn: 'VOX AC-100 Bass Amp', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440578, name: 'Mess Bass', module: 'AMP', basedOn: 'Mesa/Boogie Bass 400', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440579, name: 'Mini Bass', module: 'AMP', basedOn: 'Ampeg B-15 Portaflex', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440580, name: 'Bass Pre', module: 'AMP', basedOn: 'Alembic F-2B Bass Preamp', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},

  // Acoustic
  { code: 117440581, name: 'AC Pre', module: 'AMP', basedOn: 'AER Colourizer 2 (EQ 90-1.6kHz)', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
  { code: 117440582, name: 'AC Pre 2', module: 'AMP', basedOn: 'AER Colourizer 2 (EQ 680Hz-11kHz)', parameters: [
    { id: 0, name: 'Gain', ...KNOB_0_100 },
    { id: 1, name: 'Bass', ...KNOB_0_100 },
    { id: 2, name: 'Middle', ...KNOB_0_100 },
    { id: 3, name: 'Treble', ...KNOB_0_100 },
    { id: 4, name: 'Presence', ...KNOB_0_100 },
    { id: 5, name: 'Master', ...KNOB_0_100 },
  ]},
];

// Export all effects combined
export const ALL_OFFICIAL_EFFECTS: OfficialEffect[] = [
  ...PRE_EFFECTS,
  ...WAH_EFFECTS,
  ...DST_EFFECTS,
  ...AMP_EFFECTS,
];
