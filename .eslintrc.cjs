/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  env: {
    browser: true,
    es2015: true
  },
  extends: [
    'plugin:mdx/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: '2015',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'react/prop-types': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^react'],
          ['^antd', '@ant-design/icons'],
          ['^qs', '^lodash-es', 'classnames', 'nprogress', 'webdav'],
          [
            'normalize.css',
            'nprogress/nprogress.css',
            'virtual:svg-icons-register',
            'default-passive-events'
          ],
          ['^@/router'],
          ['^@/store'],
          ['^@/hooks'],
          ['^@/utils'],
          ['^@/filehandle'],
          ['^@/viewer'],
          ['^@/coder'],
          ['^@/markdowns'],
          ['^@/examples'],
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
};
