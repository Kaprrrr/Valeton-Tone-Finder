export interface MidiDevice {
  id: number;
  name: string;
  manufacturer: string;
  product: string;
  inputPortCount: number;
  outputPortCount: number;
  type: 'USB' | 'Bluetooth' | 'Virtual' | 'Unknown';
}

export interface CCMessage {
  controller: number;
  value: number;
}

export interface DeviceConnectedEvent {
  deviceId: number;
  name: string;
}

export interface DeviceDisconnectedEvent {
  deviceId?: number;
}

export interface DevicesChangedEvent {
  action: 'added' | 'removed';
  deviceId: number;
}

export interface ErrorEvent {
  message: string;
}

export type ExpoUsbMidiEvents = {
  onDeviceConnected: DeviceConnectedEvent;
  onDeviceDisconnected: DeviceDisconnectedEvent;
  onDevicesChanged: DevicesChangedEvent;
  onError: ErrorEvent;
  [key: string]: unknown;
}
