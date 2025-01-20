module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-console': 'error',
    'no-bitwise': 'off',
    'react/jsx-no-undef': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'react/no-unstable-nested-components': [
      'off' || 'warn' || 'error',
      {
        allowAsProps: true || false,
      },
    ],
    'react/require-default-props': ['error', {functions: 'ignore'}],
  },
};
