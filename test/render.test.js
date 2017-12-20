var fs = require('fs')
var path = require('path')

var it = require('mocha').it
var expect = require('chai').expect
var describe = require('mocha').describe

var render = require('../lib')

var tree = require('./templates/parser.js')
var html = fs.readFileSync(path.resolve(__dirname, 'templates/render.html'), 'utf8')

describe('PostHTML Render', function () {
  it('{String}', function () {
    expect(render('Hello world!')).to.eql('Hello world!')
  })

  it('{Number}', function () {
    expect(render(555)).to.eql('555')
  })

  it('{Array}', function () {
    expect(render([ 'Hello world!' ])).to.eql('Hello world!')
  })

  describe('Tags', function () {
    it('Empty', function () {
      expect(render({ content: [ 'Test' ] })).to.eql('<div>Test</div>')
    })

    it('{Boolean} (false) -> {String}', function () {
      expect(render({ tag: false, content: 'Test' })).to.eql('Test')
      expect(render({ tag: false, content: [ 'Test' ] })).to.eql('Test')
    })

    it('{Boolean} (false) -> {Number}', function () {
      expect(render({ tag: false, content: 555 })).to.eql('555')
      expect(render({ tag: false, content: [ 555 ] })).to.eql('555')
    })
  })

  describe('Attrs', function () {
    it('Empty', function () {
      var fixture = { attrs: { alt: '' } }
      var expected = '<div alt=""></div>'

      expect(render(fixture)).to.eql(expected)
    })

    it('Single', function () {
      var fixture = {
        attrs: {
          id: 'header'
        }
      }
      var expected = '<div id="header"></div>'

      expect(render(fixture)).to.eql(expected)
    })

    it('Multiple', function () {
      var fixture = {
        attrs: {
          id: 'header',
          style: 'color:red',
          'data-id': 'header'
        }
      }
      var expected = '<div id="header" style="color:red" data-id="header"></div>'

      expect(render(fixture)).to.eql(expected)
    })

    it('{Boolean} (true)', function () {
      var fixture = {
        attrs: {
          disabled: true
        }
      }
      var expected = '<div disabled></div>'

      expect(render(fixture)).to.eql(expected)
    })

    it('{Boolean} (false)', function () {
      var fixture = {
        attrs: {
          disabled: false
        }
      }
      var expected = '<div></div>'

      expect(render(fixture)).to.eql(expected)
    })

    it('{Number}', function () {
      var fixture = {
        attrs: {
          val: 5
        }
      }
      var expected = '<div val="5"></div>'

      expect(render(fixture)).to.eql(expected)
    })
  })

  describe('Content', function () {
    it('{String}', function () {
      var fixture = { content: 'Hello world!' }
      var expected = '<div>Hello world!</div>'

      expect(render(fixture)).to.eql(expected)
    })

    it('{Array<String>}', function () {
      var fixture = { content: [ 'Hello world!' ] }
      var expected = '<div>Hello world!</div>'

      expect(render(fixture)).to.eql(expected)
    })

    it('{Number}', function () {
      expect(render({ content: 555 })).to.eql('<div>555</div>')
      expect(render({ content: [ 555 ] })).to.eql('<div>555</div>')
    })

    it('{Array<Number>}', function () {
      expect(render({ content: [ 555 ] })).to.eql('<div>555</div>')
    })

    it('{Array}', function () {
      var fixture = {
        content: [
          [
            555,
            { tag: 'div', content: 666 },
            777
          ]
        ]
      }
      var expected = '<div>555<div>666</div>777</div>'

      expect(render(fixture)).to.eql(expected)
    })

    it('Nested', function () {
      var fixture = {
        content: [
          {
            content: [
              {
                content: [ 'Test', {} ]
              }
            ]
          }
        ]
      }
      var expected = '<div><div><div>Test<div></div></div></div></div>'

      expect(render(fixture)).to.eql(expected)
    })
  })

  describe('Tree', function () {
    it('Empty', function () {
      expect(render()).to.eql('')
    })

    it('HTML', function () {
      expect(html).to.eql(render(tree))
    })

    it('Immutable', function () {
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
      }]

      var t1 = JSON.stringify(t)

      render(t)

      var t2 = JSON.stringify(t)

      expect(t1).to.eql(t2)
    })
  })

  describe('Options', function () {
    describe('singleTag', function () {
      it('Defaults', function () {
        var SINGLE_TAGS = [
          'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'
        ]

        expect(render(
          SINGLE_TAGS.map(function (tag) {
            return { tag: tag }
          }
        ))).to.eql(
          SINGLE_TAGS.map(function (tag) {
            return '<' + tag + '>'
          }
        ).join(''))
      })

      it('Custom {String}', function () {
        var options = { singleTags: [ 'rect' ] }

        var fixture = { tag: 'rect' }
        var expected = '<rect>'

        expect(render(fixture, options)).to.eql(expected)
      })

      it('Custom {RegExp}', function() {
        var options = { singleTags: [ /^%.*%$/ ] }

        var fixture = { tag: '%=title%' }
        var expected = '<%=title%>'

        expect(render(fixture, options)).to.eql(expected)
      });

      it('Attrs', function () {
        var options = { singleTags: [ 'rect' ] }

        var fixture = { tag: 'rect', attrs: { id: 'id' } }
        var expected = '<rect id="id">'

        expect(render(fixture, options)).to.eql(expected)
      })
    })

    describe('closingSingleTag', function () {
      it('Tag', function () {
        var options = { closingSingleTag: 'tag' }

        var fixture = { tag: 'br' }
        var expected = '<br></br>'

        expect(render(fixture, options)).to.eql(expected)
      })

      it('Slash', function () {
        var options = { closingSingleTag: 'slash' }

        var fixture = { tag: 'br' }
        var expected = '<br />'

        expect(render(fixture, options)).to.eql(expected)
      })

      it('Default', function () {
        var options = { closingSingleTag: 'default' }

        var fixture = { tag: 'br' }
        var expected = '<br>'

        expect(render(fixture, options)).to.eql(expected)
      })
    })
  })
})
