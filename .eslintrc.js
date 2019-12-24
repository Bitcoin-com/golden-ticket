const path = require('path');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: { node: true },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:prettier/recommended',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'no-plusplus': 0,
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'import/extensions': [
      2,
      { extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.txt'] },
    ],
    'react/prop-types': 0,
    'react/jsx-wrap-multilines': 0,
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  },
  overrides: [
    {
      files: ['*bitcoin-com-rest*'],
      rules: { 'import/no-unresolved': 'off' },
    },
    {
      files: ['*webpack.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
      },
    },
    {
      files: ['*.json'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
