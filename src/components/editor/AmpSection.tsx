import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme, Menu, Button } from 'react-native-paper';
import { ParameterSlider } from './ParameterSlider';
import { EFFECT_COLORS } from '../../theme';
import type { AmpBlock } from '../../types';

interface AmpSectionProps {
  amp: AmpBlock;
  onModelChange: (model: string) => void;
  onParamChange: (param: keyof Omit<AmpBlock, 'enabled' | 'model' | 'bright'>, value: number) => void;
  onBrightChange?: (bright: boolean) => void;
}

const AMP_MODELS = [
  { label: 'Clean', models: ['Tweedy', 'Twin Verb', 'Jazz 120', 'AC 15', 'AC 30'] },
  { label: 'Drive', models: ['UK 800', 'UK 900', 'UK Plexi', 'US Blues', 'Hot Rod'] },
  { label: 'Hi Gain', models: ['5150 III', 'Dual Recto', 'Diezel VH4', 'Uber', 'SLO 100'] },
  { label: 'Bass', models: ['Bass SVT', 'Bass Mark', 'Bass Flip'] },
  { label: 'Acoustic', models: ['Acoustic'] },
];

export function AmpSection({
  amp,
  onModelChange,
  onParamChange,
}: AmpSectionProps) {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const categoryColor = EFFECT_COLORS.AMP;

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
        <View style={[styles.categoryBar, { backgroundColor: categoryColor }]} />
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Amp
        </Text>
      </View>

      <Card.Content style={styles.content}>
        <View style={styles.modelSection}>
          <Text style={[styles.modelLabel, { color: theme.colors.onSurfaceVariant }]}>
            Model
          </Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.modelButton}
                contentStyle={styles.modelButtonContent}
                labelStyle={{ color: theme.colors.onSurface }}
              >
                {amp.model || 'Select Model'}
              </Button>
            }
            contentStyle={{ backgroundColor: theme.colors.surface }}
          >
            <ScrollView style={styles.menuScroll}>
              {AMP_MODELS.map((group) => (
                <View key={group.label}>
                  <Menu.Item
                    title={group.label}
                    titleStyle={[styles.menuGroupTitle, { color: categoryColor }]}
                    disabled
                  />
                  {group.models.map((model) => (
                    <Menu.Item
                      key={model}
                      onPress={() => {
                        onModelChange(model);
                        setMenuVisible(false);
                      }}
                      title={model}
                      titleStyle={{ color: theme.colors.onSurface }}
                      style={amp.model === model ? { backgroundColor: theme.colors.surfaceVariant } : undefined}
                    />
                  ))}
                </View>
              ))}
            </ScrollView>
          </Menu>
        </View>

        <View style={styles.knobsContainer}>
          <ParameterSlider
            label="Gain"
            value={amp.gain}
            onChange={(v) => onParamChange('gain', v)}
          />
          <ParameterSlider
            label="Bass"
            value={amp.bass}
            onChange={(v) => onParamChange('bass', v)}
          />
          <ParameterSlider
            label="Mid"
            value={amp.mid}
            onChange={(v) => onParamChange('mid', v)}
          />
          <ParameterSlider
            label="Treble"
            value={amp.treble}
            onChange={(v) => onParamChange('treble', v)}
          />
          <ParameterSlider
            label="Presence"
            value={amp.presence}
            onChange={(v) => onParamChange('presence', v)}
          />
          <ParameterSlider
            label="Master"
            value={amp.master}
            onChange={(v) => onParamChange('master', v)}
          />
        </View>
      </Card.Content>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  categoryBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingTop: 16,
  },
  modelSection: {
    marginBottom: 16,
  },
  modelLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  modelButton: {
    borderRadius: 8,
  },
  modelButtonContent: {
    justifyContent: 'flex-start',
  },
  menuScroll: {
    maxHeight: 300,
  },
  menuGroupTitle: {
    fontWeight: '700',
    fontSize: 12,
  },
  knobsContainer: {
    gap: 4,
  },
});
