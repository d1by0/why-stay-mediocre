const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for WebAssembly (.wasm) files required by expo-sqlite on the web
config.resolver.assetExts.push('wasm');

module.exports = config;
