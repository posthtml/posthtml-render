const assert = require('assert').strict;
const suite = require('./suite.cjs');

let count = 0;
// The original suite is synchronous; execute it on runtimes predating node:test.
suite((name, run) => {
  try {
    assert.equal(run(), undefined, 'Packed tests must remain synchronous');
    count++;
  } catch (error) {
    console.error('Failed: ' + name);
    throw error;
  }
}, require(process.env.POSTHTML_RENDER_PACKAGE), require('posthtml-parser').default);
assert.ok(count >= 49, 'Expected the complete renderer suite');
console.log(count + ' packed renderer tests passed on ' + process.version);
require('./package.cjs');
