import {
  render, Node, Options, quoteStyleEnum,
  closingSingleTagOptionEnum, closingSingleTagTypeEnum,
} from '../..';

const tree: Node[] = [
  '<!doctype html>',
  {tag: 'div', attrs: {hidden: true, count: 3}, content: ['text', [{tag: 'br'}]]},
  {tag: false, content: [42], location: {start: {line: 1, column: 1}, end: {line: 1, column: 2}}},
  {tag: 'custom', closeAs: closingSingleTagTypeEnum.slash},
];
const options: Options = {
  singleTags: ['custom', /^svg:/],
  closingSingleTag: closingSingleTagOptionEnum.closeAs,
  quoteStyle: quoteStyleEnum.Smart,
  quoteAllAttributes: false,
  replaceQuote: false,
};
const html: string = render(tree, options);
render();
render(42);
render(html);

// @ts-expect-error -- Only declared quote styles are supported.
render(tree, {quoteStyle: 'double'});
// @ts-expect-error -- HTML attribute values are scalar.
render({tag: 'div', attrs: {invalid: {nested: true}}});
