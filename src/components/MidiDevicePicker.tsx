import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { Modal, Portal, Text, Button, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { useMidi } from '../hooks/useMidi';
import type { MidiDevice } from '../services/midiService';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export function MidiDevicePicker({ visible, onDismiss }: Props) {
  const { devices, scanning, connecting, scanDevices, connect, isConnected, isSupported } = useMidi();

  useEffect(() => {
    if (visible && !scanning && devices.length === 0) {
      scanDevices();
    }
  }, [visible]);

  // Close picker when connected
  useEffect(() => {
    if (isConnected && visible) {
      onDismiss();
    }
  }, [isConnected, visible, onDismiss]);

  const handleConnect = async (device: MidiDevice) => {
    try {
      await connect(device);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleRefresh = () => {
    scanDevices();
  };

  if (!isSupported || Platform.OS === 'web') {
    return (
      <Portal>
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge" style={styles.title}>USB MIDI Not Supported</Text>
          <Text style={styles.unsupportedText}>
            USB MIDI connection is only available on Android devices.
          </Text>
          <Button mode="outlined" onPress={onDismiss} style={styles.closeButton}>
            Close
          </Button>
        </Modal>
      </Portal>
    );
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>Connect Device</Text>
          <IconButton
            icon="refresh"
            onPress={handleRefresh}
            disabled={scanning}
            iconColor="#2196F3"
          />
        </View>

        <Text style={styles.instructions}>
          Connect your device via USB-C OTG cable, then select it below.
        </Text>

        {scanning ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Scanning for MIDI devices...</Text>
          </View>
        ) : devices.length === 0 ? (
          <View style={styles.emptyState}>
            <IconButton icon="usb-off" size={48} iconColor="#555" />
            <Text style={styles.emptyText}>
              No MIDI devices found.
            </Text>
            <Text style={styles.emptySubtext}>
              Make sure your device is connected via USB-C OTG cable and powered on.
            </Text>
            <Button
              mode="contained"
              onPress={handleRefresh}
              style={styles.refreshButton}
              icon="refresh"
            >
              Scan Again
            </Button>
          </View>
        ) : (
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            renderItem={({ item }) => (
              <Card
                mode="outlined"
                style={styles.deviceCard}
                onPress={() => handleConnect(item)}
              >
                <Card.Content style={styles.deviceContent}>
                  <View style={styles.deviceInfo}>
                    <Text variant="titleMedium" style={styles.deviceName}>
                      {item.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.deviceMeta}>
                      {item.manufacturer} {item.type ? `(${item.type})` : ''}
                    </Text>
                  </View>
                  {connecting ? (
                    <ActivityIndicator size="small" color="#2196F3" />
                  ) : (
                    <IconButton
                      icon="chevron-right"
                      iconColor="#2196F3"
                    />
                  )}
                </Card.Content>
              </Card>
            )}
          />
        )}

        <Button mode="outlined" onPress={onDismiss} style={styles.closeButton}>
          Cancel
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#1E1E1E',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#FFF',
  },
  instructions: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
    fontSize: 13,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  refreshButton: {
    marginTop: 20,
  },
  list: {
    maxHeight: 300,
  },
  deviceCard: {
    marginBottom: 8,
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
  },
  deviceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    color: '#FFF',
  },
  deviceMeta: {
    color: '#888',
    marginTop: 2,
  },
  unsupportedText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 24,
  },
  closeButton: {
    marginTop: 16,
    borderColor: '#555',
  },
});
