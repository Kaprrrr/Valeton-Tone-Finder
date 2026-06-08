import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme, IconButton } from 'react-native-paper';
import { ParameterSlider } from './ParameterSlider';
import { EFFECT_COLORS } from '../../theme';
import type {
  EffectCategory,
  PreBlock,
  WahBlock,
  DstBlock,
  CabBlock,
  NRBlock,
  EQBlock,
  ModBlock,
  DlyBlock,
  RevBlock,
} from '../../types';

type EffectBlock = PreBlock | WahBlock | DstBlock | CabBlock | NRBlock | EQBlock | ModBlock | DlyBlock | RevBlock;

interface EffectSectionProps {
  category: EffectCategory;
  title: string;
  block: EffectBlock;
  onParamChange: (param: string, value: number) => void;
  collapsible?: boolean;
}

interface ParamConfig {
  key: string;
  label: string;
  min?: number;
  max?: number;
  unit?: string;
}

const getParamsForCategory = (category: EffectCategory): ParamConfig[] => {
  switch (category) {
    case 'PRE':
      return [
        { key: 'level', label: 'Level' },
        { key: 'param1', label: 'Param 1' },
        { key: 'param2', label: 'Param 2' },
        { key: 'param3', label: 'Param 3' },
      ];
    case 'WAH':
      return [
        { key: 'position', label: 'Position' },
        { key: 'minFreq', label: 'Min Freq' },
        { key: 'maxFreq', label: 'Max Freq' },
      ];
    case 'DST':
      return [
        { key: 'gain', label: 'Gain' },
        { key: 'tone', label: 'Tone' },
        { key: 'level', label: 'Level' },
        { key: 'bass', label: 'Bass' },
        { key: 'treble', label: 'Treble' },
      ];
    case 'CAB':
      return [
        { key: 'micPosition', label: 'Mic Position' },
        { key: 'lowCut', label: 'Low Cut', unit: 'Hz' },
        { key: 'highCut', label: 'High Cut', unit: 'Hz' },
      ];
    case 'NR':
      return [
        { key: 'threshold', label: 'Threshold' },
        { key: 'decay', label: 'Decay' },
      ];
    case 'EQ':
      return [
        { key: 'level', label: 'Level' },
      ];
    case 'MOD':
      return [
        { key: 'rate', label: 'Rate' },
        { key: 'depth', label: 'Depth' },
        { key: 'mix', label: 'Mix' },
        { key: 'tone', label: 'Tone' },
      ];
    case 'DLY':
      return [
        { key: 'time', label: 'Time', max: 2000, unit: 'ms' },
        { key: 'feedback', label: 'Feedback' },
        { key: 'mix', label: 'Mix' },
        { key: 'tone', label: 'Tone' },
      ];
    case 'REV':
      return [
        { key: 'decay', label: 'Decay' },
        { key: 'predelay', label: 'Pre-Delay' },
        { key: 'mix', label: 'Mix' },
        { key: 'tone', label: 'Tone' },
        { key: 'damping', label: 'Damping' },
      ];
    default:
      return [];
  }
};

const CATEGORY_TITLES: Record<EffectCategory, string> = {
  PRE: 'Pre Effect',
  WAH: 'Wah',
  DST: 'Drive',
  AMP: 'Amp',
  CAB: 'Cabinet',
  NR: 'Noise Gate',
  EQ: 'EQ',
  MOD: 'Modulation',
  DLY: 'Delay',
  REV: 'Reverb',
};

export function EffectSection({
  category,
  title,
  block,
  onParamChange,
  collapsible = true,
}: EffectSectionProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  const categoryColor = EFFECT_COLORS[category] || theme.colors.primary;
  const params = getParamsForCategory(category);

  const displayTitle = title || CATEGORY_TITLES[category];

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity
        style={[styles.header, { borderBottomColor: expanded ? theme.colors.outline : 'transparent' }]}
        onPress={() => collapsible && setExpanded(!expanded)}
        activeOpacity={collapsible ? 0.7 : 1}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.categoryBar, { backgroundColor: categoryColor }]} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {displayTitle}
          </Text>
          {block.model && (
            <Text style={[styles.modelName, { color: theme.colors.onSurfaceVariant }]}>
              {block.model}
            </Text>
          )}
        </View>
        {collapsible && (
          <IconButton
            icon={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            iconColor={theme.colors.onSurfaceVariant}
          />
        )}
      </TouchableOpacity>

      {expanded && (
        <Card.Content style={styles.content}>
          {params.map((param) => {
            const value = (block as any)[param.key];
            if (value === undefined) return null;

            return (
              <ParameterSlider
                key={param.key}
                label={param.label}
                value={value}
                min={param.min || 0}
                max={param.max || 100}
                unit={param.unit}
                onChange={(v) => onParamChange(param.key, v)}
              />
            );
          })}
        </Card.Content>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 4,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  modelName: {
    fontSize: 13,
    marginLeft: 8,
  },
  content: {
    paddingTop: 12,
  },
});
