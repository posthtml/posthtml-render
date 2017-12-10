export as namespace postHTMLRender;

export = postHTMLRender;

interface Options {
  singleTags: string[],
  closingSingleTag: string
}

declare function postHTMLRender(tree: any, options?: Options): string;

