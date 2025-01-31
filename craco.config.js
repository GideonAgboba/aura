const path = require('path');

module.exports = {
  webpack: {
    devtool: 'source-map',
    alias: {
      '@context': path.resolve(__dirname, 'src/shared/context'),
      '@navigation': path.resolve(__dirname, 'src/navigation'),
      '@tests': path.resolve(__dirname, 'src/tests'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@assets': path.resolve(__dirname, 'src/shared/assets'),
      '@components': path.resolve(__dirname, 'src/shared/components'),
      '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
      '@store': path.resolve(__dirname, 'src/shared/store'),
      '@constants': path.resolve(__dirname, 'src/shared/constants'),
      '@lib': path.resolve(__dirname, 'src/shared/lib'),
      '@types': path.resolve(__dirname, 'src/shared/types'),
    },
    configure: {
      module: {
        rules: [
          {
            test: /\.svg$/,
            use: ['@svgr/webpack'],
          },
        ],
      },
    },
  },
  jest: {
    configure: {
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
      moduleNameMapper: {
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@navigation$': '<rootDir>/src/navigation',
        '^@tests$': '<rootDir>/src/tests',
        '^@assets/(.*)$': '<rootDir>/src/shared/assets/$1',
        '^@components$': '<rootDir>/src/shared/components',
        '^@hooks$': '<rootDir>/src/shared/hooks',
        '^@store$': '<rootDir>/src/shared/store',
        '^@constants$': '<rootDir>/src/shared/constants',
        '^@lib$': '<rootDir>/src/shared/lib',
        '^@context$': '<rootDir>/src/shared/context',
        '^@types$': '<rootDir>/src/shared/types',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(png|svg)$': '<rootDir>/src/tests/mocks/fileMock.js',
      },
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/tsconfig.json',
          },
        ],
      },
      // transformIgnorePatterns: ["node_modules/(?!(react-router-dom)/)"],
      // testMatch: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      globals: {
        'ts-jest': {
          tsconfig: '<rootDir>/tsconfig.json',
        },
      },
    },
  },
  devServer: {
    client: {
      overlay: false, // Just hiding runtime error dialog
    },
  },
};
