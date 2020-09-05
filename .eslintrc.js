module.exports = {
    extends: [
      // add more generic rulesets here, such as:
      // 'eslint:recommended',
      'plugin:vue/recommended'
    ],
    rules: {
      // override/add rules settings here, such as:
      //'no-redeclare': 'error',
      'no-undef': 'error',
      //'no-unused-vars': 'error',
      
      'vue/require-prop-types': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'array-element-newline': ['error', 'never'],
      'vue/attributes-order': ['error', {
        'order': [],
        'alphabetical': false
       }],
      'vue/max-attributes-per-line': ['error', {
        'singleline': 8,
        'multiline': {
          'max': 3,
          'allowFirstLine': true
        }
      }]
    },
    'globals': {
        'require': true,
        'module': true,
        'process': true
    }
  }