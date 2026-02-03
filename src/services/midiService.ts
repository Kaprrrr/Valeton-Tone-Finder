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

// GP-200 MIDI CC Mappings - corrected based on real device testing
export const GP200_CC = {
  // Volume and Expression
  VOLUME: 7,
  EXPRESSION: 11,

  // Effect toggles (0-63 = off, 64-127 = on)
  // Order: PRE, DST, AMP, NR, CAB, EQ, MOD, DLY, REV, WAH
  PRE_SWITCH: 48,
  DST_SWITCH: 49,
  AMP_SWITCH: 50,
  NR_SWITCH: 51,
  CAB_SWITCH: 52,
  EQ_SWITCH: 53,
  MOD_SWITCH: 54,
  DLY_SWITCH: 55,
  REV_SWITCH: 56,
  WAH_SWITCH: 57,

  // Tempo
  TEMPO_TAP: 70,
  TEMPO_VALUE_MSB: 74,
  TEMPO_VALUE_LSB: 75,
} as const;

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
  private midiChannel = 0; // GP-200 default MIDI channel (0-indexed, so channel 1)
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
   * GP-200 MIDI Implementation (from official manual):
   * - Banks 1-32:  CC0 = 1, PC = 0-127 (position = (bank-1)*4 + slot)
   * - Banks 33-64: CC0 = 0, PC = 0-127 (position = (bank-33)*4 + slot)
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

    let midiBank: number;
    let program: number;

    if (bank <= 32) {
      // Banks 1-32: CC0 = 1, PC = linear position 0-127
      midiBank = 1;
      program = (bank - 1) * 4 + slot;
    } else {
      // Banks 33-64: CC0 = 0, PC = linear position 0-127 (offset from bank 33)
      midiBank = 0;
      program = (bank - 33) * 4 + slot;
    }

    // Send Bank Select MSB (CC 0)
    await this.sendCC(0, midiBank);
    await new Promise(resolve => setTimeout(resolve, 20));

    // Then send Program Change
    await ExpoUsbMidi.sendProgramChange(this.midiChannel, 0, program);
  }

  /**
   * Send a Control Change message
   */
  async sendCC(controller: number, value: number): Promise<void> {
    if (!ExpoUsbMidi || !ExpoUsbMidi.isConnected()) {
      throw new Error('Not connected to MIDI device');
    }

    await ExpoUsbMidi.sendControlChange(this.midiChannel, controller, value);
  }

  /**
   * Toggle an effect module on/off
   * GP-200 uses 0-63 for off, 64-127 for on
   */
  async toggleModule(
    module: 'PRE' | 'WAH' | 'DST' | 'AMP' | 'CAB' | 'NR' | 'EQ' | 'MOD' | 'DLY' | 'REV',
    enabled: boolean
  ): Promise<void> {
    const ccMap: Record<string, number> = {
      PRE: GP200_CC.PRE_SWITCH,
      WAH: GP200_CC.WAH_SWITCH,
      DST: GP200_CC.DST_SWITCH,
      AMP: GP200_CC.AMP_SWITCH,
      CAB: GP200_CC.CAB_SWITCH,
      NR: GP200_CC.NR_SWITCH,
      EQ: GP200_CC.EQ_SWITCH,
      MOD: GP200_CC.MOD_SWITCH,
      DLY: GP200_CC.DLY_SWITCH,
      REV: GP200_CC.REV_SWITCH,
    };

    const cc = ccMap[module];
    if (cc !== undefined) {
      await this.sendCC(cc, enabled ? 127 : 0);
    }
  }

  /**
   * Set volume level (0-100 scaled to 0-127)
   */
  async setVolume(value: number): Promise<void> {
    const midiValue = Math.round((value / 100) * 127);
    await this.sendCC(GP200_CC.VOLUME, Math.min(127, Math.max(0, midiValue)));
  }

  /**
   * Set expression pedal position (0-100 scaled to 0-127)
   */
  async setExpression(value: number): Promise<void> {
    const midiValue = Math.round((value / 100) * 127);
    await this.sendCC(GP200_CC.EXPRESSION, Math.min(127, Math.max(0, midiValue)));
  }

  /**
   * Send preset module states to the GP-200
   * This toggles each module on/off based on the preset configuration
   * Note: This doesn't change the actual effect parameters, just on/off states
   */
  async sendPresetModuleStates(preset: GP200Preset): Promise<void> {
    if (!ExpoUsbMidi || !ExpoUsbMidi.isConnected()) {
      throw new Error('Not connected to MIDI device');
    }

    const { blocks } = preset;
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Send module states with small delays between messages
    if (blocks.pre !== undefined) {
      await this.toggleModule('PRE', blocks.pre.enabled);
      await delay(15);
    }

    if (blocks.wah !== undefined) {
      await this.toggleModule('WAH', blocks.wah.enabled);
      await delay(15);
    }

    if (blocks.dst !== undefined) {
      await this.toggleModule('DST', blocks.dst.enabled);
      await delay(15);
    }

    // AMP and CAB are always present
    await this.toggleModule('AMP', blocks.amp.enabled);
    await delay(15);

    await this.toggleModule('CAB', blocks.cab.enabled);
    await delay(15);

    if (blocks.nr !== undefined) {
      await this.toggleModule('NR', blocks.nr.enabled);
      await delay(15);
    }

    if (blocks.eq !== undefined) {
      await this.toggleModule('EQ', blocks.eq.enabled);
      await delay(15);
    }

    if (blocks.mod !== undefined) {
      await this.toggleModule('MOD', blocks.mod.enabled);
      await delay(15);
    }

    if (blocks.dly !== undefined) {
      await this.toggleModule('DLY', blocks.dly.enabled);
      await delay(15);
    }

    if (blocks.rev !== undefined) {
      await this.toggleModule('REV', blocks.rev.enabled);
      await delay(15);
    }
  }

  /**
   * Send preset to a specific slot on the GP-200
   * This selects the preset slot and then applies module states
   *
   * @param preset - The preset to send
   * @param bank - Bank number 1-64
   * @param slot - Slot index 0-3 (A=0, B=1, C=2, D=3)
   */
  async sendPresetToDevice(preset: GP200Preset, bank: number, slot: number = 0): Promise<void> {
    if (!ExpoUsbMidi || !ExpoUsbMidi.isConnected()) {
      throw new Error('Not connected to MIDI device');
    }

    // First select the target preset slot
    await this.selectPreset(bank, slot);

    // Wait for the preset to load
    await new Promise(resolve => setTimeout(resolve, 150));

    // Then send the module states
    await this.sendPresetModuleStates(preset);
  }

  /**
   * Set MIDI channel (0-15, where 0 = channel 1)
   */
  setMidiChannel(channel: number): void {
    this.midiChannel = Math.max(0, Math.min(15, channel));
  }

  getMidiChannel(): number {
    return this.midiChannel;
  }

  cleanup() {
    this.eventSubscriptions.forEach(unsub => unsub());
    this.listeners.clear();
  }
}

// Singleton instance
export const gp200MidiService = new GP200MidiService();
