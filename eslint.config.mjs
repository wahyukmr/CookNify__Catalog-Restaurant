import pluginJs from '@eslint/js';
import dicodingStyle from 'eslint-config-dicodingacademy';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import jestPlugin from 'eslint-plugin-jest';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  dicodingStyle,
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      camelcase: ['error', { properties: 'never' }],
      ...jestPlugin.configs.recommended.rules,
    },
  },
];
