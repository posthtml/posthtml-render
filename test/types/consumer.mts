import {render, quoteStyleEnum} from '../../dist/index.js';
import type {Node, Options} from '../../dist/index.js';

const tree: Node = {tag: 'p', content: ['hello', [{tag: 'br'}]]};
const options: Options = {quoteStyle: quoteStyleEnum.Double};
const html: string = render(tree, options);
render(html);
