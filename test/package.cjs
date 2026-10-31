const assert = require('assert').strict;
const path = require('path');
const {spawnSync} = require('child_process');

const entry = process.env.POSTHTML_RENDER_PACKAGE || path.resolve(__dirname, '..');
const renderer = require(entry);
assert.deepEqual(Object.keys(renderer).sort(), [
  'closingSingleTagOptionEnum', 'closingSingleTagTypeEnum', 'quoteStyleEnum', 'render',
]);
assert.equal(renderer.render({tag: 'br'}), '<br>');
assert.equal(renderer.quoteStyleEnum.Smart, 0);
assert.equal(renderer.quoteStyleEnum.Single, 1);
assert.equal(renderer.quoteStyleEnum.Double, 2);
assert.equal(renderer.closingSingleTagOptionEnum.closeAs, 'closeAs');

const major = Number(process.versions.node.split('.')[0]);
const minor = Number(process.versions.node.split('.')[1]);
const flags = major === 12 && minor < 17 ? ['--experimental-modules'] : [];
const result = spawnSync(process.execPath, [...flags, path.join(__dirname, 'package.mjs')], {
  env: {...process.env, POSTHTML_RENDER_PACKAGE: entry},
  stdio: 'inherit',
});
if (result.error) throw result.error;
assert.equal(result.status, 0, 'Native ESM consumer failed');
console.log('CommonJS and native ESM consumers passed on ' + process.version);
