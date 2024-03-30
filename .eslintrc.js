module.exports = {
  extends: ['@readme/eslint-config', '@readme/eslint-config/testing/jest'],
  ignorePatterns: ['coverage/', 'lib/postprocess.js'],
  parserOptions: {
    ecmaVersion: 2020,
  },
};
