// Effect Lookup System for GP-200 Preset Export
// Maps effect names to official hardware codes

import {
  OfficialEffect,
  ParameterDef,
  PRE_EFFECTS,
  WAH_EFFECTS,
  DST_EFFECTS,
  AMP_EFFECTS,
} from './official-gp200-data';

// CAB Block codes
export const CAB_CODES: Record<string, number> = {
  'SUP ZEP': 134217728,
  'TWD CP': 134217729,
  'TWD PRC': 134217730,
  'TWD SUP': 134217731,
  'TWD LUX': 134217732,
  'Dark Lux': 134217733,
  'Dark VIT': 134217734,
  'Dark Twin': 134217735,
  'Dark CS': 134217736,
  'Bellman 1': 134217737,
  'Bellman 2': 134217738,
  'J-120': 134217739,
  'UK G12': 134217740,
  'UK GRN 1': 134217741,
  'UK LD': 134217742,
  'UK TD': 134217743,
  'UK MD': 134217744,
  'UK GRN 2': 134217745,
  'UK 75': 134217746,
  'UK Dark': 134217747,
  'Foxy 1': 134217748,
  'Foxy 2': 134217749,
  'ROUT': 134217750,
  'BogSV': 134217751,
  'Bad-KT': 134217752,
  'Match': 134217753,
  'Tom Open': 134217754,
  'ACE': 134217755,
  'Mess': 134217756,
  'D Star': 134217757,
  'SUP Star': 134217758,
  'US STO': 134217759,
  'BOUTI': 134217760,
  'SUP': 134217761,
  'MATT TWD': 134217762,
  'Freed': 134217763,
  'DB Rock': 134217764,
  'Blue SK': 134217765,
  'EV': 134217766,
  'Bog': 134217767,
  'Eagle': 134217768,
  'Uban': 134217769,
  'Solo': 134217770,
  'Juice': 134217771,
  'H-WAY': 134217772,
  'Way': 134217773,
  'Dumb': 134217774,
  'Dizz': 134217775,
  'TRP': 134217776,
  'King': 134217777,
  // Bass Cabinets
  'ADM 1': 134217778,
  'ADM 2': 134217779,
  'Workman 1': 134217780,
  'Workman 2': 134217781,
  'US BASS': 134217782,
  'MATT': 134217783,
  'F-TOP': 134217784,
  'AMPG 1': 134217785,
  'AMPG 2': 134217786,
  'HACK': 134217787,
  // Acoustic
  'AC': 134217788,
  'AC Dream': 134217789,
  'OM': 134217790,
  'Jumbo': 134217791,
  'Bird': 134217792,
  'GA': 134217793,
  'Classic AC': 134217794,
  'Mandolin': 134217795,
  'Fretless Bass': 134217796,
  'Double Bass': 134217797,
};

// NR Block codes
export const NR_CODES: Record<string, number> = {
  'Gate 1': 150994944,
  'Gate 2': 150994945,
  'Auto Swell': 150994946,
  'Hold': 150994947,
};

// EQ Block codes
export const EQ_CODES: Record<string, number> = {
  'Guitar EQ 1': 167772160,
  'Guitar EQ 2': 167772161,
  'Bass EQ 1': 167772162,
  'Bass EQ 2': 167772163,
  'Mess EQ': 167772164,
  'Hyper EQ': 167772165,
};

// MOD Block codes
export const MOD_CODES: Record<string, number> = {
  'G-Chorus': 184549376,
  'C-Chorus': 184549377,
  'M-Chorus': 184549378,
  'Jet': 184549379,
  'B-Jet': 184549380,
  'N-Jet': 184549381,
  'Trem Jet': 184549382,
  'V-Roto': 184549383,
  'G-Roto': 184549384,
  'Vibrato': 184549385,
  'Vibrato T': 184549386,
  'O-Phase': 184549387,
  'G-Phase': 184549388,
  'S-Phaser': 184549389,
  'Pan Phase': 184549390,
  'M-Vibe': 184549391,
  'Vibe': 184549392,
  'O-Trem': 184549393,
  'Sine Trem': 184549394,
  'Triangle Trem': 184549395,
  'Bias Trem': 184549396,
  'Detune': 184549397,
  'Bit Smash': 184549398,
  'Auto Swell': 184549399,
  'Hold': 184549400,
  'Saturate': 184549401,
};

// DLY Block codes
export const DLY_CODES: Record<string, number> = {
  'BBD Delay S': 201326592,
  'Digital Delay S': 201326593,
  'Tape Delay S': 201326594,
  'Ambience 1': 201326595,
  'Ambience 2': 201326596,
  'Pure': 201326597,
  'Analog': 201326598,
  'Tape': 201326599,
  'Ping Pong': 201326600,
  'Slapback': 201326601,
  'Sweep Echo': 201326602,
  'Ring Echo': 201326603,
  'Tube': 201326604,
  'M-Echo': 201326605,
  'Sweet Echo': 201326606,
  '999 Echo': 201326607,
  'Vintage Rack': 201326608,
  'Lofi Echo': 201326609,
  'Rev Echo': 201326610,
  'Dual Echo': 201326611,
  'Ice Delay': 201326612,
};

// RVB Block codes
export const RVB_CODES: Record<string, number> = {
  'Room': 218103808,
  'Hall': 218103809,
  'Church': 218103810,
  'Plate': 218103811,
  'Spring': 218103812,
  'Tube Spring': 218103813,
  'Amp Sprint': 218103814,
  'Studio': 218103815,
  'Club': 218103816,
  'Concert': 218103817,
  'Arena': 218103818,
  'N-Star': 218103819,
  'Deepsea': 218103820,
  'Sweet Space': 218103821,
  'Shimmer': 218103822,
};

// All effects from official data combined
const ALL_EFFECTS: OfficialEffect[] = [
  ...PRE_EFFECTS,
  ...WAH_EFFECTS,
  ...DST_EFFECTS,
  ...AMP_EFFECTS,
];

// Build lookup maps for fast access
const effectsByName = new Map<string, OfficialEffect>();
const effectsByCode = new Map<number, OfficialEffect>();

ALL_EFFECTS.forEach(effect => {
  effectsByName.set(effect.name.toLowerCase(), effect);
  effectsByCode.set(effect.code, effect);
});

/**
 * Get an effect by its GP-200 display name
 */
export function getEffectByName(module: string, name: string): OfficialEffect | undefined {
  // First check official effects data
  const effect = effectsByName.get(name.toLowerCase());
  if (effect && effect.module === module) {
    return effect;
  }

  // If not found in official data, try to find by module and name
  return ALL_EFFECTS.find(e =>
    e.module === module && e.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get the hardware code for an effect
 */
export function getEffectCode(module: string, name: string): number | undefined {
  // Check official effect data first
  const effect = getEffectByName(module, name);
  if (effect) {
    return effect.code;
  }

  // Fall back to lookup tables for other modules
  switch (module) {
    case 'CAB':
      return CAB_CODES[name];
    case 'NR':
      return NR_CODES[name];
    case 'EQ':
      return EQ_CODES[name];
    case 'MOD':
      return MOD_CODES[name];
    case 'DLY':
      return DLY_CODES[name];
    case 'REV':
    case 'RVB':
      return RVB_CODES[name];
    default:
      return undefined;
  }
}

/**
 * Get parameter definitions for an effect
 */
export function getParameterDefs(module: string, effectName: string): ParameterDef[] {
  const effect = getEffectByName(module, effectName);
  return effect?.parameters ?? [];
}

/**
 * Get an effect by its hardware code
 */
export function getEffectByCode(code: number): OfficialEffect | undefined {
  return effectsByCode.get(code);
}

/**
 * Check if a name matches a valid effect for the given module
 */
export function isValidEffect(module: string, name: string): boolean {
  return getEffectCode(module, name) !== undefined;
}

/**
 * Find the closest matching effect name (for fuzzy matching)
 */
export function findClosestEffect(module: string, searchName: string): string | undefined {
  const search = searchName.toLowerCase();

  // Try exact match first
  const code = getEffectCode(module, searchName);
  if (code !== undefined) {
    return searchName;
  }

  // Try partial match
  const moduleEffects = ALL_EFFECTS.filter(e => e.module === module);
  for (const effect of moduleEffects) {
    if (effect.name.toLowerCase().includes(search) ||
        search.includes(effect.name.toLowerCase())) {
      return effect.name;
    }
  }

  // Check lookup tables for other modules
  let lookupTable: Record<string, number> | undefined;
  switch (module) {
    case 'CAB': lookupTable = CAB_CODES; break;
    case 'NR': lookupTable = NR_CODES; break;
    case 'EQ': lookupTable = EQ_CODES; break;
    case 'MOD': lookupTable = MOD_CODES; break;
    case 'DLY': lookupTable = DLY_CODES; break;
    case 'REV':
    case 'RVB': lookupTable = RVB_CODES; break;
  }

  if (lookupTable) {
    for (const name of Object.keys(lookupTable)) {
      if (name.toLowerCase().includes(search) ||
          search.includes(name.toLowerCase())) {
        return name;
      }
    }
  }

  return undefined;
}

/**
 * Get all effect names for a module
 */
export function getAllEffectNames(module: string): string[] {
  const effects = ALL_EFFECTS.filter(e => e.module === module);
  const names = effects.map(e => e.name);

  // Add from lookup tables
  switch (module) {
    case 'CAB': return [...names, ...Object.keys(CAB_CODES)];
    case 'NR': return [...names, ...Object.keys(NR_CODES)];
    case 'EQ': return [...names, ...Object.keys(EQ_CODES)];
    case 'MOD': return [...names, ...Object.keys(MOD_CODES)];
    case 'DLY': return [...names, ...Object.keys(DLY_CODES)];
    case 'REV':
    case 'RVB': return [...names, ...Object.keys(RVB_CODES)];
    default: return names;
  }
}
