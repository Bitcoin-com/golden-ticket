const path = require('path');

module.exports = {
  env: { node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.eslint.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  rules: {
    strict: 0,
    'no-await-in-loop': 0,
    'no-plusplus': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unsafe-member-acces': 0,
  },
  overrides: [
    {
      files: ['*.png', '*.txt'],
    },
    {
      files: ['*.json'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
    {
      files: ['webpack.config.js'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
