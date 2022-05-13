/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const escape = require('escape-string-regexp');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const pack = require('../../package.json');
const modules = Object.keys(pack.peerDependencies);

const reactNativeCarbonDir = path.resolve(__dirname, '../../');
const carbonCoreDir = path.resolve(__dirname, '../../../carbon-core');
const reactNativeHeliumDir = path.resolve(
  __dirname,
  '../../../react-native-helium',
);

module.exports = {
  watchFolders: [reactNativeCarbonDir, carbonCoreDir, reactNativeHeliumDir],
  resolver: {
    // blacklistRE: exclusionList(
    //   modules.map(
    //     m =>
    //       new RegExp(
    //         `^${escape(
    //           path.join(reactNativeCarbonDir, 'node_modules', m),
    //         )}\\/.*$`,
    //       ),
    //   ),
    // ),
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
