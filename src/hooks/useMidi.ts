import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { gp200MidiService, MidiConnectionState, MidiDevice } from '../services/midiService';

export interface UseMidiReturn extends MidiConnectionState {
  devices: MidiDevice[];
  scanning: boolean;
  sending: boolean;
  connecting: boolean;
  scanDevices: () => Promise<void>;
  connect: (device: MidiDevice) => Promise<void>;
  disconnect: () => Promise<void>;
  selectPreset: (bank: number, slot: number) => Promise<void>;
  sendSysEx: (data: number[]) => Promise<void>;
}

export function useMidi(): UseMidiReturn {
  const [connectionState, setConnectionState] = useState<MidiConnectionState>(
    gp200MidiService.getConnectionState()
  );
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [sending, setSending] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const unsubscribe = gp200MidiService.subscribe(setConnectionState);
    return () => {
      unsubscribe();
    };
  }, []);

  const scanDevices = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setDevices([]);
      return;
    }

    setScanning(true);
    try {
      const foundDevices = await gp200MidiService.scanForDevices();
      setDevices(foundDevices);
    } catch (error) {
      console.error('Scan failed:', error);
      setDevices([]);
    } finally {
      setScanning(false);
    }
  }, []);

  const connect = useCallback(async (device: MidiDevice) => {
    setConnecting(true);
    try {
      await gp200MidiService.connect(device);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await gp200MidiService.disconnect();
  }, []);

  const selectPreset = useCallback(async (bank: number, slot: number) => {
    await gp200MidiService.selectPreset(bank, slot);
  }, []);

  const sendSysEx = useCallback(async (data: number[]) => {
    await gp200MidiService.sendSysEx(data);
  }, []);

  return {
    ...connectionState,
    devices,
    scanning,
    sending,
    connecting,
    scanDevices,
    connect,
    disconnect,
    selectPreset,
    sendSysEx,
  };
}
