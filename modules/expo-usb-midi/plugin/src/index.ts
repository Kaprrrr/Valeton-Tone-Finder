import { ConfigPlugin } from 'expo/config-plugins';
import withAndroidMidiPermissions from './withAndroidMidiPermissions';

const withExpoUsbMidi: ConfigPlugin = (config) => {
  config = withAndroidMidiPermissions(config);
  return config;
};

export default withExpoUsbMidi;
