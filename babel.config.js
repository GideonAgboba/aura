module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@assets': './src/shared/assets',
          '@components': './src/shared/components',
          '@libs': './src/shared/libs',
          '@store': './src/shared/store',
          '@hooks': './src/shared/hooks',
          '@constants': './src/shared/constants',
          '@helpers': './src/shared/helpers',
          '@context': './src/shared/context',
          '@types': './src/shared/types',
        },
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
