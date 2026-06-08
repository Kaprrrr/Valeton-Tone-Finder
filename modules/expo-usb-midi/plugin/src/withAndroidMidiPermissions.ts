import { ConfigPlugin, withAndroidManifest, AndroidConfig } from 'expo/config-plugins';

const withAndroidMidiPermissions: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // Ensure uses-feature array exists
    if (!manifest['uses-feature']) {
      manifest['uses-feature'] = [];
    }

    // Add USB host feature (optional - allows app to work on devices without USB host)
    const hasUsbHost = manifest['uses-feature'].some(
      (feature: any) => feature.$?.['android:name'] === 'android.hardware.usb.host'
    );

    if (!hasUsbHost) {
      manifest['uses-feature'].push({
        $: {
          'android:name': 'android.hardware.usb.host',
          'android:required': 'false',
        },
      });
    }

    // Add MIDI feature (optional)
    const hasMidi = manifest['uses-feature'].some(
      (feature: any) => feature.$?.['android:name'] === 'android.software.midi'
    );

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

export default withAndroidMidiPermissions;
