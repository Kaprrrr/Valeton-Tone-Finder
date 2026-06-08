import { EffectModel } from '../types';

// PRE Effects (Compressors, Boosters, Overdrives placed before amp)
export const PRE_EFFECTS: EffectModel[] = [
  // Compressors
  { name: 'COMP', type: 'Compressor', basedOn: 'Ross Compressor' },
  { name: 'COMP4', type: 'Compressor', basedOn: 'Keeley C4 Compressor' },
  { name: 'S-Comp', type: 'Compressor', basedOn: 'Valeton Flexible Compressor' },

  // Boosters
  { name: 'Micro Boost', type: 'Boost', basedOn: 'MXR M133 Micro Amp' },
  { name: 'AC Boost', type: 'Boost', basedOn: 'Xotic AC Booster' },
  { name: 'B-Boost', type: 'Boost', basedOn: 'Xotic BB Preamp' },
  { name: 'P-Boost', type: 'Boost', basedOn: 'Xotic RC Booster' },
  { name: '14 Boost', type: 'Boost', basedOn: 'Fortin Grind Booster' },
  { name: 'FAT BB', type: 'Boost', basedOn: 'Valeton (Xotic BB style)' },
  { name: 'Boost', type: 'Boost', basedOn: 'Xotic EP Booster' },

  // Overdrives (PRE position)
  { name: 'OD 9', type: 'Overdrive', basedOn: 'Ibanez Tube Screamer TS9' },
  { name: 'Yellow OD', type: 'Overdrive', basedOn: 'Boss OD-1' },
  { name: 'Penesas', type: 'Overdrive', basedOn: 'Klon Centaur' },
  { name: 'Super OD', type: 'Overdrive', basedOn: 'Boss Super Overdrive SD-1' },
  { name: 'Blues OD', type: 'Overdrive', basedOn: 'Boss Blues Driver BD-2' },

  // Acoustic/Filter/Pitch
  { name: 'AC Refiner', type: 'Acoustic', basedOn: 'Valeton Acoustic Refiner' },
  { name: 'AC Sim', type: 'Acoustic', basedOn: 'Valeton Acoustic Simulator' },
  { name: 'T-Wah', type: 'Filter', basedOn: 'Valeton Touch Wah' },
  { name: 'A-WAH', type: 'Filter', basedOn: 'Valeton Auto Wah' },
  { name: 'Step Filter', type: 'Filter', basedOn: 'Valeton Step Filter' },
  { name: 'OCTA', type: 'Pitch', basedOn: 'Valeton Polyphonic Octave' },
  { name: 'Pitch', type: 'Pitch', basedOn: 'Valeton Pitch Shifter' },
  { name: 'P-Bend', type: 'Pitch', basedOn: 'Valeton Pitch Bend' },
  { name: 'Hammy', type: 'Pitch', basedOn: 'Digitech Whammy' },
  { name: 'Harmonizer 1', type: 'Pitch', basedOn: 'Valeton Single Harmonizer' },
  { name: 'Harmonizer 2', type: 'Pitch', basedOn: 'Valeton Dual Harmonizer' },

  // Special
  { name: 'Ring Mod', type: 'Special', basedOn: 'Valeton Ring Modulator' },
  { name: 'Saturate', type: 'Special', basedOn: 'Valeton Tape Saturation' },
  { name: 'Auto Swell', type: 'Special', basedOn: 'Valeton Volume Swell' },
  { name: 'Hold', type: 'Special', basedOn: 'Valeton Freeze Effect' },
];

// WAH Effects
export const WAH_EFFECTS: EffectModel[] = [
  { name: 'V-Wah', type: 'Wah', basedOn: 'VOX V846 Wah' },
  { name: 'C-Wah', type: 'Wah', basedOn: 'Dunlop Crybaby' },
  { name: 'P-Wah', type: 'Wah', basedOn: 'Dunlop JP95 (Petrucci)' },
  { name: 'S-Wah', type: 'Wah', basedOn: 'Valeton Classic Wah' },
  { name: 'B-Wah', type: 'Wah', basedOn: 'Valeton Bass Wah' },
  { name: 'Hammy', type: 'Pitch', basedOn: 'Digitech Whammy' },
];

// DST Effects (Distortion block)
export const DST_EFFECTS: EffectModel[] = [
  // Overdrives
  { name: 'Green OD', type: 'Overdrive', basedOn: 'Ibanez TS-808' },
  { name: 'OD 9', type: 'Overdrive', basedOn: 'Ibanez Tube Screamer TS9' },
  { name: 'Yellow OD', type: 'Overdrive', basedOn: 'Boss OD-1' },
  { name: 'Penesas', type: 'Overdrive', basedOn: 'Klon Centaur' },
  { name: 'Swarm', type: 'Overdrive', basedOn: 'Providence SOV-2 Stampede' },
  { name: 'Super OD', type: 'Overdrive', basedOn: 'Boss Super Overdrive SD-1' },
  { name: 'Scream OD', type: 'Overdrive', basedOn: 'Valeton Screamer (TS variant)' },
  { name: 'Blues OD', type: 'Overdrive', basedOn: 'Boss Blues Driver BD-2' },
  { name: 'Force', type: 'Overdrive', basedOn: 'Fulltone OCD' },
  { name: 'Blues Master', type: 'Overdrive', basedOn: 'Marshall Blues Breaker' },
  { name: 'Master OD', type: 'Overdrive', basedOn: 'Marshall JCM800 Preamp' },
  { name: 'TaiChi', type: 'Overdrive', basedOn: 'Hermida Zendrive' },
  { name: 'Timmy OD', type: 'Overdrive', basedOn: 'Timmy Overdrive V2/V3' },
  { name: 'Precise OD', type: 'Overdrive', basedOn: 'Horizon Precision Drive' },
  { name: 'Empire OD', type: 'Overdrive', basedOn: 'Analog Man Prince of Tone' },

  // Fuzz
  { name: 'Lazaro', type: 'Fuzz', basedOn: 'Electro-Harmonix Big Muff Pi' },
  { name: 'Red Haze', type: 'Fuzz', basedOn: 'Dallas-Arbiter Fuzz Face' },
  { name: 'Sora Fuzz', type: 'Fuzz', basedOn: 'Sola Sound Tone Bender' },
  { name: 'Plustortion', type: 'Fuzz', basedOn: 'MXR Distortion+ M104' },

  // Distortion
  { name: 'SM Dist', type: 'Distortion', basedOn: 'Boss DS-1' },
  { name: 'Darktale', type: 'Distortion', basedOn: 'ProCo RAT (LM308)' },
  { name: 'Chief', type: 'Distortion', basedOn: 'Marshall Guv\'nor' },
  { name: 'Master Dist', type: 'Distortion', basedOn: 'Marshall Shredmaster' },
  { name: 'La Charger', type: 'Distortion', basedOn: 'MI Audio Crunch Box' },
  { name: 'Revolt', type: 'Distortion', basedOn: 'Suhr Riot' },
  { name: 'Flagman', type: 'Distortion', basedOn: 'Friedman BE-OD' },

  // Bass
  { name: 'Flex OD', type: 'Bass Drive', basedOn: 'Valeton Bass/Guitar Drive' },
  { name: 'Bass OD', type: 'Bass Drive', basedOn: 'Valeton Bass Overdrive' },
  { name: 'Black Bass', type: 'Bass Preamp', basedOn: 'Darkglass Microtubes B7K' },
  { name: 'Bass Hammer', type: 'Bass Preamp', basedOn: 'Aguilar Tone Hammer' },

  // Boosters (also in DST)
  { name: 'Micro Boost', type: 'Boost', basedOn: 'MXR M133 Micro Amp' },
  { name: 'AC Boost', type: 'Boost', basedOn: 'Xotic AC Booster' },
  { name: 'B-Boost', type: 'Boost', basedOn: 'Xotic BB Preamp' },
  { name: 'P-Boost', type: 'Boost', basedOn: 'Xotic RC Booster' },
  { name: '14 Boost', type: 'Boost', basedOn: 'Fortin Grind Booster' },
  { name: 'FAT BB', type: 'Boost', basedOn: 'Valeton Fat BB' },
  { name: 'Boost', type: 'Boost', basedOn: 'Xotic EP Booster' },
];

// NR Effects (Noise Reduction)
export const NR_EFFECTS: EffectModel[] = [
  { name: 'Gate 1', type: 'Gate', basedOn: 'ISP Decimator' },
  { name: 'Gate 2', type: 'Gate', basedOn: 'Valeton Flexible Gate' },
  { name: 'Auto Swell', type: 'Special', basedOn: 'Valeton Volume Swell' },
];

// EQ Effects
export const EQ_EFFECTS: EffectModel[] = [
  { name: 'Guitar EQ 1', type: 'EQ', basedOn: 'Valeton 5-Band Guitar EQ' },
  { name: 'Guitar EQ 2', type: 'EQ', basedOn: 'Valeton 5-Band Guitar EQ 2' },
  { name: 'Bass EQ 1', type: 'EQ', basedOn: 'Valeton 5-Band Bass EQ' },
  { name: 'Bass EQ 2', type: 'EQ', basedOn: 'Valeton 5-Band Bass EQ 2' },
  { name: 'Mess EQ', type: 'EQ', basedOn: 'Mesa Boogie 5-Band EQ' },
  { name: 'Hyper EQ', type: 'EQ', basedOn: 'Valeton 10-Band EQ' },
];

// MOD Effects (Modulation)
export const MOD_EFFECTS: EffectModel[] = [
  // Chorus
  { name: 'G-Chorus', type: 'Chorus', basedOn: 'Roland Chorus Ensemble CE-1' },
  { name: 'C-Chorus', type: 'Chorus', basedOn: 'Boss Dimension C DC-2' },
  { name: 'M-Chorus', type: 'Chorus', basedOn: 'Boss Chorus Ensemble CE-5' },

  // Flanger
  { name: 'Jet', type: 'Flanger', basedOn: 'Boss Flanger BF-2' },
  { name: 'B-Jet', type: 'Flanger', basedOn: 'Boss Flanger BF-2 (variant)' },
  { name: 'N-Jet', type: 'Flanger', basedOn: 'Boss Flanger BF-2 (variant)' },
  { name: 'Trem Jet', type: 'Flanger', basedOn: 'Valeton Flanger + Tremolo' },

  // Vibrato
  { name: 'V-Roto', type: 'Vibrato', basedOn: 'Boss Vibrato VB-2' },
  { name: 'G-Roto', type: 'Vibrato', basedOn: 'Roland CE-1 Vibrato Mode' },
  { name: 'Vibrato', type: 'Vibrato', basedOn: 'Boss Vibrato VB-2 (extended)' },
  { name: 'Vibrato T', type: 'Vibrato', basedOn: 'Valeton Touch Vibrato' },

  // Phaser
  { name: 'O-Phase', type: 'Phaser', basedOn: 'MXR Phase 90' },
  { name: 'G-Phase', type: 'Phaser', basedOn: 'Boss Phaser PH-1' },
  { name: 'S-Phaser', type: 'Phaser', basedOn: 'EHX Small Stone' },
  { name: 'Pan Phase', type: 'Phaser', basedOn: 'Valeton Pan Phaser' },
  { name: 'M-Vibe', type: 'Phaser', basedOn: 'Voodoo Lab Micro Vibe (Uni-Vibe)' },
  { name: 'Vibe', type: 'Phaser', basedOn: 'Shin-Ei Uni-Vibe' },

  // Tremolo
  { name: 'O-Trem', type: 'Tremolo', basedOn: 'Demeter Tremulator' },
  { name: 'Sine Trem', type: 'Tremolo', basedOn: 'Valeton Sine Tremolo' },
  { name: 'Triangle Trem', type: 'Tremolo', basedOn: 'Valeton Triangle Tremolo' },
  { name: 'Bias Trem', type: 'Tremolo', basedOn: 'Valeton Bias Tremolo' },

  // Special
  { name: 'Detune', type: 'Pitch', basedOn: 'Valeton Detune/Chorus' },
  { name: 'Bit Smash', type: 'Special', basedOn: 'Valeton Bit Crusher' },
  { name: 'Auto Swell', type: 'Special', basedOn: 'Valeton Volume Swell' },
  { name: 'Hold', type: 'Special', basedOn: 'Valeton Freeze' },
  { name: 'Saturate', type: 'Special', basedOn: 'Valeton Tape Saturation' },
];

// DLY Effects (Delay)
export const DLY_EFFECTS: EffectModel[] = [
  { name: 'BBD Delay S', type: 'Delay', basedOn: 'Boss DM-3 Analog Delay' },
  { name: 'Digital Delay S', type: 'Delay', basedOn: 'Boss DD-3 Digital Delay' },
  { name: 'Tape Delay S', type: 'Delay', basedOn: 'Roland Space Echo RE-201' },
  { name: 'Ambience 1', type: 'Delay', basedOn: 'EHX Deluxe Memory Man' },
  { name: 'Ambience 2', type: 'Delay', basedOn: 'EHX Deluxe Memory Man (variant)' },
  { name: 'Pure', type: 'Delay', basedOn: 'Solid State Tape Echo' },
  { name: 'Analog', type: 'Delay', basedOn: 'Solid State Tape Echo (analog)' },
  { name: 'Tape', type: 'Delay', basedOn: 'Solid State Tape Echo' },
  { name: 'Ping Pong', type: 'Delay', basedOn: 'Stereo Ping Pong Delay' },
  { name: 'Slapback', type: 'Delay', basedOn: 'Valeton Slapback Delay' },
  { name: 'Sweep Echo', type: 'Delay', basedOn: 'Valeton Sweep Echo' },
  { name: 'Ring Echo', type: 'Delay', basedOn: 'Valeton Ring Echo' },
  { name: 'Tube', type: 'Delay', basedOn: 'Binson Echorec' },
  { name: 'M-Echo', type: 'Delay', basedOn: 'Boss DM-2 Analog Delay' },
  { name: 'Sweet Echo', type: 'Delay', basedOn: 'Maxon AD999' },
  { name: '999 Echo', type: 'Delay', basedOn: 'MXR Digital Delay Rack' },
  { name: 'Vintage Rack', type: 'Delay', basedOn: 'MXR Digital Delay Rack (vintage)' },
  { name: 'Lofi Echo', type: 'Delay', basedOn: 'Valeton Lo-Fi Delay' },
  { name: 'Rev Echo', type: 'Delay', basedOn: 'Valeton Reverse Delay' },
  { name: 'Dual Echo', type: 'Delay', basedOn: 'Keeley Halo (Andy Timmons)' },
  { name: 'Ice Delay', type: 'Delay', basedOn: 'Valeton Ice Delay' },
];

// REV Effects (Reverb)
export const REV_EFFECTS: EffectModel[] = [
  { name: 'Room', type: 'Reverb', basedOn: 'Valeton Room Reverb' },
  { name: 'Hall', type: 'Reverb', basedOn: 'Valeton Hall Reverb' },
  { name: 'Church', type: 'Reverb', basedOn: 'Valeton Church Reverb' },
  { name: 'Plate', type: 'Reverb', basedOn: 'Valeton Plate Reverb' },
  { name: 'Spring', type: 'Reverb', basedOn: 'Valeton Spring Reverb' },
  { name: 'Tube Spring', type: 'Reverb', basedOn: '60s Fender Tube Spring' },
  { name: 'Amp Sprint', type: 'Reverb', basedOn: 'Solid State Amp Spring' },
  { name: 'Studio', type: 'Reverb', basedOn: 'Valeton Studio Reverb' },
  { name: 'Club', type: 'Reverb', basedOn: 'Valeton Club Reverb' },
  { name: 'Concert', type: 'Reverb', basedOn: 'Valeton Concert Reverb' },
  { name: 'Arena', type: 'Reverb', basedOn: 'Valeton Arena Reverb' },
  { name: 'N-Star', type: 'Reverb', basedOn: 'Valeton N-Star Reverb' },
  { name: 'Deepsea', type: 'Reverb', basedOn: 'Valeton Deepsea Reverb' },
  { name: 'Sweet Space', type: 'Reverb', basedOn: 'Valeton Sweet Space Reverb' },
  { name: 'Shimmer', type: 'Reverb', basedOn: 'Valeton Shimmer Reverb' },
];

// Helper functions
export function getAllEffectNames(category: 'PRE' | 'WAH' | 'DST' | 'NR' | 'EQ' | 'MOD' | 'DLY' | 'REV'): string[] {
  const effectMap = {
    PRE: PRE_EFFECTS,
    WAH: WAH_EFFECTS,
    DST: DST_EFFECTS,
    NR: NR_EFFECTS,
    EQ: EQ_EFFECTS,
    MOD: MOD_EFFECTS,
    DLY: DLY_EFFECTS,
    REV: REV_EFFECTS,
  };
  return effectMap[category].map(e => `${e.name} (${e.basedOn})`);
}
