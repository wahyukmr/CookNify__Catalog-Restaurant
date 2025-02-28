import pluginJs from '@eslint/js';
import dicodingStyle from 'eslint-config-dicodingacademy';
import prettierConfig from 'eslint-plugin-prettier/recommended'; // Memastikan bahwa Prettier dan ESLint bekerja sama dengan baik
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
