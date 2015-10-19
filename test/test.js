var render = require('../lib/posthtml-render.js');
var describe = require('mocha').describe;
var it = require('mocha').it;
var expect = require('chai').expect;

describe('PostHTML-Render test', function() {

    it('string', function() {
        expect(render('Hello world!')).to.eql('Hello world!');
    });

    it('string node', function() {
        expect(render(['Hello world!'])).to.eql('Hello world!');
    });

    it('empty', function() {
        expect(render()).to.eql('');
    });

    it('tag false', function() {
        expect(render({ tag: false, content: ['Test'] })).to.eql('Test');
    });

    it('tag empty', function() {
        expect(render({ content: ['Test'] })).to.eql('<div>Test</div>');
    });

    it('content test', function() {
        expect(render({ content: [{ content: [{ content: ['Test', {}] }] }] }))
                .to.eql('<div><div><div>Test<div></div></div></div></div>');
    });

    describe('attrs', function() {
        it('key', function() {
            expect(render({ attrs: { id: 'header' } })).to.eql('<div id="header"></div>');
        });

        it('multi attrs', function() {
            expect(render({ attrs: { id: 'header', style: 'color:red;', 'data-id': 'header' } }))
                .to.eql('<div id="header" style="color:red;" data-id="header"></div>');
        });

        it('boolean', function() {
            expect(render({ attrs: { disabled: true } })).to.eql('<div disabled></div>');
        });
    });

    describe('options', function() {
        describe('singleTag', function() {
            it('default', function() {
                expect(render({ tag: 'img' })).to.eql('<img>');
            });
            it('set in options', function() {
                expect(render({ tag: 'rect' }, { singleTags: ['rect'] })).to.eql('<rect>');
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
