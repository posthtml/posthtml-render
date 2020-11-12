const fs = require('fs');
const path = require('path');

const {it} = require('mocha');
const {expect} = require('chai');
const {describe} = require('mocha');

const render = require('../lib');

const tree = require('./templates/parser.js');
const html = fs.readFileSync(path.resolve(__dirname, 'templates/render.html'), 'utf8');

describe('PostHTML Render', () => {
  it('{String}', () => {
    expect(render('Hello world!')).to.eql('Hello world!');
  });

  it('{Number}', () => {
    expect(render(555)).to.eql('555');
  });

  it('{Array}', () => {
    expect(render(['Hello world!'])).to.eql('Hello world!');
  });

  describe('Tags', () => {
    it('Empty', () => {
      expect(render({content: ['Test']})).to.eql('<div>Test</div>');
    });

    it('{Boolean} (false) -> {String}', () => {
      expect(render({tag: false, content: 'Test'})).to.eql('Test');
      expect(render({tag: false, content: ['Test']})).to.eql('Test');
    });

    it('{Boolean} (false) -> {Number}', () => {
      expect(render({tag: false, content: 555})).to.eql('555');
      expect(render({tag: false, content: [555]})).to.eql('555');
    });
  });

  describe('Attrs', () => {
    it('Empty', () => {
      const fixture = {attrs: {alt: ''}};
      const expected = '<div alt=""></div>';

      expect(render(fixture)).to.eql(expected);
    });

    it('Single', () => {
      const fixture = {
        attrs: {
          id: 'header'
        }
      };
      const expected = '<div id="header"></div>';

      expect(render(fixture)).to.eql(expected);
    });

    it('Multiple', () => {
      const fixture = {
        attrs: {
          id: 'header',
          style: 'color:red',
          'data-id': 'header'
        }
      };
      const expected = '<div id="header" style="color:red" data-id="header"></div>';

      expect(render(fixture)).to.eql(expected);
    });

    it('{Boolean} (true)', () => {
      const fixture = {
        attrs: {
          disabled: true
        }
      };
      const expected = '<div disabled></div>';

      expect(render(fixture)).to.eql(expected);
    });

    it('{Boolean} (false)', () => {
      const fixture = {
        attrs: {
          disabled: false
        }
      };
      const expected = '<div></div>';

      expect(render(fixture)).to.eql(expected);
    });

    it('{Number}', () => {
      const fixture = {
        attrs: {
          val: 5
        }
      };
      const expected = '<div val="5"></div>';

      expect(render(fixture)).to.eql(expected);
    });

    it('{String} (double quotes)', () => {
      const fixture = {
        attrs: {
          onclick: 'alert("hello world")'
        }
      };
      const expected = '<div onclick="alert(&quot;hello world&quot;)"></div>';

      expect(render(fixture)).to.eql(expected);
    });
  });

  describe('Content', () => {
    it('{String}', () => {
      const fixture = {content: 'Hello world!'};
      const expected = '<div>Hello world!</div>';

      expect(render(fixture)).to.eql(expected);
    });

    it('{Array<String>}', () => {
      const fixture = {content: ['Hello world!']};
      const expected = '<div>Hello world!</div>';

      expect(render(fixture)).to.eql(expected);
    });

    it('{Number}', () => {
      expect(render({content: 555})).to.eql('<div>555</div>');
      expect(render({content: [555]})).to.eql('<div>555</div>');
    });

    it('{Array<Number>}', () => {
      expect(render({content: [555]})).to.eql('<div>555</div>');
    });

    it('{Array}', () => {
      const fixture = {
        content: [
          [
            555,
            {tag: 'div', content: 666},
            777
          ]
        ]
      };
      const expected = '<div>555<div>666</div>777</div>';

      expect(render(fixture)).to.eql(expected);
    });

    it('Nested', () => {
      const fixture = {
        content: [
          {
            content: [
              {
                content: ['Test', {}]
              }
            ]
          }
        ]
      };
      const expected = '<div><div><div>Test<div></div></div></div></div>';

      expect(render(fixture)).to.eql(expected);
    });
  });

  describe('Tree', () => {
    it('Empty', () => {
      expect(render()).to.eql('');
    });

    it('HTML', () => {
      expect(html).to.eql(render(tree));
    });

    it('Immutable', () => {
      const t = [{
        tag: 'div',
        content: [
          {
            tag: false,
            content: [
              {tag: 'div'},
              {tag: 'span', content: ['Text']}
            ]
          }
        ]
      }];

      const t1 = JSON.stringify(t);

      render(t);

      const t2 = JSON.stringify(t);

      expect(t1).to.eql(t2);
    });
  });

  describe('Options', () => {
    describe('singleTag', () => {
      it('Defaults', () => {
        const SINGLE_TAGS = [
          'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'
        ];

        expect(render(
          SINGLE_TAGS.map(tag => {
            return {tag};
          }
          ))).to.eql(
          SINGLE_TAGS.map(tag => {
            return '<' + tag + '>';
          }
          ).join(''));
      });

      it('Custom {String}', () => {
        const options = {singleTags: ['rect']};

        const fixture = {tag: 'rect'};
        const expected = '<rect>';

        expect(render(fixture, options)).to.eql(expected);
      });

      it('Custom {RegExp}', () => {
        const options = {singleTags: [/^%.*%$/]};

        const fixture = {tag: '%=title%'};
        const expected = '<%=title%>';

        expect(render(fixture, options)).to.eql(expected);
      });

      it('Attrs', () => {
        const options = {singleTags: ['rect']};

        const fixture = {tag: 'rect', attrs: {id: 'id'}};
        const expected = '<rect id="id">';

        expect(render(fixture, options)).to.eql(expected);
      });
    });

    describe('closingSingleTag', () => {
      it('Tag', () => {
        const options = {closingSingleTag: 'tag'};

        const fixture = {tag: 'br'};
        const expected = '<br></br>';

        expect(render(fixture, options)).to.eql(expected);
      });

      it('Slash', () => {
        const options = {closingSingleTag: 'slash'};

        const fixture = {tag: 'br'};
        const expected = '<br />';

        expect(render(fixture, options)).to.eql(expected);
      });

      it('Slash with content', () => {
        const options = {closingSingleTag: 'slash'};

        const fixture = {tag: 'br', content: ['test']};
        const expected = '<br />test';

        expect(render(fixture, options)).to.eql(expected);
      });

      it('Default', () => {
        const options = {closingSingleTag: 'default'};

        const fixture = {tag: 'br'};
        const expected = '<br>';

        expect(render(fixture, options)).to.eql(expected);
      });
    });

    describe('quoteAllAttributes', () => {
      it('True', () => {
        const options = {quoteAllAttributes: true};

        const fixture = {tag: 'a', attrs: {href: '/about/me/'}};
        const expected = '<a href="/about/me/"></a>';

        expect(render(fixture, options)).to.eql(expected);
      });

      it('False', () => {
        const options = {quoteAllAttributes: false};

        const fixture = {tag: 'a', attrs: {href: '/about/me/'}};
        const expected = '<a href=/about/me/></a>';

        expect(render(fixture, options)).to.eql(expected);
      });

      it('Required Space', () => {
        const options = {quoteAllAttributes: false};

        const fixture = {tag: 'p', attrs: {id: 'asd adsasd'}};
        const expected = '<p id="asd adsasd"></p>';

        expect(render(fixture, options)).to.eql(expected);
      });

      it('Required Tab', () => {
        const options = {quoteAllAttributes: false};

        const fixture = {tag: 'a', attrs: {href: '/about-\t-characters'}};
        const expected = '<a href="/about-\t-characters"></a>';

        expect(render(fixture, options)).to.eql(expected);
      });

      it('Required Empty', () => {
        const options = {quoteAllAttributes: false};

        const fixture = {tag: 'script', attrs: {async: ''}};
        const expected = '<script async></script>';

        expect(render(fixture, options)).to.eql(expected);
      });

      it('Closing slash', () => {
        const options = {
          closingSingleTag: 'slash',
          quoteAllAttributes: false
        };

        // Note that <area href=foobar/> is incorrect as that is parsed as
        // <area href="foobar/">.

        const fixture = {tag: 'area', attrs: {href: 'foobar'}};
        const expected = '<area href=foobar />';

        expect(render(fixture, options)).to.eql(expected);
      });
    });

    describe('replaceQuote', () => {
      it('replace quote', () => {
        const options = {replaceQuote: false};

        const fixture = {tag: 'img', attrs: {src: '<?php echo $foo["bar"] ?>'}};
        const expected = '<img src="<?php echo $foo["bar"] ?>">';
        fs.writeFileSync('test.html', render(fixture, options));
        expect(render(fixture, options)).to.eql(expected);
      });

      it('replace quote ternary operator', () => {
        const options = {replaceQuote: false};

        const fixture = {tag: 'img', attrs: {src: '<?php echo isset($foo["bar"]) ? $foo["bar"] : ""; ?>'}};
        const expected = '<img src="<?php echo isset($foo["bar"]) ? $foo["bar"] : ""; ?>">';
        fs.writeFileSync('test.html', render(fixture, options));
        expect(render(fixture, options)).to.eql(expected);
      });
    });
  });
});
