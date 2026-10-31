const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {parseArgs} = require('node:util');

const {values, positionals} = parseArgs({
  options: {node: {type: 'string'}},
  allowPositionals: true,
});
assert.equal(positionals.length, 1, 'Usage: npm run test:packed -- <renderer.tgz> [--node /path/to/node]');
assert.ok(process.env.npm_execpath, 'Run this helper through npm run test:packed');
const tarball = path.resolve(positionals[0]);
assert.ok(fs.statSync(tarball).isFile());
const runtime = values.node ? path.resolve(values.node) : process.execPath;
const work = fs.mkdtempSync(path.join(process.env.POSTHTML_TEST_TMP || os.tmpdir(), 'posthtml-render-packed-'));
const consumer = path.join(work, 'consumer');
const harness = path.join(work, 'harness');
const lock = require('../package-lock.json');
let passed = false;

try {
  install(consumer, {'posthtml-render': 'file:' + tarball});
  // Only the parser round-trip fixture needs a dependency. It is not installed
  // alongside the production renderer, nor loaded by the renderer itself.
  install(harness, {'posthtml-parser': lock.packages['node_modules/posthtml-parser'].version});
  for (const dependency of ['typescript', 'posthtml-parser', 'eslint']) {
    assert.equal(fs.existsSync(path.join(consumer, 'node_modules', dependency)), false);
  }
  const tests = path.join(work, 'test');
  fs.cpSync(__dirname, tests, {recursive: true});
  const entry = path.join(consumer, 'node_modules/posthtml-render');
  const env = {...process.env, NODE_PATH: path.join(harness, 'node_modules'), POSTHTML_RENDER_PACKAGE: entry};
  run(runtime, [path.join(tests, 'installed.cjs')], {cwd: consumer, env});

  // Compile against the isolated production package, with no parser types or
  // development packages available from its node_modules or its parent paths.
  for (const file of ['consumer.ts', 'consumer.mts']) {
    const source = fs.readFileSync(path.join(__dirname, 'types', file), 'utf8')
      .replaceAll("from '../..'", "from 'posthtml-render'")
      .replaceAll("from '../../dist/index.js'", "from 'posthtml-render'");
    fs.writeFileSync(path.join(consumer, file), source);
  }
  fs.copyFileSync(path.join(__dirname, 'types/tsconfig.json'), path.join(consumer, 'tsconfig.json'));
  run(process.execPath, [require.resolve('typescript/bin/tsc'), '--noEmit', '-p',
    path.join(consumer, 'tsconfig.json')], {cwd: consumer});
  passed = true;
  console.log('Packed runtime and standalone declarations passed');
} finally {
  if (passed) fs.rmSync(work, {recursive: true, force: true});
  else console.error('Failed consumer fixture preserved at ' + work);
}

function install(directory, dependencies) {
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify({private: true, dependencies}));
  run(process.execPath, [process.env.npm_execpath, 'install', '--prefix', directory,
    '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund']);
}

function run(node, args, options = {}) {
  const result = spawnSync(node, args, {...options, stdio: 'inherit'});
  if (result.error) throw result.error;
  assert.equal(result.status, 0, 'Command failed: ' + node + ' ' + args.join(' '));
}
