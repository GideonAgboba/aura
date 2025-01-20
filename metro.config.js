const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg', 'jsx', 'js', 'ts', 'tsx'],
    resolverMainFields: ['react-native', 'browser', 'main'],
    platforms: ['ios', 'android'],
  },
};

const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeUnknownAttrs: false,
          removeUselessStrokeAndFill: false,
          inlineStyles: false,
          removeTitle: true,
        },
      },
    },
    {
      name: 'convertColors',
      params: {
        currentColor: true,
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-name', 'class'],
      },
    },
    'cleanupListOfValues',
    'sortAttrs',
  ],
};

const finalConfig = mergeConfig(defaultConfig, {
  ...config,
  transformer: {
    ...config.transformer,
    svgTransformer: {
      svgoConfig,
      throwIfNamespace: false,
    },
  },
});

module.exports = wrapWithReanimatedMetroConfig(finalConfig);
