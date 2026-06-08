import { CabModel } from '../types';

export const CAB_MODELS: CabModel[] = [
  // Small Cabs
  { name: 'SUP ZEP', size: '1x6"', basedOn: 'Supro 1x6" Oval Speaker' },
  { name: 'TWD CP', size: '1x8"', basedOn: 'Fender Champ 1x8"' },
  { name: 'TWD PRC', size: '1x10"', basedOn: 'Fender Princeton 1x10"' },
  { name: 'TWD SUP', size: '2x10"', basedOn: 'Fender Tweed 2x10"' },

  // 1x12" Cabs
  { name: 'TWD LUX', size: '1x12"', basedOn: 'Fender Tweed Deluxe 1x12"' },
  { name: 'Dark Lux', size: '1x12"', basedOn: 'Fender Deluxe 1x12"' },
  { name: 'Dark VIT', size: '1x12"', basedOn: 'Fender Vibrolux 1x12"' },
  { name: 'Foxy 1', size: '1x12"', basedOn: 'VOX AC15 1x12"' },
  { name: 'BogSV', size: '1x12"', basedOn: 'Bogner Shiva 1x12"' },
  { name: 'Bad-KT', size: '1x12"', basedOn: 'Bad Cat Hot Cat 1x12"' },
  { name: 'Match', size: '1x12"', basedOn: 'Matchless Chieftain 1x12"' },
  { name: 'Tom Open', size: '1x12"', basedOn: 'Swart Atomic Space 1x12"' },
  { name: 'ACE', size: '1x12"', basedOn: 'Morgan AC-20 Deluxe 1x12"' },
  { name: 'D Star', size: '1x12"', basedOn: 'Mesa Boogie Lonestar 1x12"' },
  { name: 'US STO', size: '1x12"', basedOn: '1980s Mesa Boogie 1x12"' },
  { name: 'UK G12', size: '1x12"', basedOn: 'Marshall 1x12"' },

  // 2x12" Cabs
  { name: 'Dark Twin', size: '2x12"', basedOn: 'Fender 65 Twin Reverb 2x12"' },
  { name: 'Dark CS', size: '2x12"', basedOn: 'Custom Fender 2x12"' },
  { name: 'Bellman 1', size: '2x12"', basedOn: 'Fender Piggyback Bassman 2x12"' },
  { name: 'J-120', size: '2x12"', basedOn: 'Roland Jazz Chorus 2x12"' },
  { name: 'UK GRN 1', size: '2x12"', basedOn: 'Marshall 2550 2x12"' },
  { name: 'Foxy 2', size: '2x12"', basedOn: 'VOX AC30 2x12"' },
  { name: 'ROUT', size: '2x12"', basedOn: 'Carr Rambler 2x12"' },
  { name: 'SUP Star', size: '2x12"', basedOn: 'Mesa Boogie Lonestar 2x12"' },
  { name: 'BOUTI', size: '2x12"', basedOn: 'Valeton Custom 2x12"' },
  { name: 'SUP', size: '2x12"', basedOn: 'Supro 1624T 2x12"' },
  { name: 'MATT TWD', size: '2x12"', basedOn: 'Matchless 2x12"' },
  { name: 'Freed', size: '2x12"', basedOn: 'Fryette Deliverance 2x12"' },
  { name: 'DB Rock', size: '2x12"', basedOn: 'Two-Rock 2x12"' },
  { name: 'Blue SK', size: '2x12"', basedOn: 'Celestion Alnico Blue 2x12"' },

  // 4x10" Cabs
  { name: 'Bellman 2', size: '4x10"', basedOn: 'Fender 59 Bassman 4x10"' },

  // 4x12" Cabs
  { name: 'UK LD', size: '4x12"', basedOn: 'Marshall 1960 AV 4x12"' },
  { name: 'UK TD', size: '4x12"', basedOn: 'Marshall 1968 Basketweave 4x12"' },
  { name: 'UK MD', size: '4x12"', basedOn: 'Custom Marshall 4x12"' },
  { name: 'UK GRN 2', size: '4x12"', basedOn: 'Marshall 4x12" Celestion Greenback' },
  { name: 'UK 75', size: '4x12"', basedOn: 'Marshall 4x12" Celestion G12T-75' },
  { name: 'UK Dark', size: '4x12"', basedOn: '1968 Marshall 4x12"' },
  { name: 'Mess', size: '4x12"', basedOn: 'Mesa Boogie Rectifier 4x12"' },
  { name: 'EV', size: '4x12"', basedOn: 'Peavey 6505 4x12"' },
  { name: 'Bog', size: '4x12"', basedOn: 'Bogner 4x12"' },
  { name: 'Eagle', size: '4x12"', basedOn: 'ENGL 4x12"' },
  { name: 'Uban', size: '4x12"', basedOn: 'Bogner Uberkab 4x12"' },
  { name: 'Solo', size: '4x12"', basedOn: 'Soldano 4x12"' },
  { name: 'Juice', size: '4x12"', basedOn: 'Orange PPC412 4x12"' },
  { name: 'H-WAY', size: '4x12"', basedOn: 'Hiwatt SE4123 4x12"' },
  { name: 'Way', size: '4x12"', basedOn: 'Vintage WEM 4x12"' },
  { name: 'Dumb', size: '4x12"', basedOn: 'Dumble 4x12"' },
  { name: 'Dizz', size: '4x12"', basedOn: 'Diezel 4x12"' },
  { name: 'TRP', size: '4x12"', basedOn: 'Hughes & Kettner Triamp 4x12"' },
  { name: 'King', size: '4x12"', basedOn: 'Mesa Boogie Road King 4x12"' },

  // Bass Cabs
  { name: 'ADM 1', size: '1x15"', basedOn: 'David Eden 1x15" Bass' },
  { name: 'ADM 2', size: '4x10"', basedOn: 'David Eden 4x10" Bass' },
  { name: 'Workman 1', size: '1x15"', basedOn: 'SWR 1x15" Bass' },
  { name: 'Workman 2', size: '4x10"', basedOn: 'SWR Workingman\'s 4x10" Bass' },
  { name: 'US BASS', size: '2x10"', basedOn: 'Mesa Boogie 2x10" Bass' },
  { name: 'MATT', size: '2x10"', basedOn: 'Mark Bass 2x10" Bass' },
  { name: 'F-TOP', size: '1x15"', basedOn: 'Ampeg PF-115HE 1x15" Bass' },
  { name: 'AMPG 1', size: '4x10"', basedOn: 'Ampeg SVT-410HE 4x10" Bass' },
  { name: 'AMPG 2', size: '8x10"', basedOn: 'Ampeg SVT-810E 8x10" Bass' },
  { name: 'HACK', size: '4x12"', basedOn: 'Hartke 4x12" Bass' },

  // Acoustic Cabs (simulations)
  { name: 'AC', size: 'Acoustic', basedOn: 'Dreadnought Guitar Simulation 1' },
  { name: 'AC Dream', size: 'Acoustic', basedOn: 'Dreadnought Guitar Simulation 2' },
  { name: 'OM', size: 'Acoustic', basedOn: 'OM Type Acoustic Guitar' },
  { name: 'Jumbo', size: 'Acoustic', basedOn: 'Jumbo Acoustic Guitar' },
  { name: 'Bird', size: 'Acoustic', basedOn: 'H-Bird Acoustic Guitar' },
  { name: 'GA', size: 'Acoustic', basedOn: 'GA Type Acoustic Guitar' },
  { name: 'Classic AC', size: 'Acoustic', basedOn: 'Classical Guitar' },
  { name: 'Mandolin', size: 'Acoustic', basedOn: 'Mandolin Simulation' },
  { name: 'Fretless Bass', size: 'Acoustic', basedOn: 'Fretless Acoustic Bass' },
  { name: 'Double Bass', size: 'Acoustic', basedOn: 'Double Bass Simulation' },
];

// Helper functions
export function getCabsBySize(size: string): CabModel[] {
  return CAB_MODELS.filter(cab => cab.size.includes(size));
}

export function findCab(name: string): CabModel | undefined {
  return CAB_MODELS.find(cab => cab.name.toLowerCase() === name.toLowerCase());
}

export function getCabNames(): string[] {
  return CAB_MODELS.map(cab => `${cab.name} ${cab.size} (${cab.basedOn})`);
}
