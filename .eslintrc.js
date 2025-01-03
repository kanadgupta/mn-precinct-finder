module.exports = {
  extends: ['@readme/eslint-config'],
  root: true,
  ignorePatterns: ['coverage/', 'lib/postprocess.js'],
  parserOptions: {
    ecmaVersion: 2020,
  },
};
