import { AmpModel, AmpType } from '../types';

export const AMP_MODELS: AmpModel[] = [
  // Clean Amps
  { name: 'Tweedy', type: 'Clean', basedOn: 'Fender Tweed Deluxe' },
  { name: 'Bellman 59N', type: 'Clean', basedOn: 'Fender 59 Bassman Normal Channel' },
  { name: 'Dark Twin', type: 'Clean', basedOn: 'Fender 65 Twin Reverb' },
  { name: 'Dark DLX', type: 'Clean', basedOn: 'Fender Deluxe' },
  { name: 'Dark Vibra', type: 'Clean', basedOn: 'Fender Vibraverb 1963' },
  { name: 'Silver Twin', type: 'Clean', basedOn: 'Fender Silverface Twin Reverb' },
  { name: 'SUPDual CL', type: 'Clean', basedOn: 'Supro Dual Tone 1624T' },
  { name: 'Foxy 15TB', type: 'Clean', basedOn: 'VOX AC-100 Bass' },
  { name: 'Foxy 30N', type: 'Clean', basedOn: 'VOX AC30HW' },
  { name: 'J-120 CL', type: 'Clean', basedOn: 'Roland Jazz Chorus JC-120' },
  { name: 'Match CL', type: 'Clean', basedOn: 'Matchless Chieftain 212' },
  { name: 'L-Star CL', type: 'Clean', basedOn: 'Mesa Boogie Lone Star CH1' },
  { name: 'BogSV CL', type: 'Clean', basedOn: 'Bogner Shiva 20th Anniversary CH1' },
  { name: 'Z38 CL', type: 'Clean', basedOn: 'Dr. Z Maz 38 Sr.' },
  { name: 'Knights CL', type: 'Clean', basedOn: 'Pendragon Grindrod PG20C' },
  { name: 'Knights CL+', type: 'Clean', basedOn: 'Pendragon Grindrod PG20C+' },
  { name: 'Bad-KT CL', type: 'Clean', basedOn: 'Bad Cat Hot Cat 30' },
  { name: 'Solo100 CL', type: 'Clean', basedOn: 'Soldano SLO100 Clean' },

  // Drive Amps
  { name: 'Bellman 59B', type: 'Drive', basedOn: 'Fender 59 Bassman Bright Channel' },
  { name: 'SUPDual OD', type: 'Drive', basedOn: 'Supro Dual Tone 1624T Overdrive' },
  { name: 'Foxy 30TB', type: 'Drive', basedOn: 'VOX AC30 Top Boost' },
  { name: 'Match OD', type: 'Drive', basedOn: 'Matchless Chieftain Overdrive' },
  { name: 'L-Star OD', type: 'Drive', basedOn: 'Mesa Boogie Lone Star CH2' },
  { name: 'BogSV OD', type: 'Drive', basedOn: 'Bogner Shiva 20th Anniversary CH2' },
  { name: 'Bog BlueV', type: 'Drive', basedOn: 'Bogner XTC Blue Channel Vintage' },
  { name: 'Bog BluM', type: 'Drive', basedOn: 'Bogner XTC Blue Channel Modern' },
  { name: 'ZL38 OD', type: 'Drive', basedOn: 'Dr. Z Maz 38 Sr. Overdrive' },
  { name: 'Knights OD', type: 'Drive', basedOn: 'Pendragon Grindrod PG20C Overdrive' },
  { name: 'Bad-KT OD', type: 'Drive', basedOn: 'Bad Cat Hot Cat 30 Overdrive' },
  { name: 'Solo100 OD', type: 'Drive', basedOn: 'Soldano SLO100 Crunch' },
  { name: 'UK 45', type: 'Drive', basedOn: 'Marshall JMP45 Plexi' },
  { name: 'UK 45+', type: 'Drive', basedOn: 'Marshall JMP45 Plexi+' },
  { name: 'UK 45JP', type: 'Drive', basedOn: 'Marshall JMP45 Plexi Jumped' },
  { name: 'UK 50', type: 'Drive', basedOn: 'Marshall JMP50' },
  { name: 'UK 50+', type: 'Drive', basedOn: 'Marshall JMP50+' },
  { name: 'UK 50JP', type: 'Drive', basedOn: 'Marshall JMP50 Jumped' },
  { name: 'UK SLP', type: 'Drive', basedOn: 'Marshall 1959HW Super Lead' },
  { name: 'UK 800', type: 'Drive', basedOn: 'Marshall JCM800' },
  { name: 'Flagman 1', type: 'Drive', basedOn: 'Friedman Brown Eye' },
  { name: 'Flagman 2', type: 'Drive', basedOn: 'Friedman Brown Eye Head' },
  { name: 'Mess2C+ 1', type: 'Drive', basedOn: 'Mesa Boogie Mark IIC+ Mode 1' },
  { name: 'Mess2C+ 2', type: 'Drive', basedOn: 'Mesa Boogie Mark IIC+ Mode 2' },
  { name: 'Mess2C+ 3', type: 'Drive', basedOn: 'Mesa Boogie Mark IIC+ Mode 3' },
  { name: 'Juice30 OD', type: 'Drive', basedOn: 'Orange AD30' },

  // Hi Gain Amps
  { name: 'UK 900', type: 'Hi Gain', basedOn: 'Marshall JCM900' },
  { name: 'Bog RedV', type: 'Hi Gain', basedOn: 'Bogner XTC Red Channel Vintage' },
  { name: 'Bog RedM', type: 'Hi Gain', basedOn: 'Bogner XTC Red Channel Modern' },
  { name: 'Flagman+ 1', type: 'Hi Gain', basedOn: 'Friedman BE Hi Gain' },
  { name: 'Flagman+ 2', type: 'Hi Gain', basedOn: 'Friedman BE Hi Gain+' },
  { name: 'Mess4 LD 1', type: 'Hi Gain', basedOn: 'Mesa Boogie Mark IV Lead 1' },
  { name: 'Mess4 LD 2', type: 'Hi Gain', basedOn: 'Mesa Boogie Mark IV Lead 2' },
  { name: 'Mess4 LD 3', type: 'Hi Gain', basedOn: 'Mesa Boogie Mark IV Lead 3' },
  { name: 'Mess DualV', type: 'Hi Gain', basedOn: 'Mesa Boogie Dual Rectifier Vintage' },
  { name: 'Mess DualM', type: 'Hi Gain', basedOn: 'Mesa Boogie Dual Rectifier Modern' },
  { name: 'Juice R100', type: 'Hi Gain', basedOn: 'Orange Rockerverb 100' },
  { name: 'EV 51', type: 'Hi Gain', basedOn: 'EVH Peavey 5150' },
  { name: 'Eagle 120', type: 'Hi Gain', basedOn: 'ENGL Savage 120' },
  { name: 'Eagle 120+', type: 'Hi Gain', basedOn: 'ENGL Savage 120+' },
  { name: 'Power LD', type: 'Hi Gain', basedOn: 'ENGL Powerball II' },
  { name: 'Dizz VH', type: 'Hi Gain', basedOn: 'Diezel VH4' },
  { name: 'Dizz VH S', type: 'Hi Gain', basedOn: 'Diezel VH4 Saturation' },
  { name: 'Dizz VH+', type: 'Hi Gain', basedOn: 'Diezel VH4+' },
  { name: 'Dizz VH+ S', type: 'Hi Gain', basedOn: 'Diezel VH4+ Saturation' },
  { name: 'Solo100 LD', type: 'Hi Gain', basedOn: 'Soldano SLO100 Lead' },

  // Bass Amps
  { name: 'Classic Bass', type: 'Bass', basedOn: 'Ampeg SVT' },
  { name: 'Foxy Bass', type: 'Bass', basedOn: 'VOX AC-100 Bass' },
  { name: 'Mess Bass', type: 'Bass', basedOn: 'Mesa Boogie Bass 400' },
  { name: 'Mini Bass', type: 'Bass', basedOn: 'Ampeg B-15 Flip Top' },
  { name: 'Bass Pre', type: 'Bass', basedOn: 'Alembic F-2B Preamp' },

  // Acoustic Amps
  { name: 'AC Pre', type: 'Acoustic', basedOn: 'AER Colourizer 2 (EQ 90-1.6kHz)' },
  { name: 'AC Pre 2', type: 'Acoustic', basedOn: 'AER Colourizer 2 (EQ 680Hz-11kHz)' },
];

// Helper function to get amps by type
export function getAmpsByType(type: AmpType): AmpModel[] {
  return AMP_MODELS.filter(amp => amp.type === type);
}

// Helper to find amp by name
export function findAmp(name: string): AmpModel | undefined {
  return AMP_MODELS.find(amp => amp.name.toLowerCase() === name.toLowerCase());
}

// Get amp names as simple array for AI prompt
export function getAmpNames(): string[] {
  return AMP_MODELS.map(amp => `${amp.name} (${amp.basedOn})`);
}
