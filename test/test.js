var render = require('..');
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
        expect(render({ content: [{ content: [{ content: ['Test', {}] }] }] })).to.eql('<div><div><div>Test<div></div></div></div></div>');
    });

});
