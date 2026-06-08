import { requireNativeModule, EventEmitter } from 'expo-modules-core';
import type { MidiDevice, CCMessage, DeviceConnectedEvent, DeviceDisconnectedEvent, DevicesChangedEvent, ErrorEvent } from './ExpoUsbMidi.types';

interface ExpoUsbMidiModuleType {
  hasMidiSupport(): boolean;
  getDevices(): Promise<MidiDevice[]>;
  connect(deviceId: number): Promise<boolean>;
  disconnect(): Promise<boolean>;
  isConnected(): boolean;
  getConnectedDeviceId(): number | null;
  sendMidiMessage(data: number[]): Promise<boolean>;
  sendProgramChange(channel: number, bank: number, program: number): Promise<boolean>;
  sendControlChange(channel: number, controller: number, value: number): Promise<boolean>;
  sendMultipleCC(channel: number, messages: CCMessage[], delayMs: number): Promise<boolean>;
  addListener(eventName: string, listener: (event: any) => void): { remove: () => void };
}

const ExpoUsbMidiModule = requireNativeModule<ExpoUsbMidiModuleType>('ExpoUsbMidi');

export function hasMidiSupport(): boolean {
  return ExpoUsbMidiModule.hasMidiSupport();
}

export async function getDevices(): Promise<MidiDevice[]> {
  return ExpoUsbMidiModule.getDevices();
}

export async function connect(deviceId: number): Promise<boolean> {
  return ExpoUsbMidiModule.connect(deviceId);
}

export async function disconnect(): Promise<boolean> {
  return ExpoUsbMidiModule.disconnect();
}

export function isConnected(): boolean {
  return ExpoUsbMidiModule.isConnected();
}

export function getConnectedDeviceId(): number | null {
  return ExpoUsbMidiModule.getConnectedDeviceId();
}

export async function sendMidiMessage(data: number[]): Promise<boolean> {
  return ExpoUsbMidiModule.sendMidiMessage(data);
}

export async function sendProgramChange(
  channel: number,
  bank: number,
  program: number
): Promise<boolean> {
  return ExpoUsbMidiModule.sendProgramChange(channel, bank, program);
}

export async function sendControlChange(
  channel: number,
  controller: number,
  value: number
): Promise<boolean> {
  return ExpoUsbMidiModule.sendControlChange(channel, controller, value);
}

export async function sendMultipleCC(
  channel: number,
  messages: CCMessage[],
  delayMs: number = 10
): Promise<boolean> {
  return ExpoUsbMidiModule.sendMultipleCC(channel, messages, delayMs);
}

export function addDeviceConnectedListener(
  listener: (event: DeviceConnectedEvent) => void
) {
  return ExpoUsbMidiModule.addListener('onDeviceConnected', listener);
}

export function addDeviceDisconnectedListener(
  listener: (event: DeviceDisconnectedEvent) => void
) {
  return ExpoUsbMidiModule.addListener('onDeviceDisconnected', listener);
}

export function addDevicesChangedListener(
  listener: (event: DevicesChangedEvent) => void
) {
  return ExpoUsbMidiModule.addListener('onDevicesChanged', listener);
}

export function addErrorListener(
  listener: (event: ErrorEvent) => void
) {
  return ExpoUsbMidiModule.addListener('onError', listener);
}

export { ExpoUsbMidiModule };
