module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base)"
  ],
  bail: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "./src/**/*",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/_temp/**",
    "!**/request.js"
  ],
  testEnvironment: "jsdom"
};
