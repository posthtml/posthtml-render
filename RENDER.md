## Modules

<dl>
<dt><a href="#module_posthtml-render">posthtml-render</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#render">render(tree, options)</a> ⇒ <code>String</code></dt>
<dd><p>Render PostHTML Tree to HTML</p>
</dd>
</dl>

<a name="module_posthtml-render"></a>

## posthtml-render
**Version**: 1.0.7  
**License**: MIT  
<a name="render"></a>

## render(tree, options) ⇒ <code>String</code>
Render PostHTML Tree to HTML

**Kind**: global function  
**Returns**: <code>String</code> - HTML  

| Param | Type | Description |
| --- | --- | --- |
| tree | <code>Array</code> \| <code>Object</code> | PostHTML Tree |
| options | <code>Object</code> | Options |


* [render(tree, options)](#render) ⇒ <code>String</code>
    * [~options](#render..options) : <code>Object</code>
    * [~html(tree)](#render..html) ⇒ <code>String</code>

<a name="render..options"></a>

### render~options : <code>Object</code>
Options

**Kind**: inner property of [<code>render</code>](#render)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| singleTags | <code>Array.&lt;(String\|RegExp)&gt;</code> | Custom single tags (selfClosing) |
| closingSingleTag | <code>String</code> | Closing format for single tag Formats: ``` tag: `<br></br>` ```, slash: `<br />` ```, ```default: `<br>` ``` |

<a name="render..html"></a>

### render~html(tree) ⇒ <code>String</code>
HTML Stringifier

**Kind**: inner method of [<code>render</code>](#render)  
**Returns**: <code>String</code> - result HTML  

| Param | Type | Description |
| --- | --- | --- |
| tree | <code>Array</code> \| <code>Object</code> | PostHTML Tree |

