const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  { ignores: ['node_modules/', 'uploads/', 'logs/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs', // change to 'module' if your code uses import/export
      globals: globals.node,
    },
    rules: { 'no-unused-vars': ['warn', { argsIgnorePattern: '^_|^next$' }] },
  },
  prettier,
];
