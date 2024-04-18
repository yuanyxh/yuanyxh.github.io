/** @type {import('stylelint').Config} */
module.exports = {
  extends: ['stylelint-config-standard-less', 'stylelint-config-recess-order'],
  rules: {
    'selector-class-pattern': [null]
  },
  overrides: [
    {
      files: ['**/*.less', '**/*.module.less'],
      customSyntax: 'postcss-less'
    }
  ]
};
