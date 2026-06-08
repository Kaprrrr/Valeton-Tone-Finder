import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Chip, IconButton, Text } from 'react-native-paper';
import { useMidi } from '../hooks/useMidi';
import { MidiDevicePicker } from './MidiDevicePicker';

interface Props {
  compact?: boolean;
}

export function MidiConnectionStatus({ compact = false }: Props) {
  const { isConnected, device, error, isSupported, scanDevices, disconnect, scanning } = useMidi();
  const [showPicker, setShowPicker] = useState(false);

  // Don't show anything on unsupported platforms (web)
  if (!isSupported || Platform.OS === 'web') {
    return null;
  }

  const handlePress = () => {
    if (isConnected) {
      disconnect();
    } else {
      scanDevices();
      setShowPicker(true);
    }
  };

  if (compact) {
    return (
      <>
        <IconButton
          icon={isConnected ? 'usb' : 'usb-off'}
          iconColor={isConnected ? '#4CAF50' : '#888'}
          size={20}
          onPress={handlePress}
        />
        <MidiDevicePicker
          visible={showPicker}
          onDismiss={() => setShowPicker(false)}
        />
      </>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Chip
          icon={isConnected ? 'usb' : 'usb-off'}
          mode={isConnected ? 'flat' : 'outlined'}
          onPress={handlePress}
          style={[
            styles.chip,
            {
              backgroundColor: isConnected ? '#4CAF50' : 'transparent',
              borderColor: isConnected ? '#4CAF50' : '#555',
            },
          ]}
          textStyle={{ color: isConnected ? '#FFF' : '#AAA', fontSize: 12 }}
        >
          {isConnected
            ? (device?.name?.substring(0, 12) || 'Device')
            : 'Connect Pedal'}
        </Chip>

        {isConnected && (
          <IconButton
            icon="close"
            iconColor="#888"
            size={16}
            onPress={disconnect}
            style={styles.disconnectBtn}
          />
        )}

        {!isConnected && !scanning && (
          <IconButton
            icon="refresh"
            iconColor="#888"
            size={16}
            onPress={() => {
              scanDevices();
              setShowPicker(true);
            }}
          />
        )}

        {error && (
          <Text style={styles.error} numberOfLines={1}>
            {error}
          </Text>
        )}
      </View>

      <MidiDevicePicker
        visible={showPicker}
        onDismiss={() => setShowPicker(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  chip: {
    height: 28,
  },
  disconnectBtn: {
    margin: 0,
    marginLeft: -4,
  },
  error: {
    color: '#F44336',
    fontSize: 10,
    marginLeft: 8,
    maxWidth: 100,
  },
});
