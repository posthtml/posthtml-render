const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const tree = require('./templates/parser.cjs');

module.exports = function suite(test, renderer, parser) {
  const {
    closingSingleTagOptionEnum,
    closingSingleTagTypeEnum,
    quoteStyleEnum,
    render,
  } = renderer;

  const html = fs.readFileSync(path.resolve(__dirname, 'templates/render.html'), 'utf8');

  test('{String}', () => {
    const html = render('Hello world!');
    const expected = 'Hello world!';
    assert.equal(html, expected);
  });

  test('{Number}', () => {
    const html = render(555);
    const expected = '555';
    assert.equal(html, expected);
  });

  test('{Array}', () => {
    const html = render(['Hello world!']);
    const expected = 'Hello world!';
    assert.equal(html, expected);
  });

  test('{Tags} {Empty}', () => {
    const html = render({content: ['Test']});
    const expected = '<div>Test</div>';
    assert.equal(html, expected);
  });

  test('{Tags} {Boolean} (false) -> {String}', () => {
    assert.equal(render({tag: false, content: 'Test'}), 'Test');
    assert.equal(render({tag: false, content: ['Test']}), 'Test');
  });

  test('{Tags} {Boolean} (false) -> {Number}', () => {
    assert.equal(render({tag: false, content: 555}), '555');
    assert.equal(render({tag: false, content: [555]}), '555');
  });

  test('{Attrs} {Empty}', () => {
    const fixture = {attrs: {alt: ''}};
    const expected = '<div alt=""></div>';

    assert.equal(render(fixture), expected);
  });

  test('{Attrs} {Single}', () => {
    const fixture = {
      attrs: {
        id: 'header',
      },
    };
    const expected = '<div id="header"></div>';

    assert.equal(render(fixture), expected);
  });

  test('{Attrs} {Multiple}', () => {
    const fixture = {
      attrs: {
        id: 'header',
        style: 'color:red',
        'data-id': 'header',
      },
    };
    const expected = '<div id="header" style="color:red" data-id="header"></div>';

    assert.equal(render(fixture), expected);
  });

  test('{Attrs} {Boolean} (true)', () => {
    const fixture = {
      attrs: {
        disabled: true,
      },
    };
    const expected = '<div disabled></div>';

    assert.equal(render(fixture), expected);
  });

  test('{Attrs} {Boolean} (false)', () => {
    const fixture = {
      attrs: {
        disabled: false,
      },
    };
    const expected = '<div></div>';

    assert.equal(render(fixture), expected);
  });

  test('{Attrs} {Number}', () => {
    const fixture = {
      attrs: {
        val: 5,
      },
    };
    const expected = '<div val="5"></div>';

    assert.equal(render(fixture), expected);
  });

  test('{Attrs} {String} (double quotes)', () => {
    const fixture = {
      attrs: {
        onclick: 'alert("hello world")',
      },
    };
    const expected = '<div onclick="alert(&quot;hello world&quot;)"></div>';

    assert.equal(render(fixture), expected);
  });

  test('{Attrs} {String} (json)', () => {
    const fixture = {
      attrs: {
        'x-data': JSON.stringify({a: 1}),
      },
    };

    const expected = '<div x-data=\'{"a":1}\'></div>';

    assert.equal(render(fixture), expected);
  });

  test('{Content} {String}', () => {
    const fixture = {content: 'Hello world!'};
    const expected = '<div>Hello world!</div>';

    assert.equal(render(fixture), expected);
  });

  test('{Content} {Array<String>}', () => {
    const fixture = {content: ['Hello world!']};
    const expected = '<div>Hello world!</div>';

    assert.equal(render(fixture), expected);
  });

  test('{Content} {Number}', () => {
    assert.equal(render({content: 555}), '<div>555</div>');
    assert.equal(render({content: [555]}), '<div>555</div>');
  });

  test('{Content} {Array<Number>}', () => {
    assert.equal(render({content: [555]}), '<div>555</div>');
  });

  test('{Content} {Array}', () => {
    const fixture = {
      content: [
        [
          555,
          {tag: 'div', content: 666},
          777,
        ],
      ],
    };
    const expected = '<div>555<div>666</div>777</div>';

    assert.equal(render(fixture), expected);
  });

  test('{Content} {Array<before empty array content>}', () => {
    const fixture = {
      content: [
        [],
        [
          {tag: 'style', content: 'body { color: red; }'},
        ],
      ],
    };
    const expected = '<div><style>body { color: red; }</style></div>';

    assert.equal(render(fixture), expected);
  });

  test('{Content} {Nested}', () => {
    const fixture = {
      content: [
        {
          content: [
            {
              content: ['Test', {}],
            },
          ],
        },
      ],
    };
    const expected = '<div><div><div>Test<div></div></div></div></div>';

    assert.equal(render(fixture), expected);
  });

  test('{Tree} {Empty}', () => {
    assert.equal(render(), '');
  });

  test('{Tree} {String Template}', () => {
    const html = `
    <div>String Template</div>
  `;
    const tree = parser(html);
    assert.equal(html, render(tree));
  });

  test('{Tree} {HTML}', () => {
    assert.equal(html, render(tree));
  });

  test('{Tree} {String input leaves original tree untouched}', () => {
    const tree = [{
      tag: 'div',
      content: [
        {
          tag: false,
          content: [
            {tag: 'div'},
            {tag: 'span', content: ['Text']},
          ],
        },
      ],
    }];

    const html1 = JSON.stringify(tree);

    render(html1);

    const html2 = JSON.stringify(tree);

    assert.equal(html1, html2);
  });

  test('{Tree} {With empty string}', () => {
    const tree = [
      '',
      '<!doctype html>',
      '',
      {
        tag: 'html',
        attrs: {
          lang: 'en',
        },
        content: [
          '',
          {
            tag: 'head',
            content: [
              '',
              {
                tag: 'meta',
                attrs: {
                  charset: 'utf-8',
                },
              },
              '',
            ],
          },
          '',
          {
            tag: 'body',
            content: [
              ' ',
            ],
          },
          '',
        ],
      },
      '',
    ];
    const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body> </body></html>';

    assert.equal(render(tree), html);
  });

  test('{Tree} {With tag false}', () => {
    const tree = [
      {
        tag: false,
        content: [],
      },
      {
        tag: 'script',
        content: ['window.foo1 = \'foo\';', 'window.foo2 = \'foo\''],
      },
      '\\n            ',
      {
        tag: 'script',
        attrs: {
          src: './script-need-foo-variable.js',
        },
      },
      '\\n            ',
      {
        tag: false,
        content: [],
      },
      {
        tag: 'script',
        content: ['window.bar1 = \'foo\';', 'window.bar2 = \'bar\''],
      },
    ];
    const html = '<script>window.foo1 = \'foo\';window.foo2 = \'foo\'</script>\\n            <script src="./script-need-foo-variable.js"></script>\\n            <script>window.bar1 = \'foo\';window.bar2 = \'bar\'</script>';

    assert.equal(render(tree), html);
  });

  test('{Tree} {With ?}', () => {
    const tree = [
      {
        tag: false,
        content: [
          {
            tag: false,
            content: [
              {
                tag: 'title',
                content: ['Title'],
              },
            ],
          },
          {
            tag: false,
            content: [
              {
                tag: 'p',
                content: ['Hi'],
              },
            ],
          },
        ],
      },
    ];
    const html = '<title>Title</title><p>Hi</p>';

    assert.equal(render(tree), html);
  });

  test('{Options} {singleTag} Defaults', () => {
    const SINGLE_TAGS_LOWERCASE = [
      'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr',
    ];

    const SINGLE_TAGS_UPPERCASE = [
      'IMG',
    ];

    const SINGLE_TAGS = SINGLE_TAGS_LOWERCASE.concat(SINGLE_TAGS_UPPERCASE);

    assert.equal(
      render(SINGLE_TAGS.map(tag => ({tag}))),
      SINGLE_TAGS.map(tag => `<${tag}>`).join(''),
    );
  });

  test('{Options} {singleTag} Custom {String}', () => {
    const options = {singleTags: ['rect']};

    const fixture = {tag: 'rect'};
    const expected = '<rect>';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {singleTag} Custom {RegExp}', () => {
    const options = {singleTags: [/^%.*%$/]};

    const fixture = {tag: '%=title%'};
    const expected = '<%=title%>';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {singleTag} Attrs', () => {
    const options = {singleTags: ['rect']};

    const fixture = {tag: 'rect', attrs: {id: 'id'}};
    const expected = '<rect id="id">';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {closingSingleTag} Tag', () => {
    const options = {closingSingleTag: closingSingleTagOptionEnum.tag};

    const fixture = {tag: 'br'};
    const expected = '<br></br>';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {closingSingleTag} Slash', () => {
    const options = {closingSingleTag: closingSingleTagOptionEnum.slash};

    const fixture = {tag: 'br'};
    const expected = '<br />';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {closingSingleTag} Slash with content', () => {
    const options = {closingSingleTag: closingSingleTagOptionEnum.slash};

    const fixture = {tag: 'br', content: ['test']};
    const expected = '<br />test';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {closingSingleTag} Default', () => {
    const fixture = {tag: 'br'};
    const expected = '<br>';

    assert.equal(render(fixture), expected);
  });

  test('{Options} {closingSingleTag} closeAs', () => {
    const options = {closingSingleTag: closingSingleTagOptionEnum.closeAs};
    const fixture = {
      content: [
        {
          content: [
            {
              content: ['Test', {}],
            },
          ],
        },
      ],
      closeAs: closingSingleTagTypeEnum.default,
    };
    const expected = '<div><div><div>Test<div></div></div></div>';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {closingSingleTag} closeAs on void tags', () => {
    const options = {closingSingleTag: closingSingleTagOptionEnum.closeAs};
    assert.equal(render({tag: 'br', closeAs: closingSingleTagTypeEnum.slash}, options), '<br />');
    assert.equal(render({tag: 'br', closeAs: closingSingleTagTypeEnum.tag}, options), '<br></br>');
    assert.equal(render({tag: 'br'}, options), '<br>');
  });

  test('{Options} {quoteAllAttributes} True', () => {
    const options = {quoteAllAttributes: true};

    const fixture = {tag: 'a', attrs: {href: '/about/me/'}};
    const expected = '<a href="/about/me/"></a>';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {quoteAllAttributes} False', () => {
    const options = {quoteAllAttributes: false};

    const fixture = {tag: 'a', attrs: {href: '/about/me/'}};
    const expected = '<a href=/about/me/></a>';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {quoteAllAttributes} Required Space', () => {
    const options = {quoteAllAttributes: false};

    const fixture = {tag: 'p', attrs: {id: 'asd adsasd'}};
    const expected = '<p id="asd adsasd"></p>';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {quoteAllAttributes} Required Tab', () => {
    const options = {quoteAllAttributes: false};

    const fixture = {tag: 'a', attrs: {href: '/about-\t-characters'}};
    const expected = '<a href="/about-\t-characters"></a>';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {quoteAllAttributes} Required Empty', () => {
    const options = {quoteAllAttributes: false};

    const fixture = {tag: 'script', attrs: {async: ''}};
    const expected = '<script async></script>';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {quoteAllAttributes} Closing slash', () => {
    const options = {
      closingSingleTag: closingSingleTagOptionEnum.slash,
      quoteAllAttributes: false,
    };

    // Note that <area href=foobar/> is incorrect as that is parsed as
    // <area href="foobar/">.

    const fixture = {tag: 'area', attrs: {href: 'foobar'}};
    const expected = '<area href=foobar />';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {replaceQuote} replace quote', () => {
    const options = {replaceQuote: false};

    const fixture = {tag: 'img', attrs: {src: '<?php echo $foo["bar"] ?>'}};
    const expected = '<img src="<?php echo $foo["bar"] ?>">';
    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {replaceQuote} replace quote ternary operator', () => {
    const options = {replaceQuote: false};

    const fixture = {tag: 'img', attrs: {src: '<?php echo isset($foo["bar"]) ? $foo["bar"] : ""; ?>'}};
    const expected = '<img src="<?php echo isset($foo["bar"]) ? $foo["bar"] : ""; ?>">';
    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {quoteStyle} 1 - single quote', () => {
    const options = {replaceQuote: false, quoteStyle: quoteStyleEnum.Single};

    const fixture = {tag: 'img', attrs: {src: 'https://example.com/example.png', onload: 'testFunc("test")'}};
    const expected = '<img src=\'https://example.com/example.png\' onload=\'testFunc("test")\'>';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {quoteStyle} 2 - double quote', () => {
    const options = {replaceQuote: false, quoteStyle: quoteStyleEnum.Double};

    const fixture = {tag: 'img', attrs: {src: 'https://example.com/example.png', onload: 'testFunc("test")'}};
    const expected = '<img src="https://example.com/example.png" onload="testFunc("test")">';

    assert.equal(render(fixture, options), expected);
  });

  test('{Options} {quoteStyle} 0 - smart quote', () => {
    const options = {replaceQuote: false, quoteStyle: quoteStyleEnum.Smart};

    const fixture = {tag: 'img', attrs: {src: 'https://example.com/example.png', onload: 'testFunc("test")'}};
    const expected = '<img src="https://example.com/example.png" onload=\'testFunc("test")\'>';

    assert.equal(render(fixture, options), expected);
  });

  test('{QuoteStyle} for width/height attrs in img', () => {
    const fixture = {
      tag: 'img',
      attrs: {
        src: 'https://example.com/example.png',
        width: '20',
        height: '20',
      },
    };
    const expected = '<img src="https://example.com/example.png" width="20" height="20">';

    assert.equal(render(fixture), expected);
  });
};
