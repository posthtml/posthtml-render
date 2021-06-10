const config = {
  verbose: true,
  timeout: '1m',
  files: ['test/test-*'],
  extensions: ['ts'],
  require: ['esm', 'esbuild-register']
};

export default config;
