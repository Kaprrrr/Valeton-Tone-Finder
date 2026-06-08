import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { EFFECT_COLORS } from '../theme';
import type { EffectCategory } from '../types';

interface BlockChipProps {
  category: EffectCategory;
  name: string;
}

export function BlockChip({ category, name }: BlockChipProps) {
  const backgroundColor = EFFECT_COLORS[category] || '#666666';

  return (
    <Chip
      compact
      style={[styles.chip, { backgroundColor }]}
      textStyle={styles.text}
    >
      {name}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: 4,
    marginBottom: 4,
    height: 26,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
