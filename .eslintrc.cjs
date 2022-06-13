module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    webextensions: true
  },
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint', "gh-issue"],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  ignorePatterns: ['dist*'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  "rules": {
    "gh-issue/open-issue": 1,
    "vue/multi-word-component-names": "off",
    "vue/no-reserved-component-names": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  }
};
