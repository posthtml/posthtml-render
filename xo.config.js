module.exports = {
  space: true,
  ignores: ['test/render.test.js'],
  rules: {
    'ava/no-import-test-files': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'import/extensions': 'off',
    'ava/no-skip-test': 'off',
    'ava/no-only-test': 'off'
  }
};
