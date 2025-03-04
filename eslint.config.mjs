import pluginJs from '@eslint/js';
import dicodingStyle from 'eslint-config-dicodingacademy';
import jestPlugin from 'eslint-plugin-jest';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

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
      'prettier/prettier': [
        'error',
        {
          printWidth: 100,
          endOfLine: 'lf',
          tabWidth: 2,
          singleQuote: true,
        },
      ],
      camelcase: ['error', { properties: 'never' }],
      ...jestPlugin.configs.recommended.rules,
    },
  },
];
