import ExpoModulesCore
import CoreMIDI

public class ExpoUsbMidiModule: Module {
    private var midiClient: MIDIClientRef = 0
    private var outputPort: MIDIPortRef = 0
    private var connectedEndpoint: MIDIEndpointRef = 0
    private var connectedDeviceId: Int = -1
    private var isSetup: Bool = false

    public func definition() -> ModuleDefinition {
        Name("ExpoUsbMidi")

        Events("onDeviceConnected", "onDeviceDisconnected", "onError", "onDevicesChanged")

        OnCreate {
            self.setupMIDI()
        }

        Function("hasMidiSupport") { () -> Bool in
            return true // iOS always has CoreMIDI
        }

        AsyncFunction("getDevices") { (promise: Promise) in
            var devices: [[String: Any]] = []

            let destinationCount = MIDIGetNumberOfDestinations()
            for i in 0..<destinationCount {
                let endpoint = MIDIGetDestination(i)
                if endpoint != 0 {
                    let device = self.getDeviceInfo(endpoint: endpoint, index: i)
                    devices.append(device)
                }
            }

            promise.resolve(devices)
        }

        AsyncFunction("connect") { (deviceId: Int, promise: Promise) in
            let destinationCount = MIDIGetNumberOfDestinations()

            guard deviceId >= 0 && deviceId < destinationCount else {
                promise.reject("DEVICE_NOT_FOUND", "MIDI device not found")
                return
            }

            let endpoint = MIDIGetDestination(deviceId)
            guard endpoint != 0 else {
                promise.reject("DEVICE_NOT_FOUND", "MIDI device not found")
                return
            }

            self.connectedEndpoint = endpoint
            self.connectedDeviceId = deviceId

            let deviceInfo = self.getDeviceInfo(endpoint: endpoint, index: deviceId)
            self.sendEvent("onDeviceConnected", [
                "deviceId": deviceId,
                "name": deviceInfo["name"] ?? "Unknown"
            ])

            promise.resolve(true)
        }

        AsyncFunction("disconnect") { (promise: Promise) in
            self.connectedEndpoint = 0
            self.connectedDeviceId = -1
            self.sendEvent("onDeviceDisconnected", [:])
            promise.resolve(true)
        }

        Function("isConnected") { () -> Bool in
            return self.connectedEndpoint != 0
        }

        Function("getConnectedDeviceId") { () -> Int? in
            return self.connectedEndpoint != 0 ? self.connectedDeviceId : nil
        }

        AsyncFunction("sendMidiMessage") { (data: [Int], promise: Promise) in
            guard self.connectedEndpoint != 0 else {
                promise.reject("NOT_CONNECTED", "No MIDI device connected")
                return
            }

            let bytes = data.map { UInt8($0 & 0xFF) }
            let result = self.sendMIDIBytes(bytes)

            if result == noErr {
                promise.resolve(true)
            } else {
                promise.reject("SEND_FAILED", "Failed to send MIDI message: \(result)")
            }
        }

        AsyncFunction("sendProgramChange") { (channel: Int, bank: Int, program: Int, promise: Promise) in
            guard self.connectedEndpoint != 0 else {
                promise.reject("NOT_CONNECTED", "No MIDI device connected")
                return
            }

            let ch = UInt8(channel & 0x0F)
            let bankValue = UInt8(bank & 0x7F)
            let programValue = UInt8(program & 0x7F)

            // Bank Select MSB (CC0)
            var result = self.sendMIDIBytes([0xB0 | ch, 0x00, bankValue])
            guard result == noErr else {
                promise.reject("SEND_FAILED", "Failed to send bank select")
                return
            }

            // Small delay
            usleep(10000) // 10ms

            // Program Change
            result = self.sendMIDIBytes([0xC0 | ch, programValue])
            guard result == noErr else {
                promise.reject("SEND_FAILED", "Failed to send program change")
                return
            }

            promise.resolve(true)
        }

        AsyncFunction("sendControlChange") { (channel: Int, controller: Int, value: Int, promise: Promise) in
            guard self.connectedEndpoint != 0 else {
                promise.reject("NOT_CONNECTED", "No MIDI device connected")
                return
            }

            let ch = UInt8(channel & 0x0F)
            let cc = UInt8(controller & 0x7F)
            let val = UInt8(value & 0x7F)

            let result = self.sendMIDIBytes([0xB0 | ch, cc, val])

            if result == noErr {
                promise.resolve(true)
            } else {
                promise.reject("SEND_FAILED", "Failed to send control change")
            }
        }

        AsyncFunction("sendMultipleCC") { (channel: Int, messages: [[String: Int]], delayMs: Int, promise: Promise) in
            guard self.connectedEndpoint != 0 else {
                promise.reject("NOT_CONNECTED", "No MIDI device connected")
                return
            }

            let ch = UInt8(channel & 0x0F)
            let delayMicros = useconds_t(min(max(delayMs, 0), 1000) * 1000)

            for msg in messages {
                guard let controller = msg["controller"], let value = msg["value"] else {
                    continue
                }

                let cc = UInt8(controller & 0x7F)
                let val = UInt8(value & 0x7F)

                let result = self.sendMIDIBytes([0xB0 | ch, cc, val])
                if result != noErr {
                    promise.reject("SEND_FAILED", "Failed to send CC message")
                    return
                }

                if delayMicros > 0 {
                    usleep(delayMicros)
                }
            }

            promise.resolve(true)
        }

        OnDestroy {
            self.cleanup()
        }
    }

    private func setupMIDI() {
        guard !isSetup else { return }

        let clientName = "ExpoUsbMidi" as CFString
        var status = MIDIClientCreateWithBlock(clientName, &midiClient) { [weak self] notification in
            self?.handleMIDINotification(notification)
        }

        guard status == noErr else {
            print("Failed to create MIDI client: \(status)")
            return
        }

        let portName = "Output" as CFString
        status = MIDIOutputPortCreate(midiClient, portName, &outputPort)

        guard status == noErr else {
            print("Failed to create MIDI output port: \(status)")
            return
        }

        isSetup = true
    }

    private func handleMIDINotification(_ notification: UnsafePointer<MIDINotification>) {
        switch notification.pointee.messageID {
        case .msgSetupChanged:
            sendEvent("onDevicesChanged", ["action": "changed"])

            // Check if our connected device is still available
            if connectedEndpoint != 0 {
                var found = false
                let count = MIDIGetNumberOfDestinations()
                for i in 0..<count {
                    if MIDIGetDestination(i) == connectedEndpoint {
                        found = true
                        break
                    }
                }
                if !found {
                    connectedEndpoint = 0
                    connectedDeviceId = -1
                    sendEvent("onDeviceDisconnected", [:])
                }
            }

        case .msgObjectAdded:
            sendEvent("onDevicesChanged", ["action": "added"])

        case .msgObjectRemoved:
            sendEvent("onDevicesChanged", ["action": "removed"])

        default:
            break
        }
    }

    private func getDeviceInfo(endpoint: MIDIEndpointRef, index: Int) -> [String: Any] {
        var name: Unmanaged<CFString>?
        var manufacturer: Unmanaged<CFString>?

        MIDIObjectGetStringProperty(endpoint, kMIDIPropertyDisplayName, &name)
        MIDIObjectGetStringProperty(endpoint, kMIDIPropertyManufacturer, &manufacturer)

        let displayName = name?.takeRetainedValue() as String? ?? "Unknown Device"
        let mfr = manufacturer?.takeRetainedValue() as String? ?? "Unknown"

        return [
            "id": index,
            "name": displayName,
            "manufacturer": mfr,
            "product": displayName,
            "inputPortCount": 1,
            "outputPortCount": 1,
            "type": "USB"
        ]
    }

    private func sendMIDIBytes(_ bytes: [UInt8]) -> OSStatus {
        guard outputPort != 0, connectedEndpoint != 0 else {
            return -1
        }

        var packetList = MIDIPacketList()
        var packet = MIDIPacketListInit(&packetList)
        packet = MIDIPacketListAdd(&packetList, 1024, packet, 0, bytes.count, bytes)

        return MIDISend(outputPort, connectedEndpoint, &packetList)
    }

    private func cleanup() {
        if outputPort != 0 {
            MIDIPortDispose(outputPort)
            outputPort = 0
        }
        if midiClient != 0 {
            MIDIClientDispose(midiClient)
            midiClient = 0
        }
        connectedEndpoint = 0
        connectedDeviceId = -1
        isSetup = false
    }
}
