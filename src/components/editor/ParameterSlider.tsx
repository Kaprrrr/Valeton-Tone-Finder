import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';

interface ParameterSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  midiEnabled?: boolean;
  disabled?: boolean;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
}

export function ParameterSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  midiEnabled = false,
  disabled = false,
  onChange,
  onChangeEnd,
}: ParameterSliderProps) {
  const theme = useTheme();

  const activeColor = midiEnabled ? theme.colors.primary : theme.colors.onSurfaceVariant;
  const trackColor = midiEnabled ? theme.colors.primaryContainer : theme.colors.surfaceVariant;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            {label}
          </Text>
          {midiEnabled && (
            <View style={[styles.midiBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.midiBadgeText}>MIDI</Text>
            </View>
          )}
        </View>
        <Text style={[styles.value, { color: activeColor }]}>
          {Math.round(value)}{unit}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        disabled={disabled}
        minimumTrackTintColor={activeColor}
        maximumTrackTintColor={trackColor}
        thumbTintColor={activeColor}
        onValueChange={onChange}
        onSlidingComplete={onChangeEnd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  midiBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  midiBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
