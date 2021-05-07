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

export enum quoteStyleEnum {
  Smart,
  Single,
  Double
}

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
