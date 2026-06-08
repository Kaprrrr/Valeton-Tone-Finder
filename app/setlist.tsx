import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { Text, useTheme, IconButton, Card, Divider, Portal, Dialog, Button, TextInput, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { getSavedPresets, deletePreset } from '../src/services/presetStorage';
import { EFFECT_COLORS } from '../src/theme';
import type { GP200Preset } from '../src/types';
import { MidiConnectionStatus } from '../src/components/MidiConnectionStatus';
import { useMidi } from '../src/hooks/useMidi';
import { useTranslation } from '../src/hooks/useTranslation';

export default function SetListScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [presets, setPresets] = useState<GP200Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<GP200Preset | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [slotDialogVisible, setSlotDialogVisible] = useState(false);
  const [presetToSend, setPresetToSend] = useState<GP200Preset | null>(null);
  const [bankInput, setBankInput] = useState('1');
  const [slotLetter, setSlotLetter] = useState('A');
  const { isConnected, isSupported } = useMidi();

  const SLOT_LETTERS = ['A', 'B', 'C', 'D'];

  useFocusEffect(
    useCallback(() => {
      loadPresets();
    }, [])
  );

  const loadPresets = async () => {
    try {
      const saved = await getSavedPresets();
      setPresets(saved);
    } catch (error) {
      console.error('Failed to load set list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePress = (preset: GP200Preset) => {
    setPresetToDelete(preset);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!presetToDelete) return;

    try {
      await deletePreset(presetToDelete.id);
      setPresets(prev => prev.filter(p => p.id !== presetToDelete.id));
    } catch (error) {
      console.error('Failed to delete preset:', error);
    } finally {
      setDeleteDialogVisible(false);
      setPresetToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogVisible(false);
    setPresetToDelete(null);
  };

  const handleSendPress = (preset: GP200Preset) => {
    if (!isConnected) {
      Alert.alert(t('setlist.notConnected'), t('setlist.notConnectedMsg'));
      return;
    }
    setPresetToSend(preset);
    setBankInput('1');
    setSlotLetter('A');
    setSlotDialogVisible(true);
  };

  const handleSendConfirm = async () => {
    if (!presetToSend) return;

    const bankNumber = parseInt(bankInput, 10);
    if (isNaN(bankNumber) || bankNumber < 1 || bankNumber > 64) {
      Alert.alert(t('setlist.invalidBank'), t('setlist.invalidBankMsg'));
      return;
    }

    const slotIndex = SLOT_LETTERS.indexOf(slotLetter);
    if (slotIndex === -1) {
      Alert.alert(t('setlist.invalidSlot'), t('setlist.invalidSlotMsg'));
      return;
    }

    setSlotDialogVisible(false);
    setPresetToSend(null);

    Alert.alert(
      t('setlist.notAvailable') || 'Not Available',
      t('setlist.useDeviceEditor') || 'Send to pedal is available in the Pedal Editor screen.'
    );
  };

  const renderPresetItem = ({ item, index }: { item: GP200Preset; index: number }) => {
    const { blocks } = item;

    return (
      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.indexContainer}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text variant="titleMedium" style={styles.songName}>
                {item.songName}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {item.artistName}
              </Text>
            </View>
            {Platform.OS !== 'web' && isSupported && (
              <IconButton
                icon="usb"
                iconColor={isConnected ? '#4CAF50' : '#888'}
                size={22}
                onPress={() => handleSendPress(item)}
                disabled={sendingId === item.id || !isConnected}
                loading={sendingId === item.id}
                style={styles.actionButton}
              />
            )}
            <IconButton
              icon="delete-outline"
              iconColor={theme.colors.error}
              size={22}
              onPress={() => handleDeletePress(item)}
              style={styles.actionButton}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Quick Settings Summary */}
          <View style={styles.settingsRow}>
            <View style={styles.settingItem}>
              <View style={[styles.indicator, { backgroundColor: EFFECT_COLORS['AMP'] }]} />
              <Text style={styles.settingLabel}>AMP</Text>
              <Text style={styles.settingValue}>{blocks.amp.model}</Text>
            </View>
            <View style={styles.settingItem}>
              <View style={[styles.indicator, { backgroundColor: EFFECT_COLORS['CAB'] }]} />
              <Text style={styles.settingLabel}>CAB</Text>
              <Text style={styles.settingValue}>{blocks.cab.model}</Text>
            </View>
          </View>

          {/* Amp Knobs */}
          <View style={styles.knobsRow}>
            <View style={styles.knob}>
              <Text style={styles.knobValue}>{blocks.amp.gain}</Text>
              <Text style={styles.knobLabel}>Gain</Text>
            </View>
            <View style={styles.knob}>
              <Text style={styles.knobValue}>{blocks.amp.bass}</Text>
              <Text style={styles.knobLabel}>Bass</Text>
            </View>
            <View style={styles.knob}>
              <Text style={styles.knobValue}>{blocks.amp.mid}</Text>
              <Text style={styles.knobLabel}>Mid</Text>
            </View>
            <View style={styles.knob}>
              <Text style={styles.knobValue}>{blocks.amp.treble}</Text>
              <Text style={styles.knobLabel}>Treb</Text>
            </View>
            <View style={styles.knob}>
              <Text style={styles.knobValue}>{blocks.amp.presence}</Text>
              <Text style={styles.knobLabel}>Pres</Text>
            </View>
            <View style={styles.knob}>
              <Text style={styles.knobValue}>{blocks.amp.master}</Text>
              <Text style={styles.knobLabel}>Mstr</Text>
            </View>
          </View>

          {/* Effects Summary */}
          <View style={styles.effectsRow}>
            {blocks.pre?.enabled && (
              <View style={[styles.effectBadge, { backgroundColor: EFFECT_COLORS['PRE'] }]}>
                <Text style={styles.effectText}>{blocks.pre.model}</Text>
              </View>
            )}
            {blocks.dst?.enabled && (
              <View style={[styles.effectBadge, { backgroundColor: EFFECT_COLORS['DST'] }]}>
                <Text style={styles.effectText}>{blocks.dst.model}</Text>
              </View>
            )}
            {blocks.mod?.enabled && (
              <View style={[styles.effectBadge, { backgroundColor: EFFECT_COLORS['MOD'] }]}>
                <Text style={styles.effectText}>{blocks.mod.model}</Text>
              </View>
            )}
            {blocks.dly?.enabled && (
              <View style={[styles.effectBadge, { backgroundColor: EFFECT_COLORS['DLY'] }]}>
                <Text style={styles.effectText}>{blocks.dly.model}</Text>
              </View>
            )}
            {blocks.rev?.enabled && (
              <View style={[styles.effectBadge, { backgroundColor: EFFECT_COLORS['REV'] }]}>
                <Text style={styles.effectText}>{blocks.rev.model}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎸</Text>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        {t('setlist.empty')}
      </Text>
      <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        {t('setlist.emptyHint')}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text>{t('setlist.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      {presets.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {Platform.OS !== 'web' && isSupported && (
            <View style={styles.headerRow}>
              <MidiConnectionStatus />
            </View>
          )}
          <FlatList
            data={presets}
            keyExtractor={(item) => item.id}
            renderItem={renderPresetItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={handleDeleteCancel}>
          <Dialog.Title>{t('setlist.removeFromSetList')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t('setlist.removeConfirm', { name: presetToDelete?.songName })}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDeleteCancel}>{t('common.cancel')}</Button>
            <Button onPress={handleDeleteConfirm} textColor={theme.colors.error}>
              {t('setlist.remove')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Slot Selection Dialog */}
      <Portal>
        <Dialog visible={slotDialogVisible} onDismiss={() => setSlotDialogVisible(false)}>
          <Dialog.Title>{t('setlist.sendToDevice')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
              {t('setlist.whichSlot', { name: presetToSend?.songName })}
            </Text>
            <TextInput
              label={`${t('setlist.bank')} (1-64)`}
              value={bankInput}
              onChangeText={setBankInput}
              keyboardType="number-pad"
              mode="outlined"
              style={{ marginBottom: 16 }}
            />
            <Text style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>{t('setlist.slot')}</Text>
            <SegmentedButtons
              value={slotLetter}
              onValueChange={setSlotLetter}
              buttons={SLOT_LETTERS.map(letter => ({
                value: letter,
                label: letter,
              }))}
              style={{ marginBottom: 16 }}
            />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FF6B00', textAlign: 'center', marginBottom: 12 }}>
              {t('setlist.sendingTo')} {bankInput || '?'}-{slotLetter}
            </Text>
            <Text style={{ fontSize: 12, color: '#888', fontStyle: 'italic' }}>
              {t('setlist.sendNote')}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSlotDialogVisible(false)}>{t('common.cancel')}</Button>
            <Button onPress={handleSendConfirm} loading={sendingId !== null}>{t('setlist.send')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 8,
    paddingBottom: 24,
  },
  headerRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  card: {
    marginHorizontal: 8,
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  indexContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  titleContainer: {
    flex: 1,
  },
  songName: {
    fontWeight: 'bold',
  },
  actionButton: {
    margin: 0,
  },
  divider: {
    marginBottom: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  settingItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  settingLabel: {
    fontSize: 11,
    color: '#888',
    marginRight: 6,
  },
  settingValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
  },
  knobsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  knob: {
    alignItems: 'center',
    minWidth: 40,
  },
  knobValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  knobLabel: {
    fontSize: 9,
    color: '#888',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  effectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  effectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  effectText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
