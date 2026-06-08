import { Platform } from 'react-native';
import type { GP200Preset } from '../types';

// Lazy import to avoid errors on unsupported platforms
let ExpoUsbMidi: typeof import('expo-usb-midi') | null = null;

// Try to import the module (will fail on web)
const loadModule = async () => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    try {
      ExpoUsbMidi = await import('expo-usb-midi');
    } catch (e) {
      console.warn('expo-usb-midi not available:', e);
    }
  }
};

// Load module on init
loadModule();

export interface MidiDevice {
  id: number;
  name: string;
  manufacturer: string;
  product: string;
  inputPortCount: number;
  outputPortCount: number;
  type: string;
}

export interface MidiConnectionState {
  isConnected: boolean;
  device: MidiDevice | null;
  error: string | null;
  isSupported: boolean;
}

type ConnectionListener = (state: MidiConnectionState) => void;

class GP200MidiService {
  private connectionState: MidiConnectionState = {
    isConnected: false,
    device: null,
    error: null,
    isSupported: Platform.OS === 'android' || Platform.OS === 'ios',
  };

  private listeners: Set<ConnectionListener> = new Set();
  private eventSubscriptions: (() => void)[] = [];

  constructor() {
    this.setupEventListeners();
  }

  private async setupEventListeners() {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;

    // Wait for module to load
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!ExpoUsbMidi) {
      await loadModule();
    }

    if (ExpoUsbMidi) {
      const sub1 = ExpoUsbMidi.addDeviceConnectedListener((event) => {
        this.connectionState = {
          ...this.connectionState,
          isConnected: true,
          error: null,
        };
        this.notifyListeners();
      });

      const sub2 = ExpoUsbMidi.addDeviceDisconnectedListener(() => {
        this.connectionState = {
          isConnected: false,
          device: null,
          error: null,
          isSupported: true,
        };
        this.notifyListeners();
      });

      const sub3 = ExpoUsbMidi.addErrorListener((event) => {
        this.connectionState = {
          ...this.connectionState,
          error: event.message,
        };
        this.notifyListeners();
      });

      this.eventSubscriptions = [
        () => sub1.remove(),
        () => sub2.remove(),
        () => sub3.remove(),
      ];
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.connectionState));
  }

  subscribe(listener: ConnectionListener): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.connectionState);
    return () => this.listeners.delete(listener);
  }

  getConnectionState(): MidiConnectionState {
    return this.connectionState;
  }

  isSupported(): boolean {
    return Platform.OS === 'android' || Platform.OS === 'ios';
  }

  async scanForDevices(): Promise<MidiDevice[]> {
    if (!ExpoUsbMidi) {
      await loadModule();
    }

    if (!ExpoUsbMidi) {
      console.warn('MIDI not supported on this platform');
      return [];
    }

    try {
      const devices = await ExpoUsbMidi.getDevices();
      // Return all devices, let the user choose
      // GP-200 may show as "Valeton" or generic "USB MIDI"
      return devices;
    } catch (error) {
      console.error('Failed to scan MIDI devices:', error);
      throw error;
    }
  }

  async connect(device: MidiDevice): Promise<void> {
    if (!ExpoUsbMidi) {
      throw new Error('MIDI not supported on this platform');
    }

    try {
      await ExpoUsbMidi.connect(device.id);
      this.connectionState = {
        isConnected: true,
        device,
        error: null,
        isSupported: true,
      };
      this.notifyListeners();
    } catch (error: any) {
      this.connectionState = {
        isConnected: false,
        device: null,
        error: error.message || 'Failed to connect',
        isSupported: true,
      };
      this.notifyListeners();
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!ExpoUsbMidi) return;

    try {
      await ExpoUsbMidi.disconnect();
      this.connectionState = {
        isConnected: false,
        device: null,
        error: null,
        isSupported: true,
      };
      this.notifyListeners();
    } catch (error: any) {
      this.connectionState.error = error.message;
      this.notifyListeners();
      throw error;
    }
  }

  /**
   * Select a preset slot on the GP-200
   * GP-200 uses Bank (1-64) + Slot (A=0, B=1, C=2, D=3) = 256 presets
   *
   * GP-200 uses SysEx for preset selection (not standard Bank Select + PC):
   * F0 21 25 7E 47 50 2D 32 12 08 00 00 00 00 08 01 00 00 04 00 00 00 00 00 00 [HI] [LO] 00 00 F7
   * Where: HI = floor(presetNum / 16), LO = presetNum % 16
   *
   * @param bank - Bank number 1-64
   * @param slot - Slot index 0-3 (A=0, B=1, C=2, D=3)
   */
  async selectPreset(bank: number, slot: number = 0): Promise<void> {
    if (!ExpoUsbMidi || !ExpoUsbMidi.isConnected()) {
      throw new Error('Not connected to MIDI device');
    }

    if (bank < 1 || bank > 64) {
      throw new Error('Bank number must be between 1 and 64');
    }

    if (slot < 0 || slot > 3) {
      throw new Error('Slot must be 0-3 (A-D)');
    }

    // Calculate preset number (0-255)
    const presetNumber = (bank - 1) * 4 + slot;

    // Encode as nibbles for SysEx
    const hi = Math.floor(presetNumber / 16);
    const lo = presetNumber % 16;

    // GP-200 SysEx preset select message (30 bytes)
    const sysex = [
      0xF0,       // SysEx start
      0x21, 0x25, // Manufacturer ID (Proel/SIEL)
      0x7E,       // Device ID
      0x47, 0x50, 0x2D, 0x32, // "GP-2" in ASCII
      0x12,       // Command type
      0x08,       // Data length indicator
      0x00, 0x00, 0x00, 0x00,
      0x08, 0x01, 0x00, 0x00,
      0x04, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00,
      hi,         // Preset number high nibble
      lo,         // Preset number low nibble
      0x00, 0x00,
      0xF7        // SysEx end
    ];

    await ExpoUsbMidi.sendMidiMessage(sysex);
  }

  /**
   * Send a raw SysEx message
   */
  async sendSysEx(data: number[]): Promise<void> {
    if (!ExpoUsbMidi || !ExpoUsbMidi.isConnected()) {
      throw new Error('Not connected to MIDI device');
    }

    await ExpoUsbMidi.sendMidiMessage(data);
  }

  cleanup() {
    this.eventSubscriptions.forEach(unsub => unsub());
    this.listeners.clear();
  }
}

// Singleton instance
export const gp200MidiService = new GP200MidiService();
