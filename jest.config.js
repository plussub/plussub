export default {
  // testRunner: 'jest-circus/runner',  // Disabled because of memory leaks https://github.com/facebook/jest/issues/7274
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    '^.+\\.(js|ts)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/popup/$1',
    '^#/(.*)$': '<rootDir>/src/background/$1',
    '^ReduxConfig$': '<rootDir>/test/reduxConfig'
  },
  testRegex: 'test/.*(test|spec)\\.(js|ts)$',
  // transformIgnorePatterns: [
  //   '<rootDir>/node_modules/(?!(vue-virtual-scroller|apollo-link|aws-amplify|vuetify|@tts-intern/capacitor-nfc))'
  // ],
  preset: 'ts-jest'
};
