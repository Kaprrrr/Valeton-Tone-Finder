"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");

const withAndroidMidiPermissions = (config) => {
    return (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        const manifest = config.modResults.manifest;

        // Ensure uses-feature array exists
        if (!manifest['uses-feature']) {
            manifest['uses-feature'] = [];
        }

        // Add USB host feature (optional - allows app to work on devices without USB host)
        const hasUsbHost = manifest['uses-feature'].some((feature) => { var _a; return ((_a = feature.$) === null || _a === void 0 ? void 0 : _a['android:name']) === 'android.hardware.usb.host'; });
        if (!hasUsbHost) {
            manifest['uses-feature'].push({
                $: {
                    'android:name': 'android.hardware.usb.host',
                    'android:required': 'false',
                },
            });
        }

        // Add MIDI feature (optional)
        const hasMidi = manifest['uses-feature'].some((feature) => { var _a; return ((_a = feature.$) === null || _a === void 0 ? void 0 : _a['android:name']) === 'android.software.midi'; });
        if (!hasMidi) {
            manifest['uses-feature'].push({
                $: {
                    'android:name': 'android.software.midi',
                    'android:required': 'false',
                },
            });
        }

        return config;
    });
};

exports.default = withAndroidMidiPermissions;
