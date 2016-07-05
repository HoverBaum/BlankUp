<img src="img/logo.jpg" width="300" style="margin: 0 auto;display:block;">

A clear and simple markdown editor.

![BlankUp in action.](img/blankUpDemo.png)

# Features

- GitHub flavoured markdown (GFM)
- Toggleable live preview
- With emoji support

## Roadmap

This is a well working beta version. In fact if you only want an editor for markdown that works out of the box BlankUp is already perfect for you. Though there are great things coming. Since we are build on markdown-it we will enable you to use any of it's plugins. We also want to create an easy API (or something) to style the editor.

# API

## Objects

<dl>
<dt><a href="#BlankUp">BlankUp</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#BlankUpEditor">BlankUpEditor(container)</a> ⇒ <code><a href="#BlankUp">BlankUp</a></code></dt>
<dd><p>Create an instance of a BlankUp Markdown editor in a given element.</p>
</dd>
</dl>

<a name="BlankUp"></a>

## BlankUp : <code>object</code>
**Kind**: global namespace  

* [BlankUp](#BlankUp) : <code>object</code>
    * [.previewVisible(visible)](#BlankUp+previewVisible)
    * [.setMarkdown(markdown)](#BlankUp+setMarkdown)
    * [.getMarkdown()](#BlankUp+getMarkdown) ⇒ <code>String</code>

<a name="BlankUp+previewVisible"></a>

### blankUp.previewVisible(visible)
Set the visiblity of the preview.

**Kind**: instance method of <code>[BlankUp](#BlankUp)</code>  

| Param | Type | Description |
| --- | --- | --- |
| visible | <code>Boolean</code> | If the preview should be visible or not. |

<a name="BlankUp+setMarkdown"></a>

### blankUp.setMarkdown(markdown)
Set the current conent of the editor to a given markdown.

**Kind**: instance method of <code>[BlankUp](#BlankUp)</code>  

| Param | Type | Description |
| --- | --- | --- |
| markdown | <code>String</code> | New content of the editor. |

<a name="BlankUp+getMarkdown"></a>

### blankUp.getMarkdown() ⇒ <code>String</code>
Get the current content of the editor.

**Kind**: instance method of <code>[BlankUp](#BlankUp)</code>  
**Returns**: <code>String</code> - - The current markdown content of the editor.  
<a name="BlankUpEditor"></a>

## BlankUpEditor(container) ⇒ <code>[BlankUp](#BlankUp)</code>
Create an instance of a BlankUp Markdown editor in a given element.

**Kind**: global function  
**Returns**: <code>[BlankUp](#BlankUp)</code> - - An instance of a BlankUp editor.  

| Param | Type | Description |
| --- | --- | --- |
| container | <code>DOMElement</code> | The Element of the DOM in which to create a BlankUp editor. |


# Credits

Build on and using:
- [CodeMirror](https://github.com/codemirror/CodeMirror)
- [Markdown-it](https://github.com/markdown-it/markdown-it)
- [Browserify](https://github.com/substack/node-browserify)
- [Stylus](https://github.com/stylus/stylus)

Huge props to [markdown-editor](https://github.com/jbt/markdown-editor) where the basics of this came from. After that it really is mainly sugar.
