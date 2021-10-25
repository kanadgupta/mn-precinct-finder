module.exports = {
  extends: ['@readme/eslint-config', '@readme/eslint-config/testing'],
  ignorePatterns: ['coverage/', 'lib/postprocess.js'],
  parserOptions: {
    ecmaVersion: 2020,
  },
};
