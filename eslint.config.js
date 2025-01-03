import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  {
    ignores: [
      '*.min.js',
      '.vscode/*',
      'node_modules',
      'public',
      '.prettierrc',
      'index.html',
      '.analyze.html',
      'build',
      '*.mdx',
      'helpers/less-plugin.js'
    ]
  },
  {
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react'],
            ['^antd', '@ant-design/icons'],
            ['^qs', '^lodash-es', 'zustand', 'classnames', 'nprogress', 'webdav'],
            ['normalize.css', 'nprogress/nprogress.css', 'virtual:svg-icons-register'],
            ['^@/router'],
            ['^@/store'],
            ['^@/hooks'],
            ['^@/utils'],
            ['^@/filehandle'],
            ['^@/viewer'],
            ['^@/markdowns'],
            ['^@/tools'],
            ['^@/components'],
            ['^@/App'],
            ['^@/assets'],
            ['^./', '^../']
          ]
        }
      ],
      'simple-import-sort/exports': 'error',
      'react/react-in-jsx-scope': 'off'
    }
  }
];
