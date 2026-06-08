import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Text, useTheme, Button, Portal, Modal, Divider, Switch, TextInput, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomSlider } from '../src/components/CustomSlider';
import { useMidi } from '../src/hooks/useMidi';
import { useTranslation } from '../src/hooks/useTranslation';
import { MidiDevicePicker } from '../src/components/MidiDevicePicker';
import { SIGNAL_CHAIN, MODULE_COLORS, Effect } from '../src/services/effectDatabase';
import effectCatalog from '../src/data/effectCatalog.json';

const catalog: Record<string, Effect[]> = effectCatalog as any;
const SLOT_LETTERS = ['A', 'B', 'C', 'D'];

// Pedal IDs for SysEx reorder messages (11 pedals including VOL)
const PEDAL_IDS: Record<string, number> = {
  PRE: 0x00, WAH: 0x01, DST: 0x02, AMP: 0x03, NR: 0x04,
  CAB: 0x05, EQ: 0x06, MOD: 0x07, DLY: 0x08, RVB: 0x09, VOL: 0x0A,
};
interface ModuleState {
  enabled: boolean;
  effectIndex: number;
  paramValues: Record<number, number>;
}

export default function PedalEditorScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    isConnected,
    scanDevices,
    sendSysEx,
    selectPreset,
  } = useMidi();

  const [showPicker, setShowPicker] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showEffectPicker, setShowEffectPicker] = useState(false);

  // Preset state
  const [bankInput, setBankInput] = useState('1');
  const [slotLetter, setSlotLetter] = useState('A');
  const [selecting, setSelecting] = useState(false);

  // Patch Volume state
  const [volume, setVolumeState] = useState(50);

  // Module states - AMP and VOL default to on, others off until we read from pedal
  const [moduleStates, setModuleStates] = useState<Record<string, ModuleState>>(() => {
    const initial: Record<string, ModuleState> = {};
    SIGNAL_CHAIN.forEach(module => {
      initial[module] = {
        enabled: module === 'VOL', // Only VOL on by default
        effectIndex: 0,
        paramValues: {},
      };
    });
    return initial;
  });

  // Pedal order state (default signal chain order)
  const [pedalOrder, setPedalOrder] = useState<string[]>([...SIGNAL_CHAIN]);

  // Disable parent ScrollView while dragging sliders (Android touch conflict)
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleConnect = () => {
    scanDevices();
    setShowPicker(true);
  };

  const handleSelectPreset = async () => {
    const bankNumber = parseInt(bankInput, 10);
    if (isNaN(bankNumber) || bankNumber < 1 || bankNumber > 64) {
      Alert.alert(t('pedalEditor.invalidBank'), t('pedalEditor.invalidBankMessage'));
      return;
    }
    const slotIndex = SLOT_LETTERS.indexOf(slotLetter);
    setSelecting(true);
    try {
      await selectPreset(bankNumber, slotIndex);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('pedalEditor.failedToSelect'));
    } finally {
      setSelecting(false);
    }
  };

  const handleModulePress = (module: string) => {
    setSelectedModule(selectedModule === module ? null : module);
  };

  // Send pedal order via SysEx (78 bytes)
  const sendPedalOrder = async (order: string[]) => {
    // Build the order array: 11 slots × 2 bytes each (00 XX format)
    // All 11 slots are actual pedals (PRE, WAH, DST, AMP, CAB, NR, EQ, MOD, DLY, RVB, VOL)
    const orderBytes: number[] = [];
    for (let i = 0; i < 11; i++) {
      const pedalId = PEDAL_IDS[order[i]] ?? i;
      orderBytes.push(0x00, pedalId);
    }

    // 78-byte SysEx message for pedal order change
    const sysex = [
      0xF0, 0x21, 0x25, 0x7E, 0x47, 0x50, 0x2D, 0x32,
      0x12, 0x20, // Command 0x20 for pedal order
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x0F, 0x04, 0x00, 0x00, 0x00,
      0x08, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
      0x0F, 0x04, 0x00, 0x00, 0x00,
      0x04, 0x00, 0x04,
      ...orderBytes, // 22 bytes (11 slots × 2)
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0xF7
    ];

    await sendSysEx(sysex);
  };

  const handleMovePedal = async (direction: 'left' | 'right') => {
    if (!selectedModule) return;

    const currentIndex = pedalOrder.indexOf(selectedModule);
    if (currentIndex === -1) return;

    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= pedalOrder.length) return;

    // Swap pedals
    const newOrder = [...pedalOrder];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    setPedalOrder(newOrder);

    // Send to pedal if connected
    if (isConnected) {
      try {
        await sendPedalOrder(newOrder);
      } catch (error) {
        console.error('Failed to send pedal order:', error);
      }
    }
  };

  const handleEffectSelect = async (effectIndex: number) => {
    if (!selectedModule) return;

    // Get the effect's code from the catalog (code != array index for some effects)
    const effects = catalog[selectedModule] || [];
    const effect = effects[effectIndex];
    const effectCode = effect?.code ?? effectIndex;

    // Update local state
    setModuleStates(prev => ({
      ...prev,
      [selectedModule]: {
        ...prev[selectedModule],
        effectIndex,
        paramValues: {},
      },
    }));
    setShowEffectPicker(false);

    // Send effect change to pedal via SysEx using the effect's CODE (not array index)
    if (isConnected) {
      try {
        await sendEffectChange(selectedModule, effectCode);
      } catch (error) {
        console.error('Failed to change effect:', error);
      }
    }
  };

  // Send effect type change via SysEx (54 bytes) - verified from GP-200 Editor captures
  // Effect code 0xHH0000LL is nibble-encoded: byte52=HH, byte45=LL>>4, byte46=LL&0x0F
  const sendEffectChange = async (module: string, effectCode: number) => {
    const blockIds: Record<string, number> = {
      PRE: 0x00, WAH: 0x01, DST: 0x02, AMP: 0x03, NR: 0x04,
      CAB: 0x05, EQ: 0x06, MOD: 0x07, DLY: 0x08, RVB: 0x09, VOL: 0x0A,
    };
    const blockId = blockIds[module] ?? 0;

    // Nibble-encode the effect code (verified from MIDI captures)
    const highByte = (effectCode >>> 24) & 0xFF;  // byte 52
    const lowByte = effectCode & 0xFF;
    const lowHi = (lowByte >> 4) & 0x0F;          // byte 45
    const lowLo = lowByte & 0x0F;                  // byte 46

    const sysex = [
      0xF0, 0x21, 0x25, 0x7E, 0x47, 0x50, 0x2D, 0x32,
      0x12, 0x14, // Command 0x14 for effect change
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x0E, 0x0C, 0x00, 0x00, 0x01,               // bytes 25-26: 0E 0C (verified)
      0x06, 0x00, 0x00, 0x00, 0x08,
      0x00, 0x00, 0x00,
      blockId,                                      // byte 38: block ID
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00,          // bytes 39-44: zeros
      lowHi, lowLo,                                 // bytes 45-46: low byte nibbles
      0x00, 0x00, 0x00, 0x00, 0x00,                // bytes 47-51: zeros
      highByte,                                     // byte 52: high byte
      0xF7                                          // byte 53: SysEx end
    ];

    await sendSysEx(sysex);
  };

  const handleToggleModule = async (module: string) => {
    const newEnabled = !moduleStates[module].enabled;
    setModuleStates(prev => ({
      ...prev,
      [module]: { ...prev[module], enabled: newEnabled },
    }));

    if (isConnected) {
      try {
        await sendModuleToggle(module, newEnabled);
      } catch (error) {
        console.error('Failed to toggle module:', error);
      }
    }
  };

  // Send module on/off via SysEx (46 bytes) - matches GP-200 Editor
  const sendModuleToggle = async (module: string, enabled: boolean) => {
    const blockIds: Record<string, number> = {
      PRE: 0x00, WAH: 0x01, DST: 0x02, AMP: 0x03, NR: 0x04,
      CAB: 0x05, EQ: 0x06, MOD: 0x07, DLY: 0x08, RVB: 0x09, VOL: 0x0A,
    };
    const blockId = blockIds[module] ?? 0;

    const sysex = [
      0xF0, 0x21, 0x25, 0x7E, 0x47, 0x50, 0x2D, 0x32,
      0x12, 0x10, // Command 0x10 for toggle
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x0F, 0x04, 0x00, 0x00, 0x01,
      0x05, 0x00, 0x00, 0x00, 0x04,
      0x00, 0x00, 0x00,
      blockId, // Block ID at byte 38
      0x00,
      enabled ? 0x01 : 0x00, // ON/OFF at byte 40
      0x00, 0x00, 0x00, 0x00,
      0xF7
    ];

    await sendSysEx(sysex);
  };

  // Visual-only update while dragging (no SysEx sent)
  const handleParamSlide = (paramIdx: number, value: number) => {
    if (!selectedModule) return;
    setModuleStates(prev => ({
      ...prev,
      [selectedModule]: {
        ...prev[selectedModule],
        paramValues: { ...prev[selectedModule].paramValues, [paramIdx]: value },
      },
    }));
  };

  // Final value when slider is released - update state AND send SysEx
  const handleParamChange = async (paramIdx: number, value: number, paramMin: number, paramMax: number) => {
    if (!selectedModule) return;
    setModuleStates(prev => ({
      ...prev,
      [selectedModule]: {
        ...prev[selectedModule],
        paramValues: { ...prev[selectedModule].paramValues, [paramIdx]: value },
      },
    }));

    if (isConnected) {
      try {
        await sendParameterChange(selectedModule, paramIdx, value, paramMin, paramMax);
      } catch (error) {
        console.error('Failed to send parameter:', error);
      }
    }
  };

  const sendParameterChange = async (module: string, paramIdx: number, value: number, paramMin: number, paramMax: number) => {
    const blockIds: Record<string, number> = {
      PRE: 0x00, WAH: 0x01, DST: 0x02, AMP: 0x03, NR: 0x04,
      CAB: 0x05, EQ: 0x06, MOD: 0x07, DLY: 0x08, RVB: 0x09, VOL: 0x0A,
    };
    const blockId = blockIds[module] ?? 0;

    // Normalize display value to 0-100 range
    const paramRange = paramMax - paramMin;
    const display = paramRange > 0
      ? Math.round(Math.max(0, Math.min(100, ((value - paramMin) / paramRange) * 100)))
      : 0;

    // GP-200 non-linear internal encoding (decoded from MIDI captures)
    // Piecewise linear interpolation between verified calibration points:
    //   display 0→0, 15→88, 22→108, 44→140, 50→146, 75→165, 100→178
    const CAL: [number, number][] = [[0, 0], [15, 88], [22, 108], [44, 140], [50, 146], [75, 165], [100, 178]];
    let internal = 0;
    for (let i = 1; i < CAL.length; i++) {
      if (display <= CAL[i][0]) {
        const [d0, v0] = CAL[i - 1];
        const [d1, v1] = CAL[i];
        internal = Math.round(v0 + (display - d0) / (d1 - d0) * (v1 - v0));
        break;
      }
    }
    if (display >= 100) internal = 178;

    // Encode as base-64/4/4 nibbles (decoded from captures):
    // internal = byte60*64 + byte57*4 + byte58/4
    const b60 = Math.floor(internal / 64);
    const b57 = Math.floor((internal % 64) / 4);
    const b58 = (internal % 4) * 4;
    const b59 = internal > 0 ? 0x04 : 0x00;

    const sysex = [
      0xF0, 0x21, 0x25, 0x7E, 0x47, 0x50, 0x2D, 0x32,
      0x12, 0x18,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x0E, 0x0C, 0x00, 0x00, 0x00,
      0x05, 0x00, 0x00, 0x00, 0x0C,
      0x00, 0x00, 0x00,
      blockId, 0x00, paramIdx,
      0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00,
      b57, b58, b59, b60, 0xF7
    ];
    await sendSysEx(sysex);
  };

  // Send Patch Volume via 30-byte SysEx (decoded from GP-200 Editor captures)
  // Format: same structure as preset select, byte14=0x06 identifies Patch Volume
  // Value is raw display value (0-100) encoded as two nibbles: HI*16+LO
  const sendPatchVolume = async (value: number) => {
    const clamped = Math.round(Math.max(0, Math.min(100, value)));
    const hi = Math.floor(clamped / 16);
    const lo = clamped % 16;

    const sysex = [
      0xF0, 0x21, 0x25, 0x7E, 0x47, 0x50, 0x2D, 0x32,
      0x12, 0x08,
      0x00, 0x00, 0x00, 0x00,
      0x06, 0x00, 0x00, 0x00,
      0x04, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00,
      hi, lo,
      0x00, 0x00,
      0xF7,
    ];
    await sendSysEx(sysex);
  };

  const handleVolumeChange = async (value: number) => {
    setVolumeState(value);
    if (isConnected) {
      try {
        await sendPatchVolume(value);
      } catch (error) {
        console.error('Failed to send volume:', error);
      }
    }
  };

  const getSelectedEffect = (): Effect | null => {
    if (!selectedModule) return null;
    const effects = catalog[selectedModule] || [];
    return effects[moduleStates[selectedModule]?.effectIndex || 0] || null;
  };

  const getParamValue = (paramIdx: number, defaultValue: number): number => {
    if (!selectedModule) return defaultValue;
    return moduleStates[selectedModule]?.paramValues[paramIdx] ?? defaultValue;
  };

  // Connect screen
  if (!isConnected) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
        <View style={styles.connectContainer}>
          <Text variant="headlineMedium" style={styles.connectTitle}>{t('pedalEditor.title')}</Text>
          <Text style={[styles.connectSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            {t('pedalEditor.connectPrompt')}
          </Text>
          <View style={styles.connectIconContainer}>
            <Text style={styles.connectIcon}>🎸</Text>
          </View>
          <Button
            mode="contained"
            onPress={handleConnect}
            style={styles.connectButton}
            contentStyle={styles.connectButtonContent}
          >
            {t('pedalEditor.connectButton')}
          </Button>
          <Text style={[styles.connectHint, { color: theme.colors.onSurfaceVariant }]}>
            {t('pedalEditor.connectHint')}
          </Text>
        </View>
        <MidiDevicePicker visible={showPicker} onDismiss={() => setShowPicker(false)} />
      </SafeAreaView>
    );
  }

  const selectedEffect = getSelectedEffect();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={scrollEnabled}>
        {/* Connection Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.statusText}>{t('pedalEditor.connectedTo')}</Text>
        </View>

        {/* Preset Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('pedalEditor.preset')}</Text>

          {/* Bank Input Row */}
          <TextInput
            label={`${t('pedalEditor.bank')} (1-64)`}
            value={bankInput}
            onChangeText={setBankInput}
            keyboardType="number-pad"
            mode="outlined"
            style={styles.bankInputFull}
            dense
          />

          {/* Slot Selection Row */}
          <Text style={styles.slotLabel}>Slot</Text>
          <SegmentedButtons
            value={slotLetter}
            onValueChange={setSlotLetter}
            buttons={SLOT_LETTERS.map(l => ({ value: l, label: l }))}
            style={styles.slotButtonsFull}
          />

          {/* Go Button Row */}
          <Button
            mode="contained"
            onPress={handleSelectPreset}
            loading={selecting}
            disabled={selecting}
            style={styles.goButtonFull}
          >
            {t('common.go')}
          </Button>
        </View>

        <Divider style={styles.divider} />

        {/* Signal Chain */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('pedalEditor.signalChain')}</Text>
          <Text style={styles.sectionHint}>{t('pedalEditor.signalChainHint')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chainScroll}>
            <View style={styles.chainRow}>
              {pedalOrder.map((module, index) => {
                const isSelected = selectedModule === module;
                const isEnabled = moduleStates[module]?.enabled;
                const color = MODULE_COLORS[module];
                const effects = catalog[module] || [];
                const currentEffect = effects[moduleStates[module]?.effectIndex || 0];

                return (
                  <React.Fragment key={module}>
                    <TouchableOpacity
                      style={[
                        styles.chainBlock,
                        { borderColor: color },
                        isSelected && { backgroundColor: color + '40', borderWidth: 3 },
                        !isEnabled && styles.chainBlockDisabled,
                      ]}
                      onPress={() => handleModulePress(module)}
                      onLongPress={() => handleToggleModule(module)}
                    >
                      <View style={[styles.chainIndicator, { backgroundColor: isEnabled ? color : '#444' }]} />
                      <Text style={[styles.chainLabel, !isEnabled && styles.chainLabelDisabled]}>
                        {t(`modules.${module}`)}
                      </Text>
                      <Text style={[styles.chainEffect, { color }]} numberOfLines={1}>
                        {currentEffect?.name || '-'}
                      </Text>
                    </TouchableOpacity>
                    {index < pedalOrder.length - 1 && (
                      <Text style={styles.chainArrow}>→</Text>
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Effect Details */}
        {selectedModule && selectedEffect && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.section}>
              <View style={styles.effectHeader}>
                <View style={[styles.effectColorBar, { backgroundColor: MODULE_COLORS[selectedModule] }]} />
                <View style={styles.effectHeaderText}>
                  <Text style={styles.effectModule}>{t(`modules.${selectedModule}`)}</Text>
                  <Text style={styles.effectName}>{selectedEffect.name}</Text>
                </View>
                <Button mode="outlined" onPress={() => setShowEffectPicker(true)} compact>
                  {t('common.change')}
                </Button>
              </View>

              {/* Reorder arrows */}
              <View style={styles.reorderRow}>
                <Text style={styles.reorderLabel}>{t('pedalEditor.position')}</Text>
                <View style={styles.reorderButtons}>
                  <TouchableOpacity
                    style={[
                      styles.reorderButton,
                      pedalOrder.indexOf(selectedModule) === 0 && styles.reorderButtonDisabled
                    ]}
                    onPress={() => handleMovePedal('left')}
                    disabled={pedalOrder.indexOf(selectedModule) === 0}
                  >
                    <Text style={styles.reorderArrow}>←</Text>
                  </TouchableOpacity>
                  <Text style={styles.reorderPosition}>
                    {pedalOrder.indexOf(selectedModule) + 1} / {pedalOrder.length}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.reorderButton,
                      pedalOrder.indexOf(selectedModule) === pedalOrder.length - 1 && styles.reorderButtonDisabled
                    ]}
                    onPress={() => handleMovePedal('right')}
                    disabled={pedalOrder.indexOf(selectedModule) === pedalOrder.length - 1}
                  >
                    <Text style={styles.reorderArrow}>→</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.toggleRow}>
                <Text>{t('common.enabled')}</Text>
                <Switch
                  value={moduleStates[selectedModule]?.enabled}
                  onValueChange={() => handleToggleModule(selectedModule)}
                  color={MODULE_COLORS[selectedModule]}
                />
              </View>

              <Text style={styles.paramsLabel}>{t('pedalEditor.parameters')}</Text>
              {selectedEffect.params.map((param) => (
                <View key={param.idx} style={styles.paramRow}>
                  <Text style={styles.paramLabel}>{param.name}</Text>
                  {param.type === 'knob' ? (
                    <View style={styles.sliderRow}>
                      <CustomSlider
                        minimumValue={param.min}
                        maximumValue={param.max}
                        step={param.step || 1}
                        value={getParamValue(param.idx, param.default)}
                        onSlidingStart={() => setScrollEnabled(false)}
                        onValueChange={(v) => handleParamSlide(param.idx, v)}
                        onSlidingComplete={(v) => { setScrollEnabled(true); handleParamChange(param.idx, v, param.min, param.max); }}
                        minimumTrackTintColor={MODULE_COLORS[selectedModule]}
                        maximumTrackTintColor="#333"
                        thumbTintColor={MODULE_COLORS[selectedModule]}
                      />
                      <Text style={[styles.paramValue, { color: MODULE_COLORS[selectedModule] }]}>
                        {Math.round(getParamValue(param.idx, param.default))}
                      </Text>
                    </View>
                  ) : param.type === 'switch' ? (
                    <View style={styles.switchRow}>
                      <Switch
                        value={getParamValue(param.idx, param.default) > 0}
                        onValueChange={(v) => handleParamChange(param.idx, v ? 1 : 0, param.min, param.max)}
                        color={MODULE_COLORS[selectedModule]}
                      />
                      <Text style={styles.switchLabel}>
                        {param.options?.[getParamValue(param.idx, param.default) > 0 ? 1 : 0]?.name ||
                         (getParamValue(param.idx, param.default) > 0 ? 'ON' : 'OFF')}
                      </Text>
                    </View>
                  ) : param.type === 'combox' && param.options ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.optionsRow}>
                        {param.options.map((opt) => (
                          <TouchableOpacity
                            key={opt.id}
                            style={[
                              styles.optionButton,
                              getParamValue(param.idx, param.default) === opt.id &&
                                { backgroundColor: MODULE_COLORS[selectedModule] },
                            ]}
                            onPress={() => handleParamChange(param.idx, opt.id, param.min, param.max)}
                          >
                            <Text style={[
                              styles.optionText,
                              getParamValue(param.idx, param.default) === opt.id && styles.optionTextSelected,
                            ]}>
                              {opt.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  ) : null}
                </View>
              ))}
            </View>
          </>
        )}

        <Divider style={styles.divider} />

        {/* Patch Volume */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('pedalEditor.patchVolume')}</Text>
          <View style={styles.sliderContainer}>
            <CustomSlider
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={volume}
              onSlidingStart={() => setScrollEnabled(false)}
              onValueChange={setVolumeState}
              onSlidingComplete={(v) => { setScrollEnabled(true); handleVolumeChange(v); }}
              minimumTrackTintColor="#FF6B00"
              maximumTrackTintColor="#333"
              thumbTintColor="#FF6B00"
            />
            <Text style={[styles.sliderValue, { color: '#FF6B00' }]}>{Math.round(volume)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Effect Picker Modal */}
      <Portal>
        <Modal
          visible={showEffectPicker}
          onDismiss={() => setShowEffectPicker(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={styles.modalTitle}>
            {t('pedalEditor.selectEffect', { module: selectedModule ? t(`modules.${selectedModule}`) : '' })}
          </Text>
          <FlatList
            data={selectedModule ? (catalog[selectedModule] || []) : []}
            keyExtractor={(item, i) => `${item.name}-${i}`}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.effectItem,
                  moduleStates[selectedModule!]?.effectIndex === index &&
                    { backgroundColor: MODULE_COLORS[selectedModule!] + '30' },
                ]}
                onPress={() => handleEffectSelect(index)}
              >
                <Text style={styles.effectItemName}>{item.name}</Text>
                <Text style={styles.effectItemParams}>{item.params.length} params</Text>
              </TouchableOpacity>
            )}
            style={styles.effectList}
          />
          <Button onPress={() => setShowEffectPicker(false)}>{t('common.cancel')}</Button>
        </Modal>
      </Portal>

      <MidiDevicePicker visible={showPicker} onDismiss={() => setShowPicker(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  connectContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  connectTitle: { fontWeight: 'bold', marginBottom: 8 },
  connectSubtitle: { textAlign: 'center', marginBottom: 32 },
  connectIconContainer: { marginBottom: 32 },
  connectIcon: { fontSize: 64 },
  connectButton: { backgroundColor: '#FF6B00' },
  connectButtonContent: { paddingHorizontal: 24, paddingVertical: 8 },
  connectHint: { marginTop: 16, fontSize: 13, textAlign: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { fontSize: 14, color: '#4CAF50' },
  section: { marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  sectionHint: { fontSize: 11, color: '#666', marginBottom: 8 },
  divider: { marginVertical: 12, backgroundColor: '#333' },
  bankInputFull: { marginBottom: 12 },
  slotLabel: { fontSize: 13, color: '#888', marginBottom: 6 },
  slotButtonsFull: { marginBottom: 12 },
  goButtonFull: { backgroundColor: '#FF6B00' },
  chainScroll: { marginTop: 8 },
  chainRow: { flexDirection: 'row', alignItems: 'center' },
  chainBlock: {
    width: 65, height: 65, borderRadius: 8, borderWidth: 2,
    padding: 4, alignItems: 'center', justifyContent: 'center',
  },
  chainBlockDisabled: { opacity: 0.4 },
  chainIndicator: { width: 6, height: 6, borderRadius: 3, marginBottom: 2 },
  chainLabel: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  chainLabelDisabled: { color: '#666' },
  chainEffect: { fontSize: 8, marginTop: 1 },
  chainArrow: { color: '#444', fontSize: 14, marginHorizontal: 2 },
  effectHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  effectColorBar: { width: 4, height: 36, borderRadius: 2, marginRight: 12 },
  effectHeaderText: { flex: 1 },
  effectModule: { fontSize: 11, color: '#888' },
  effectName: { fontSize: 18, fontWeight: 'bold' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  paramsLabel: { fontSize: 12, color: '#888', marginTop: 8, marginBottom: 12 },
  paramRow: { marginBottom: 16 },
  paramLabel: { fontSize: 13, marginBottom: 6 },
  sliderRow: { flexDirection: 'row', alignItems: 'center' },
  paramValue: { width: 40, textAlign: 'right', fontWeight: 'bold' },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { marginLeft: 8, color: '#888' },
  optionsRow: { flexDirection: 'row', gap: 8 },
  optionButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#333' },
  optionText: { fontSize: 12, color: '#888' },
  optionTextSelected: { color: '#fff', fontWeight: 'bold' },
  sliderContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sliderValue: { width: 36, textAlign: 'right', fontWeight: 'bold' },
  modal: { margin: 20, padding: 20, borderRadius: 12, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  effectList: { maxHeight: 400 },
  effectItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 8, marginBottom: 4 },
  effectItemName: { fontSize: 14, fontWeight: '500' },
  effectItemParams: { fontSize: 11, color: '#888' },
  reorderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#333' },
  reorderLabel: { fontSize: 13, color: '#888' },
  reorderButtons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reorderButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center' },
  reorderButtonDisabled: { backgroundColor: '#444', opacity: 0.5 },
  reorderArrow: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  reorderPosition: { fontSize: 14, color: '#fff', minWidth: 50, textAlign: 'center' },
});
