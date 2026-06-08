import React, { useState } from 'react';
import { Alert, Platform, View, StyleSheet } from 'react-native';
import { Button, Portal, Dialog, TextInput, Text, SegmentedButtons } from 'react-native-paper';
import { useMidi } from '../hooks/useMidi';
import { MidiDevicePicker } from './MidiDevicePicker';
import type { GP200Preset } from '../types';

interface Props {
  preset: GP200Preset;
  compact?: boolean;
  onSuccess?: () => void;
}

const SLOT_LETTERS = ['A', 'B', 'C', 'D'];

export function SendToPedalButton({ preset, compact = false, onSuccess }: Props) {
  const { isConnected, isSupported, scanDevices } = useMidi();
  const [sending, setSending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showSlotDialog, setShowSlotDialog] = useState(false);
  const [bankInput, setBankInput] = useState('1');
  const [slotLetter, setSlotLetter] = useState('A');

  // Don't render on unsupported platforms (web only)
  if (!isSupported || Platform.OS === 'web') {
    return null;
  }

  const handlePress = async () => {
    if (!isConnected) {
      scanDevices();
      setShowPicker(true);
      return;
    }

    // Show slot selection dialog
    setBankInput('1');
    setSlotLetter('A');
    setShowSlotDialog(true);
  };

  const handleSend = async () => {
    const bankNumber = parseInt(bankInput, 10);

    if (isNaN(bankNumber) || bankNumber < 1 || bankNumber > 64) {
      Alert.alert('Invalid Bank', 'Please enter a bank number between 1 and 64.');
      return;
    }

    const slotIndex = SLOT_LETTERS.indexOf(slotLetter);
    if (slotIndex === -1) {
      Alert.alert('Invalid Slot', 'Please select a slot (A, B, C, or D).');
      return;
    }

    setShowSlotDialog(false);

    Alert.alert(
      'Not Available',
      'Send to pedal is available in the Pedal Editor screen.'
    );
  };

  return (
    <>
      <Button
        mode="outlined"
        icon="usb"
        onPress={handlePress}
        loading={sending}
        disabled={sending}
        style={{ flex: 1, borderColor: isConnected ? '#4CAF50' : '#2196F3' }}
        labelStyle={{ fontSize: compact ? 11 : 14 }}
        compact={compact}
      >
        {sending
          ? 'Sending...'
          : isConnected
            ? 'Send to Pedal'
            : 'Connect Pedal'}
      </Button>

      <MidiDevicePicker
        visible={showPicker}
        onDismiss={() => setShowPicker(false)}
      />

      <Portal>
        <Dialog visible={showSlotDialog} onDismiss={() => setShowSlotDialog(false)}>
          <Dialog.Title>Send to Device</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Which preset slot should "{preset.songName}" be sent to?
            </Text>
            <TextInput
              label="Bank (1-64)"
              value={bankInput}
              onChangeText={setBankInput}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.bankInput}
            />
            <Text style={styles.slotLabel}>Slot</Text>
            <SegmentedButtons
              value={slotLetter}
              onValueChange={setSlotLetter}
              buttons={SLOT_LETTERS.map(letter => ({
                value: letter,
                label: letter,
              }))}
              style={styles.segmentedButtons}
            />
            <Text style={styles.previewText}>
              Sending to: {bankInput || '?'}-{slotLetter}
            </Text>
            <Text style={styles.noteText}>
              This will select the preset slot and apply the effect on/off states.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSlotDialog(false)}>Cancel</Button>
            <Button onPress={handleSend} loading={sending}>Send</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  dialogText: {
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 12,
  },
  noteText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});
