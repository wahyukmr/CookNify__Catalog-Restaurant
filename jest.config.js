/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  testMatch: [
    '**/__tests__/integration/**/*.test.[jt]s?(x)',
    '**/__tests__/unit/**/*.test.[jt]s?(x)',
  ],

  maxWorkers: 2,

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['./jest.setup.js'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
};

module.exports = config;
