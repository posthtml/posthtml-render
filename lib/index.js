var SINGLE_TAGS = [
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
  'wbr',
  // Custom (PostHTML)
  'import',
  'include',
  'extend'
]

/**
 * Render PostHTML Tree to HTML
 *
 * @param  {Array|Object} tree PostHTML Tree
 * @param  {Object} options Options
 *
 * @return {String} HTML
 */
function render (tree, options) {
  /**
   * Options
   *
   * @type {Object}
   *
   * @prop {Array<String|RegExp>} singleTags  Custom single tags (selfClosing)
   * @prop {String} closingSingleTag Closing format for single tag
   *
   * Formats:
   *
   * ``` tag: `<br></br>` ```, slash: `<br />` ```, ```default: `<br>` ```
   */
  options = options || {}

  var singleTags = options.singleTags ? SINGLE_TAGS.concat(options.singleTags) : SINGLE_TAGS
  var singleRegExp = singleTags.filter(function (tag) {
    return tag instanceof RegExp
  })

  var closingSingleTag = options.closingSingleTag

  return html(tree)

  /** @private */
  function isSingleTag (tag) {
    if (singleRegExp.length !== 0) {
      for (var i = 0; i < singleRegExp.length; i++) {
        return singleRegExp[i].test(tag)
      }
    }

    if (singleTags.indexOf(tag) === -1) {
      return false
    }

    return true
  }

  /** @private */
  function attrs (obj) {
    var attr = ''

    for (var key in obj) {
      if (typeof obj[key] === 'string') {
        attr += ' ' + key + '="' + obj[key].replace(/"/g, '&quot;') + '"'
      } else if (obj[key] === true) {
        attr += ' ' + key
      } else if (typeof obj[key] === 'number') {
        attr += ' ' + key + '="' + obj[key] + '"'
      }
    }

    return attr
  }

  /** @private */
  function traverse (tree, cb) {
    if (Array.isArray(tree)) {
      for (var i = 0, length = tree.length; i < length; i++) {
        traverse(cb(tree[i]), cb)
      }
    } else if (typeof tree === 'object' && tree.hasOwnProperty('content')) {
      traverse(tree.content, cb)
    }

    return tree
  }

  /**
   * HTML Stringifier
   *
   * @param  {Array|Object} tree PostHTML Tree
   *
   * @return {String} result HTML
   */
  function html (tree) {
    var result = ''

    tree = Array.isArray(tree) ? tree : [tree]

    traverse(tree, function (node) {
      // undefined, null, '', [], NaN
      if (node === undefined ||
          node === null ||
          node.length === 0 ||
          Number.isNaN(node)) {
        return
      }

      // treat as new root tree if node is an array
      if (Array.isArray(node)) {
        result += html(node)

        return
      }

      if (typeof node === 'string' || typeof node === 'number') {
        result += node

        return
      }

      // skip node
      if (node.tag === false) {
        if (typeof node.content === 'string' || typeof node.content === 'number') {
          result += node.content
        }

        return node.content
      }

      var tag = node.tag || 'div'

      if (isSingleTag(tag)) {
        result += '<' + tag + attrs(node.attrs)

        switch (closingSingleTag) {
          case 'tag':
            result += '></' + tag + '>'

            break
          case 'slash':
            result += ' />'

            break
          default:
            result += '>'
        }

        if (node.hasOwnProperty('content')) {
          return node.content
        }
      } else {
        result += '<' + tag

        if (node.attrs) {
          result += attrs(node.attrs)
        }

        result += '>'

        if (node.hasOwnProperty('content')) {
          result += html(node.content)
        }

        result += '</' + tag + '>'
      }
    })

    return result
  }
}

/**
 * @module posthtml-render
 *
 * @version 1.1.5
 * @license MIT
 */
module.exports = render
