const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Set the public path for GitHub Pages subdirectory
config.transformer = {
  ...config.transformer,
  publicPath: '/game',
};

module.exports = config;
