module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    webextensions: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist/*']
};
