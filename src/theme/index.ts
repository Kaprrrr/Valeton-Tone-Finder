import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// GP-200 inspired color palette
const gp200Colors = {
  primary: '#FF6B00',
  onPrimary: '#FFFFFF',
  primaryContainer: '#FF8A3D',
  onPrimaryContainer: '#1A1A1A',
  secondary: '#1E88E5',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#42A5F5',
  onSecondaryContainer: '#1A1A1A',
  tertiary: '#7C4DFF',
  onTertiary: '#FFFFFF',
  error: '#CF6679',
  onError: '#000000',
  background: '#121212',
  onBackground: '#E0E0E0',
  surface: '#1E1E1E',
  onSurface: '#E0E0E0',
  surfaceVariant: '#2A2A2A',
  onSurfaceVariant: '#B0B0B0',
  outline: '#444444',
  elevation: {
    level0: 'transparent',
    level1: '#1E1E1E',
    level2: '#232323',
    level3: '#282828',
    level4: '#2D2D2D',
    level5: '#323232',
  },
};

// Effect category colors for BlockChips
export const EFFECT_COLORS: Record<string, string> = {
  PRE: '#4CAF50',
  WAH: '#9C27B0',
  DST: '#F44336',
  AMP: '#FF9800',
  CAB: '#795548',
  NR: '#607D8B',
  EQ: '#00BCD4',
  MOD: '#2196F3',
  DLY: '#FFC107',
  REV: '#3F51B5',
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: gp200Colors.primary,
    onPrimary: gp200Colors.onPrimary,
    primaryContainer: gp200Colors.primaryContainer,
    onPrimaryContainer: gp200Colors.onPrimaryContainer,
    secondary: gp200Colors.secondary,
    onSecondary: gp200Colors.onSecondary,
    secondaryContainer: gp200Colors.secondaryContainer,
    onSecondaryContainer: gp200Colors.onSecondaryContainer,
    tertiary: gp200Colors.tertiary,
    onTertiary: gp200Colors.onTertiary,
    error: gp200Colors.error,
    onError: gp200Colors.onError,
    background: gp200Colors.background,
    onBackground: gp200Colors.onBackground,
    surface: gp200Colors.surface,
    onSurface: gp200Colors.onSurface,
    surfaceVariant: gp200Colors.surfaceVariant,
    onSurfaceVariant: gp200Colors.onSurfaceVariant,
    outline: gp200Colors.outline,
    elevation: gp200Colors.elevation,
  },
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: gp200Colors.primary,
    onPrimary: gp200Colors.onPrimary,
    secondary: gp200Colors.secondary,
    onSecondary: gp200Colors.onSecondary,
  },
};
