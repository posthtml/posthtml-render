// @ts-expect-error
import isJSON from 'is-json';
import {Attributes, NodeText, NodeTag} from 'posthtml-parser';

export enum quoteStyleEnum {
  Smart,
  Single,
  Double
}

export enum closingSingleTagOptionEnum {
  tag = 'tag',
  slash = 'slash',
  default = 'default',
  closeAs = 'closeAs'
}

export enum closingSingleTagTypeEnum {
  tag = 'tag',
  slash = 'slash',
  default = 'default'
}

export type Node = NodeText | NodeTag & {
  closeAs?: closingSingleTagTypeEnum;
};

export type Options = {
  /**
   * Custom single tags (selfClosing).
   *
   * @default []
   */
  singleTags?: Array<string | RegExp>;

  /**
   * Closing format for single tag.
   *
   * Formats:
   *
   * tag: `<br></br>`, slash: `<br />`, default: `<br>`
   *
   */
  closingSingleTag?: closingSingleTagOptionEnum;

  /**
   * If all attributes should be quoted.
   * Otherwise attributes will be unquoted when allowed.
   *
   * @default true
   */
  quoteAllAttributes?: boolean;

  /**
   * Replaces quotes in attribute values with `&quote;`.
   *
   * @default true
   */
  replaceQuote?: boolean;

  /**
   * Quote style
   *
   * 0 - Smart quotes
   *   <img src="https://example.com/example.png" onload='testFunc("test")'>
   * 1 - Single quotes
   *   <img src='https://example.com/example.png' onload='testFunc("test")'>
   * 2 - double quotes
   *   <img src="https://example.com/example.png" onload="testFunc("test")">
   *
   * @default 2
   */
  quoteStyle?: quoteStyleEnum;
};

const SINGLE_TAGS: Array<string | RegExp> = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

const ATTRIBUTE_QUOTES_REQUIRED = /[\t\n\f\r "'`=<>]/;

const defaultOptions = {
  closingSingleTag: undefined,
  quoteAllAttributes: true,
  replaceQuote: true,
  quoteStyle: quoteStyleEnum.Double
};

export function render(tree?: Node | Node[], options: Options = {}): string {
  let st = SINGLE_TAGS;

  if (options.singleTags) {
    st = [...new Set([...SINGLE_TAGS, ...options.singleTags])];
  }

  options = {
    ...defaultOptions,
    ...options,
    singleTags: st
  };

  const {
    singleTags,
    closingSingleTag,
    quoteAllAttributes,
    replaceQuote,
    quoteStyle
  } = options;

  const singleRegExp: RegExp[] = singleTags
    ?.filter((tag): tag is RegExp => tag instanceof RegExp) ??
    [];

  if (!Array.isArray(tree)) {
    if (!tree) {
      tree = '';
    }

    tree = [tree];
  }

  return html(tree);

  function html(tree: Node[] | Node[][]) {
    let result = '';

    for (const node of tree) {
      // Undefined, null, '', [], NaN
      if (
        node === false ||
        node === undefined ||
        node === null ||
        (typeof node === 'string' && node.length === 0) ||
        Number.isNaN(node)
      ) {
        continue;
      }

      // Treat as new root tree if node is an array
      if (Array.isArray(node)) {
        if (node.length === 0) {
          continue;
        }

        result += html(node);

        continue;
      }

      if (typeof node === 'string' || typeof node === 'number') {
        result += node;

        continue;
      }

      if (!Array.isArray(node.content)) {
        if (!node.content) {
          node.content = '';
        }

        node.content = [node.content];
      }

      if (node.tag === false) {
        result += html(node.content);

        continue;
      }

      const tag = typeof node.tag === 'string' ? node.tag : 'div';

      result += `<${tag}`;

      if (node.attrs) {
        result += attrs(node.attrs);
      }

      const closeAs = {
        [closingSingleTagTypeEnum.tag]: `></${tag}>`,
        [closingSingleTagTypeEnum.slash]: ' />',
        [closingSingleTagTypeEnum.default]: '>'
      };

      if (isSingleTag(tag)) {
        switch (closingSingleTag) {
          case closingSingleTagOptionEnum.tag:
            result += closeAs[closingSingleTagTypeEnum.tag];

            break;
          case closingSingleTagOptionEnum.slash:
            result += closeAs[closingSingleTagTypeEnum.slash];

            break;
          case closingSingleTagOptionEnum.closeAs:
            result += closeAs[node.closeAs ?
              closingSingleTagTypeEnum[node.closeAs] :
              closingSingleTagTypeEnum.default];

            break;
          default:
            result += closeAs[closingSingleTagTypeEnum.default];
        }

        if (node.content) {
          result += html(node.content);
        }
      } else if (closingSingleTag === closingSingleTagOptionEnum.closeAs && node.closeAs) {
        const type = node.closeAs ?
          closingSingleTagTypeEnum[node.closeAs] :
          closingSingleTagTypeEnum.default;
        result += `${closeAs[type]}${html(node.content)}`;
      } else {
        result += `>${html(node.content)}</${tag}>`;
      }
    }

    return result;
  }

  function isSingleTag(tag: string) {
    if (singleRegExp.length > 0) {
      return singleRegExp.some(reg => reg.test(tag));
    }

    if (!singleTags?.includes(tag.toLowerCase())) {
      return false;
    }

    return true;
  }

  function attrs(object: Attributes) {
    let attr = '';

    for (const [key, value] of Object.entries(object)) {
      if (typeof value === 'string') {
        if (isJSON(value)) {
          attr += makeAttr(key, value);
        } else if (quoteAllAttributes || ATTRIBUTE_QUOTES_REQUIRED.test(value)) {
          let attrValue = value;

          if (replaceQuote) {
            attrValue = value.replace(/"/g, '&quot;');
          }

          attr += makeAttr(key, attrValue, quoteStyle);
        } else if (value === '') {
          attr += ` ${key}`;
        } else {
          attr += ` ${key}=${value}`;
        }
      } else if (value === true) {
        attr += ` ${key}`;
      } else if (typeof value === 'number') {
        attr += makeAttr(key, value, quoteStyle);
      }
    }

    return attr;
  }

  function makeAttr(key: string, attrValue: string | number | boolean, quoteStyle = 1): string {
    if (quoteStyle === 1) {
      // Single Quote
      return ` ${key}='${attrValue}'`;
    }

    if (quoteStyle === 2) {
      // Double Quote
      return ` ${key}="${attrValue}"`;
    }

    // Smart Quote
    if (typeof attrValue === 'string' && attrValue.includes('"')) {
      return ` ${key}='${attrValue}'`;
    }

    return ` ${key}="${attrValue}"`;
  }
}
