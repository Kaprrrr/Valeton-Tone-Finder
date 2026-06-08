package expo.modules.usbmidi

import android.content.Context
import android.content.pm.PackageManager
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.media.midi.MidiDevice
import android.media.midi.MidiDeviceInfo
import android.media.midi.MidiInputPort
import android.media.midi.MidiManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class DeviceNotFoundException : CodedException("DEVICE_NOT_FOUND", "MIDI device not found", null)
class NotConnectedException : CodedException("NOT_CONNECTED", "No MIDI device connected", null)
class ConnectionFailedException(message: String) : CodedException("CONNECTION_FAILED", message, null)
class SendFailedException(message: String) : CodedException("SEND_FAILED", message, null)

class ExpoUsbMidiModule : Module() {
    private var midiManager: MidiManager? = null
    private var currentDevice: MidiDevice? = null
    private var inputPort: MidiInputPort? = null
    private var connectedDeviceId: Int = -1

    private val mainHandler = Handler(Looper.getMainLooper())

    override fun definition() = ModuleDefinition {
        Name("ExpoUsbMidi")

        Events("onDeviceConnected", "onDeviceDisconnected", "onError", "onDevicesChanged")

        OnCreate {
            val context = appContext.reactContext ?: return@OnCreate
            if (context.packageManager.hasSystemFeature(PackageManager.FEATURE_MIDI)) {
                midiManager = context.getSystemService(Context.MIDI_SERVICE) as? MidiManager
                setupDeviceCallback()
            }
        }

        Function("hasMidiSupport") {
            val context = appContext.reactContext ?: return@Function false
            context.packageManager.hasSystemFeature(PackageManager.FEATURE_MIDI)
        }

        AsyncFunction("getDevices") { promise: Promise ->
            val manager = midiManager
            if (manager == null) {
                promise.resolve(emptyList<Map<String, Any>>())
                return@AsyncFunction
            }

            try {
                val devices = manager.devices?.map { deviceInfo ->
                    mapOf(
                        "id" to deviceInfo.id,
                        "name" to (deviceInfo.properties.getString(MidiDeviceInfo.PROPERTY_NAME) ?: "Unknown MIDI Device"),
                        "manufacturer" to (deviceInfo.properties.getString(MidiDeviceInfo.PROPERTY_MANUFACTURER) ?: "Unknown"),
                        "product" to (deviceInfo.properties.getString(MidiDeviceInfo.PROPERTY_PRODUCT) ?: "Unknown"),
                        "inputPortCount" to deviceInfo.inputPortCount,
                        "outputPortCount" to deviceInfo.outputPortCount,
                        "type" to when (deviceInfo.type) {
                            MidiDeviceInfo.TYPE_USB -> "USB"
                            MidiDeviceInfo.TYPE_BLUETOOTH -> "Bluetooth"
                            MidiDeviceInfo.TYPE_VIRTUAL -> "Virtual"
                            else -> "Unknown"
                        }
                    )
                } ?: emptyList()
                promise.resolve(devices)
            } catch (e: Exception) {
                promise.reject("GET_DEVICES_ERROR", e.message ?: "Failed to get devices", e)
            }
        }

        AsyncFunction("connect") { deviceId: Int, promise: Promise ->
            val manager = midiManager
            if (manager == null) {
                promise.reject(ConnectionFailedException("MIDI not supported on this device"))
                return@AsyncFunction
            }

            val deviceInfo = manager.devices?.find { it.id == deviceId }
            if (deviceInfo == null) {
                promise.reject(DeviceNotFoundException())
                return@AsyncFunction
            }

            // Close existing connection first
            closeConnection()

            manager.openDevice(deviceInfo, { device ->
                if (device != null) {
                    // Try to open input port (for sending MIDI to device)
                    if (deviceInfo.inputPortCount > 0) {
                        val port = device.openInputPort(0)
                        if (port != null) {
                            currentDevice = device
                            inputPort = port
                            connectedDeviceId = deviceId

                            mainHandler.post {
                                sendEvent("onDeviceConnected", mapOf(
                                    "deviceId" to deviceId,
                                    "name" to (deviceInfo.properties.getString(MidiDeviceInfo.PROPERTY_NAME) ?: "Unknown")
                                ))
                            }
                            promise.resolve(true)
                        } else {
                            device.close()
                            promise.reject(ConnectionFailedException("Failed to open MIDI input port"))
                        }
                    } else {
                        device.close()
                        promise.reject(ConnectionFailedException("Device has no input ports"))
                    }
                } else {
                    promise.reject(ConnectionFailedException("Failed to open MIDI device"))
                }
            }, mainHandler)
        }

        AsyncFunction("disconnect") { promise: Promise ->
            try {
                closeConnection()
                sendEvent("onDeviceDisconnected", mapOf<String, Any>())
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("DISCONNECT_ERROR", e.message ?: "Failed to disconnect", e)
            }
        }

        Function("isConnected") {
            inputPort != null && currentDevice != null
        }

        Function("getConnectedDeviceId") {
            if (inputPort != null && currentDevice != null) connectedDeviceId else null
        }

        AsyncFunction("sendMidiMessage") { data: List<Int>, promise: Promise ->
            val port = inputPort
            if (port == null) {
                promise.reject(NotConnectedException())
                return@AsyncFunction
            }

            try {
                val bytes = data.map { it.toByte() }.toByteArray()
                port.send(bytes, 0, bytes.size, System.nanoTime())
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject(SendFailedException(e.message ?: "Failed to send MIDI message"))
            }
        }

        AsyncFunction("sendProgramChange") { channel: Int, bank: Int, program: Int, promise: Promise ->
            val port = inputPort
            if (port == null) {
                promise.reject(NotConnectedException())
                return@AsyncFunction
            }

            try {
                val ch = channel.coerceIn(0, 15)
                val bankValue = bank.coerceIn(0, 127)
                val programValue = program.coerceIn(0, 127)

                // Bank Select MSB (CC0)
                val bankSelectMSB = byteArrayOf(
                    (0xB0 or ch).toByte(),  // Control Change on channel
                    0x00.toByte(),           // CC0 (Bank Select MSB)
                    bankValue.toByte()
                )
                port.send(bankSelectMSB, 0, 3, System.nanoTime())

                // Small delay for device to process
                Thread.sleep(10)

                // Program Change
                val programChange = byteArrayOf(
                    (0xC0 or ch).toByte(),  // Program Change on channel
                    programValue.toByte()
                )
                port.send(programChange, 0, 2, System.nanoTime())

                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject(SendFailedException(e.message ?: "Failed to send program change"))
            }
        }

        AsyncFunction("sendControlChange") { channel: Int, controller: Int, value: Int, promise: Promise ->
            val port = inputPort
            if (port == null) {
                promise.reject(NotConnectedException())
                return@AsyncFunction
            }

            try {
                val ch = channel.coerceIn(0, 15)
                val cc = controller.coerceIn(0, 127)
                val val_ = value.coerceIn(0, 127)

                val ccMessage = byteArrayOf(
                    (0xB0 or ch).toByte(),  // Control Change on channel
                    cc.toByte(),
                    val_.toByte()
                )
                port.send(ccMessage, 0, 3, System.nanoTime())
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject(SendFailedException(e.message ?: "Failed to send control change"))
            }
        }

        AsyncFunction("sendMultipleCC") { channel: Int, messages: List<Map<String, Int>>, delayMs: Int, promise: Promise ->
            val port = inputPort
            if (port == null) {
                promise.reject(NotConnectedException())
                return@AsyncFunction
            }

            try {
                val ch = channel.coerceIn(0, 15)
                val delay = delayMs.coerceIn(0, 1000).toLong()

                for (msg in messages) {
                    val cc = (msg["controller"] ?: 0).coerceIn(0, 127)
                    val value = (msg["value"] ?: 0).coerceIn(0, 127)

                    val ccMessage = byteArrayOf(
                        (0xB0 or ch).toByte(),
                        cc.toByte(),
                        value.toByte()
                    )
                    port.send(ccMessage, 0, 3, System.nanoTime())

                    if (delay > 0 && messages.indexOf(msg) < messages.size - 1) {
                        Thread.sleep(delay)
                    }
                }
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject(SendFailedException(e.message ?: "Failed to send CC messages"))
            }
        }

        OnDestroy {
            closeConnection()
        }
    }

    private fun setupDeviceCallback() {
        midiManager?.registerDeviceCallback(object : MidiManager.DeviceCallback() {
            override fun onDeviceAdded(device: MidiDeviceInfo) {
                mainHandler.post {
                    sendEvent("onDevicesChanged", mapOf("action" to "added", "deviceId" to device.id))
                }
            }

            override fun onDeviceRemoved(device: MidiDeviceInfo) {
                mainHandler.post {
                    // If the removed device was our connected device, clean up
                    if (device.id == connectedDeviceId) {
                        closeConnection()
                        sendEvent("onDeviceDisconnected", mapOf("deviceId" to device.id))
                    }
                    sendEvent("onDevicesChanged", mapOf("action" to "removed", "deviceId" to device.id))
                }
            }
        }, mainHandler)
    }

    private fun closeConnection() {
        try {
            inputPort?.close()
            currentDevice?.close()
        } catch (e: Exception) {
            // Ignore close errors
        } finally {
            inputPort = null
            currentDevice = null
            connectedDeviceId = -1
        }
    }
}
