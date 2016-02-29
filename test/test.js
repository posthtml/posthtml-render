var render = require('../lib/posthtml-render.js');
var describe = require('mocha').describe;
var it = require('mocha').it;
var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var html = fs.readFileSync(path.resolve(__dirname, 'templates/render.html'), 'utf8').toString();
var tree = require('./templates/parser.js');

describe('PostHTML-Render test', function() {

    it('tree to html', function() {
        expect(html).to.eql(render(tree));
    });

    it('string', function() {
        expect(render('Hello world!')).to.eql('Hello world!');
    });

    it('string in content', function() {
        expect(render({ content: 'Hello world!' })).to.eql('<div>Hello world!</div>');
        expect(render({ content: ['Hello world!'] })).to.eql('<div>Hello world!</div>');
    });

    it('number', function() {
        expect(render(555)).to.eql('555');
    });

    it('number in content', function() {
        expect(render({ content: 555 })).to.eql('<div>555</div>');
        expect(render({ content: [555] })).to.eql('<div>555</div>');
    });

    it('node array in content', function() {
      expect(render({ content: [
        [
          555,
          { tag: 'div', content: 666 },
          777
        ]
      ]})).to.eql('<div>555<div>666</div>777</div>');
    });

    it('string node', function() {
        expect(render(['Hello world!'])).to.eql('Hello world!');
    });

    it('empty', function() {
        expect(render()).to.eql('');
    });

    it('tag false return string', function() {
        expect(render({ tag: false, content: 'Test' })).to.eql('Test');
        expect(render({ tag: false, content: ['Test'] })).to.eql('Test');
    });

    it('tag false return number', function() {
        expect(render({ tag: false, content: 555 })).to.eql('555');
        expect(render({ tag: false, content: [555] })).to.eql('555');
    });

    it('tag empty', function() {
        expect(render({ content: ['Test'] })).to.eql('<div>Test</div>');
    });

    it('content test', function() {
        expect(render({ content: [{ content: [{ content: ['Test', {}] }] }] }))
            .to.eql('<div><div><div>Test<div></div></div></div></div>');
    });

    it('tree immutable', function() {
        var t = [{
            tag: 'div',
            content: [
                {
                    tag: false,
                    content: [
                        { tag: 'div' },
                        { tag: 'span', content: ['Text'] }
                    ]
                }
            ]
        }];
        var t1 = JSON.stringify(t);
        render(t);
        var t2 = JSON.stringify(t);
        expect(t1).to.eql(t2);
    });

    describe('attrs', function() {
        it('key', function() {
            expect(render({ attrs: { id: 'header' } }))
                .to.eql('<div id="header"></div>');
        });

        it('empty key', function() {
            expect(render({ attrs: { alt: '' } }))
                .to.eql('<div alt=""></div>');
        });

        it('multi attrs', function() {
            expect(render({ attrs: { id: 'header', style: 'color:red;', 'data-id': 'header' } }))
                .to.eql('<div id="header" style="color:red;" data-id="header"></div>');
        });

        it('true', function() {
            expect(render({ attrs: { disabled: true } }))
                .to.eql('<div disabled></div>');
        });

        it('false', function() {
            expect(render({ attrs: { disabled: false } }))
                .to.eql('<div></div>');
        });

        it('number attrs', function() {
            expect(render({ attrs: { val: 5 } })).to.eql('<div val="5"></div>');
        });
    });

    describe('options', function() {
        describe('singleTag', function() {
            it('default', function() {

                var SINGLE_TAGS = [
                    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen',
                    'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'
                ];

                expect(render(SINGLE_TAGS.map(function(tag) {
                    return { tag: tag };
                }))).to.eql(SINGLE_TAGS.map(function(tag) {
                    return '<' + tag + '>';
                }).join(''));
            });

            it('set in options', function() {
                expect(render({ tag: 'rect' }, { singleTags: ['rect'] })).to.eql('<rect>');
            });

            it('safe attrs', function() {
                expect(render({ tag: 'rect', attrs: { id: 'id' } }, { singleTags: ['rect'] })).to.eql('<rect id="id">');
            });
        });

        describe('closingSingleTag', function() {
            it('default', function() {
                expect(render({ tag: 'br' }, { closingSingleTag: 'default' })).to.eql('<br>');
            });

            it('slash', function() {
                expect(render({ tag: 'br' }, { closingSingleTag: 'slash' })).to.eql('<br />');
            });

            it('tag', function() {
                expect(render({ tag: 'br' }, { closingSingleTag: 'tag' })).to.eql('<br></br>');
            });
        });
    });

});
