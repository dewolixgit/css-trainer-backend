const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['parameter'],
        format: ['camelCase', 'PascalCase', 'snake_case'],
      },
      {
        selector: ['typeProperty', 'objectLiteralProperty'],
        format: ['camelCase', 'snake_case', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: ['memberLike'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      {
        selector: ['memberLike'],
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      {
        selector: ['memberLike'],
        modifiers: ['protected'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      {
        selector: ['variable', 'function'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      {
        selector: ['typeLike'],
        format: ['PascalCase'],
      },
      {
        selector: ['default'],
        format: ['camelCase'],
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        project: path.resolve('./tsconfig.json'),
      },
    },
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
  },
};
