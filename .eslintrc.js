module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    webextensions: true
  },
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  ignorePatterns: ['dist*'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  }
};
