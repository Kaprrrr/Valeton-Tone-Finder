import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, useTheme } from 'react-native-paper';
import { EFFECT_COLORS } from '../../theme';

type EffectCategory = 'PRE' | 'WAH' | 'DST' | 'AMP' | 'CAB' | 'NR' | 'EQ' | 'MOD' | 'DLY' | 'REV';

interface ModuleToggleProps {
  label: string;
  category: EffectCategory;
  enabled: boolean;
  midiConnected?: boolean;
  disabled?: boolean;
  onToggle: (enabled: boolean) => void;
}

export function ModuleToggle({
  label,
  category,
  enabled,
  midiConnected = false,
  disabled = false,
  onToggle,
}: ModuleToggleProps) {
  const theme = useTheme();
  const categoryColor = EFFECT_COLORS[category] || theme.colors.primary;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>
          {label}
        </Text>
        {midiConnected && (
          <View style={[styles.liveBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        )}
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        disabled={disabled}
        color={categoryColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  liveBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
