module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '^gi$': '<rootDir>/tests/__mocks__/gnome.js',
    '^imports$': '<rootDir>/tests/__mocks__/gnome.js'
  },
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
};
