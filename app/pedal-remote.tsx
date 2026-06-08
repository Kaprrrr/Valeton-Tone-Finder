import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, useTheme, Button, SegmentedButtons, TextInput, Switch, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useMidi } from '../src/hooks/useMidi';
import { MidiDevicePicker } from '../src/components/MidiDevicePicker';

const SLOT_LETTERS = ['A', 'B', 'C', 'D'];

const EFFECT_MODULES = [
  { key: 'PRE', label: 'PRE', color: '#9C27B0' },
  { key: 'WAH', label: 'WAH', color: '#E91E63' },
  { key: 'DST', label: 'DRIVE', color: '#F44336' },
  { key: 'AMP', label: 'AMP', color: '#FF9800' },
  { key: 'CAB', label: 'CAB', color: '#795548' },
  { key: 'NR', label: 'GATE', color: '#607D8B' },
  { key: 'EQ', label: 'EQ', color: '#4CAF50' },
  { key: 'MOD', label: 'MOD', color: '#2196F3' },
  { key: 'DLY', label: 'DELAY', color: '#00BCD4' },
  { key: 'REV', label: 'REVERB', color: '#3F51B5' },
] as const;

type ModuleKey = typeof EFFECT_MODULES[number]['key'];

export default function PedalRemoteScreen() {
  const theme = useTheme();
  const { isConnected, isSupported, scanDevices, selectPreset } = useMidi();

  const [showPicker, setShowPicker] = useState(false);
  const [bankInput, setBankInput] = useState('1');
  const [slotLetter, setSlotLetter] = useState('A');
  const [selecting, setSelecting] = useState(false);

  const [moduleStates, setModuleStates] = useState<Record<ModuleKey, boolean>>({
    PRE: true,
    WAH: false,
    DST: true,
    AMP: true,
    CAB: true,
    NR: true,
    EQ: false,
    MOD: false,
    DLY: false,
    REV: false,
  });

  const [volume, setVolumeState] = useState(50);

  const handleConnect = () => {
    scanDevices();
    setShowPicker(true);
  };

  const handleSelectPreset = async () => {
    const bankNumber = parseInt(bankInput, 10);

    if (isNaN(bankNumber) || bankNumber < 1 || bankNumber > 64) {
      Alert.alert('Invalid Bank', 'Please enter a bank number between 1 and 64.');
      return;
    }

    const slotIndex = SLOT_LETTERS.indexOf(slotLetter);

    setSelecting(true);
    try {
      await selectPreset(bankNumber, slotIndex);
      Alert.alert('Preset Selected', `Switched to preset ${bankNumber}-${slotLetter}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to select preset');
    } finally {
      setSelecting(false);
    }
  };

  const handleToggleModule = (module: ModuleKey) => {
    setModuleStates(prev => ({ ...prev, [module]: !prev[module] }));
  };

  const handleVolumeChange = (value: number) => {
    setVolumeState(value);
  };


  if (!isSupported) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centerContainer}>
          <Text variant="headlineSmall" style={styles.title}>Pedal Remote</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            MIDI is not supported on this platform.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Connection Status */}
        <View style={styles.section}>
          <View style={styles.connectionRow}>
            <View style={[styles.statusDot, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]} />
            <Text style={styles.connectionText}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </Text>
            {!isConnected && (
              <Button mode="contained" onPress={handleConnect} compact>
                Connect
              </Button>
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Preset Selector */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Select Preset</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Switch to a preset on your pedal
          </Text>

          <TextInput
            label="Bank (1-64)"
            value={bankInput}
            onChangeText={setBankInput}
            keyboardType="number-pad"
            mode="outlined"
            style={styles.bankInput}
            disabled={!isConnected}
          />

          <Text style={styles.slotLabel}>Slot</Text>
          <SegmentedButtons
            value={slotLetter}
            onValueChange={setSlotLetter}
            buttons={SLOT_LETTERS.map(letter => ({
              value: letter,
              label: letter,
              disabled: !isConnected,
            }))}
            style={styles.segmentedButtons}
          />

          <Text style={styles.previewText}>
            {bankInput || '?'}-{slotLetter}
          </Text>

          <Button
            mode="contained"
            onPress={handleSelectPreset}
            disabled={!isConnected || selecting}
            loading={selecting}
            style={styles.selectButton}
          >
            Select Preset
          </Button>
        </View>

        <Divider style={styles.divider} />

        {/* Effect Toggles */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Effect Toggles</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Turn effects on/off in real-time
          </Text>

          <View style={styles.toggleGrid}>
            {EFFECT_MODULES.map((module) => (
              <View key={module.key} style={styles.toggleItem}>
                <View style={[styles.moduleIndicator, { backgroundColor: module.color }]} />
                <Text style={styles.moduleLabel}>{module.label}</Text>
                <Switch
                  value={moduleStates[module.key]}
                  onValueChange={() => handleToggleModule(module.key)}
                  disabled={!isConnected}
                  color={module.color}
                />
              </View>
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Patch Volume */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Patch Volume</Text>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={volume}
              onSlidingComplete={handleVolumeChange}
              minimumTrackTintColor="#FF6B00"
              maximumTrackTintColor="#333"
              thumbTintColor="#FF6B00"
              disabled={!isConnected}
            />
            <Text style={styles.sliderValue}>{Math.round(volume)}</Text>
          </View>
        </View>
      </ScrollView>

      <MidiDevicePicker
        visible={showPicker}
        onDismiss={() => setShowPicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  connectionText: {
    flex: 1,
    fontSize: 16,
  },
  bankInput: {
    marginBottom: 16,
  },
  slotLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  previewText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 16,
  },
  selectButton: {
    backgroundColor: '#FF6B00',
  },
  toggleGrid: {
    gap: 8,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
  },
  moduleIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  moduleLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 40,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
});
