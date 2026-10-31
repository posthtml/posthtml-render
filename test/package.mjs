import assert from 'assert';
import path from 'path';
import url from 'url';

const entry = path.join(process.env.POSTHTML_RENDER_PACKAGE, 'dist/index.js');
import(url.pathToFileURL(entry).href).then(namespace => {
  const {render, quoteStyleEnum} = namespace.default;
  assert.strictEqual(render({tag: 'p', content: ['hello']}), '<p>hello</p>');
  assert.strictEqual(quoteStyleEnum.Double, 2);
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major > 14 || (major === 14 && minor >= 13)) {
    assert.strictEqual(namespace.render, render);
    assert.strictEqual(namespace.quoteStyleEnum, quoteStyleEnum);
  }
}).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
