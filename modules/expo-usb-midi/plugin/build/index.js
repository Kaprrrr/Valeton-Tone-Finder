"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const withAndroidMidiPermissions_1 = require("./withAndroidMidiPermissions");

const withExpoUsbMidi = (config) => {
    config = (0, withAndroidMidiPermissions_1.default)(config);
    return config;
};

exports.default = withExpoUsbMidi;
module.exports = withExpoUsbMidi;
