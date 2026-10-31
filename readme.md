# PostHTML Render

Serialize a [PostHTML](https://github.com/posthtml/posthtml) tree to HTML/XML.

Requires Node.js 12 or newer. TypeScript declarations are included and checked
with TypeScript 4.3 and the current compiler.

## Install

```sh
npm install posthtml-render
```

## Usage

### CommonJS

```js
const {render} = require('posthtml-render');

const tree = [{
  tag: 'ul',
  attrs: {class: 'list'},
  content: ['one', 'two', 'three'].map(content => ({tag: 'li', content})),
}];

const html = render(tree);
// <ul class="list"><li>one</li><li>two</li><li>three</li></ul>
```

### ES modules

```js
import renderer from 'posthtml-render';

const {render} = renderer;
const html = render({tag: 'p', content: ['Hello!']});
// <p>Hello!</p>
```

Native named imports, such as `import {render} from 'posthtml-render'`, are also
available on Node.js 14.13 and newer. Node.js versions before 12.17 require
`--experimental-modules` for native ES modules.

### TypeScript

```ts
import {render, quoteStyleEnum} from 'posthtml-render';
import type {Node, Options} from 'posthtml-render';

const tree: Node[] = [{tag: 'p', content: ['Hello!']}];
const options: Options = {quoteStyle: quoteStyleEnum.Double};
const html: string = render(tree, options);
```

The declarations are self-contained; a standalone renderer consumer does not
need to install the parser or its types.

## Tree

`render(tree, options?)` accepts a string, number, node object or array and returns
a string. An omitted tree renders as an empty string.

Nodes support `tag`, `attrs` and `content`. A missing tag defaults to `div`;
`tag: false` unwraps the content. Content can contain text, numbers, nodes and
nested arrays. Raw text, comments and directives are preserved without escaping.
Boolean `true` attributes render without a value; `false` attributes are omitted.

Rendering normalizes scalar node content into arrays in place.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `singleTags` | `[]` | Custom single-tag names or regular expressions. |
| `closingSingleTag` | `'default'` | `'default'`, `'tag'`, `'slash'` or `'closeAs'`. |
| `quoteAllAttributes` | `true` | Quote attribute values even when quotes are optional. |
| `replaceQuote` | `true` | Replace double quotes in non-JSON string values with `&quot;`. |
| `quoteStyle` | `2` | `0` for smart quotes, `1` for single quotes, `2` for double quotes. |

### Single tags

String names extend the built-in HTML void-tag list. Names are compared against
the lowercased tag name, while the original case is preserved in the output.

```js
render({tag: 'custom'}, {singleTags: ['custom']}); // <custom>
render({tag: 'img'}, {closingSingleTag: 'tag'}); // <img></img>
render({tag: 'img'}, {closingSingleTag: 'slash'}); // <img />
render({tag: 'img'}); // <img>
```

When `singleTags` contains regular expressions, single-tag detection uses those
expressions against the original tag name:

```js
render({tag: '%=title%'}, {singleTags: [/^%.*%$/]}); // <%=title%>
```

With `closingSingleTag: 'closeAs'`, each node's `closeAs` field selects `'tag'`,
`'slash'` or `'default'`. For TypeScript, use the exported
`closingSingleTagOptionEnum` and `closingSingleTagTypeEnum` values.

```js
render({tag: 'custom', closeAs: 'slash'}, {closingSingleTag: 'closeAs'});
// <custom />
```

### Attribute quotes

```js
const tree = {tag: 'a', attrs: {href: '/about/'}};
render(tree); // <a href="/about/"></a>
render(tree, {quoteAllAttributes: false}); // <a href=/about/></a>
```

Values containing spaces or other characters that require quotes stay quoted.
JSON object/array strings recognized by `is-json` use single quotes independently
of `quoteStyle`.

`replaceQuote` runs before the quote style is selected. Set it to `false` to keep
embedded double quotes when using single or smart quotes:

```js
const tree = {tag: 'img', attrs: {onload: 'testFunc("test")'}};
render(tree); // <img onload="testFunc(&quot;test&quot;)">
render(tree, {replaceQuote: false, quoteStyle: 1});
// <img onload='testFunc("test")'>
render(tree, {replaceQuote: false, quoteStyle: 0});
// <img onload='testFunc("test")'>
```

## Development

See [Contributing](.github/CONTRIBUTING.md) for development commands, compatibility
checks and the release workflow.
