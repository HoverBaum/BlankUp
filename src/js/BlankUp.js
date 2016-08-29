
/**
 *   @namespace BlankUp
 */

//First strap a lot of things in
//This is donw with browserify
const hljs = require('highlight.js')
const markdownit = require('markdown-it')
const markdownitFootnote = require('markdown-it-footnote')
const taskLists = require('markdown-it-task-lists')
const mdEmoji = require('markdown-it-emoji')

//Codemirror needs a lot of things.
require('codemirror/mode/gfm/gfm')
require('codemirror/mode/htmlmixed/htmlmixed')
require('codemirror/addon/edit/continuelist')
require('codemirror/addon/edit/closebrackets')
const CodeMirror = require('codemirror/lib/codemirror')

//Also some css
require('../css/BlankUp.css')

//Our own modules
const Events = require('./pubSub')
const Sizer = require('./sizer')

const generateId = () => {
	return (Date.now() + Math.random().toString(36).substr(2, 9)).toUpperCase()
}

const forEach = (array, callback, scope) => {
	for (var i = 0; i < array.length; i++) {
		callback.call(scope, array[i], i)
	}
}

/**
 *   Create an instance of a BlankUp Markdown editor in a given element.
 *   @param {DOMElement} container 	- The Element of the DOM in which to create a BlankUp editor.
 *   @return {BlankUp} 				- An instance of a BlankUp editor.
 */
const BlankUp = function createBlankUpEditor(container) {

	//Create an id used for channels etc.
	const BlankUpId = generateId()

    /*
    <div class="BlankUp BlankUp_show-preview">

        <!-- The part with the editor -->
        <div class="BlankUp__input">
            <textarea class="BlankUp-textarea" id="code"></textarea>
        </div>

        <!-- HTML preview window -->
        <div class="BlankUp__preview markdown-body">

        </div>

    </div>
    */

    container.innerHTML = ''
    const BlankUpContainer = document.createElement('div')
    BlankUpContainer.classList.add('BlankUp')
    const BlankUpInput = document.createElement('div')
    BlankUpInput.classList.add('BlankUp__input')
    const BlankUpTextArea = document.createElement('textarea')
    BlankUpTextArea.classList.add('BlankUp-textarea')
    BlankUpInput.appendChild(BlankUpTextArea)
    const BlankUpPreview = document.createElement('div')
    BlankUpPreview.classList.add('BlankUp__preview')
    BlankUpPreview.classList.add('markdown-body')
    BlankUpContainer.appendChild(BlankUpInput)
    BlankUpContainer.appendChild(BlankUpPreview)
    container.appendChild(BlankUpContainer)

    // Because highlight.js is a bit awkward at times
    var languageOverrides = {
        js: 'javascript',
        html: 'xml'
    };

    //Get an instance of markdown-it to parse the markdown to HTML
    var md = markdownit({
            html: true,
            linkify: true,
            typographer: true,
            highlight: function(code, lang) {
                if (languageOverrides[lang]) lang = languageOverrides[lang];
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, code).value;
                    } catch (e) {}
                }
                return ''
            }
        })
        .use(markdownitFootnote)
        .use(taskLists)
		.use(mdEmoji)

    /**
     *   Update the preview
     *   @param  {DOMElement} e - Textarea from which to get the raw mardown.
     *   @private
     */
    function updatePreview(e) {
        previewMarkdown(e.getValue())
    }

    /**
     *	 Preview markdown using markdown-it.
     *   @param {String} rawMarkdown - The markdown ot be previewed
     *   @private
     */
    function previewMarkdown(rawMarkdown) {
        const out = BlankUpPreview
        const old = out.cloneNode(true)
        out.innerHTML = md.render(rawMarkdown)

        //Scroll to the first node that changed.
        const allold = old.getElementsByTagName("*");
        if (allold === undefined) return
        const allnew = out.getElementsByTagName("*");
        if (allnew === undefined) return
        for (var i = 0, max = Math.min(allold.length, allnew.length); i < max; i++) {
            if (!allold[i].isEqualNode(allnew[i])) {
                const maxScroll = out.scrollHeight - out.offsetHeight
                if (allnew[i].offsetTop <= maxScroll) {
					out.scrollTop = allnew[i].offsetTop - out.offsetTop
                } else {
                    out.scrollTop = maxScroll
                }
            }
        }
    }

    //Create the Codemirror editor.
    const editor = CodeMirror.fromTextArea(BlankUpTextArea, {
        mode: {
            name: 'gfm',
            highlightFormatting: true
        },
        lineNumbers: false,
        matchBrackets: true,
        lineWrapping: true,
        theme: 'genesis',
        extraKeys: {
            "Enter": "newlineAndIndentContinueMarkdownList"
        },
        autoCloseBrackets: true,
		dragDrop: false
    });

	//Handle editor changes.
    editor.on('change', updatePreview)
	editor.on('change', (codeMirrorInstance, changes) => {
		//Don't report the setting of values as a change.
		if(changes.origin === 'setValue') return
		Events.emit(BlankUpId, {
			channel: 'change',
			origin: changes.origin
		})
	})

	//Make sure editor is sized right.
	Sizer(BlankUpInput)

	//Make the preview scroll along nicely.
    editor.on('scroll', (e) => {
		const scroller = BlankUpInput.querySelector('.CodeMirror-scroll')
        const inputScroll = scroller.scrollTop
        const ratio = (BlankUpPreview.scrollHeight - BlankUpPreview.offsetHeight) / (scroller.scrollHeight - scroller.offsetHeight)
        const scrollTop = inputScroll * ratio
        BlankUpPreview.scrollTop = scrollTop
    })

    //Position the cursor inside the eidtor if the wrapper gets clicked.
    BlankUpInput.addEventListener('click', function(e) {
        const wrapperClick = /(^CodeMirror[^-]|BlankUp__input)/.test(e.target.className)
        if (wrapperClick) {
            const x = e.offsetX
            const y = e.offsetY
			let lineNumber = 0
			const lines = BlankUpInput.querySelectorAll('.CodeMirror-line')
			for(var i = 0; i < lines.length; i++) {
				const line = lines[i]
				if(line !== undefined) {
					if(line.offsetTop < y && line.offsetTop + line.offsetHeight > y) {
						lineNumber = i
					}
				}
			}

			const sizer = BlankUpInput.querySelector('.CodeMirror-sizer')
            const sizerLeft = sizer.getBoundingClientRect().left
            const sizerCenter = sizerLeft + sizer.offsetWidth / 2
            const leftOfEditor = x < sizerCenter ? true : false
            editor.focus()
            if (leftOfEditor) {
                editor.setCursor({
                    line: lineNumber,
                    ch: 0
                })
            } else {
                editor.setCursor({
                    line: lineNumber
                })
            }
        }
    })

    /**
     *   Set the visiblity of the preview.
     *   @param {Boolean} visible 	- If the preview should be visible or not.
     *   @method BlankUp#previewVisible
     */
    function setPreviewVisiblity(visible) {
        const previewClass = 'BlankUp_show-preview'
        if (visible === true) {
            BlankUpContainer.classList.add(previewClass)
        } else {
            BlankUpContainer.classList.remove(previewClass)
        }

    }

	/**
	 *   Set the current conent of the editor to a given markdown.
	 *   @param {String} markdown 	- New content of the editor.
	 *   @method BlankUp#setMarkdown
	 *
	 */
	function setMarkdown(markdown) {
		editor.setValue(markdown)
	}

	/**
	 *   Subscribe a listener to an event.
	 *   @param {String} event  	- The event to subscribe to.
	 *   @param {Function} listener - Function to call when event happens.
	 *   @method BlankUp#on
	 */
	function registerEventListener(channel, listener) {
		Events.subscribe(BlankUpId, function(event) {
			if(event.channel === channel) {
				listener(event)
			}
		})
	}

	/**
	 *   Get the current content of the editor.
	 *   @return {String}			- The current markdown content of the editor.
	 *   @method BlankUp#getMarkdown
	 */
	function getMarkdown() {
		return editor.getValue()
	}

	/**
	 *   Focus the editor.
	 *   @method BlankUp#focus
	 */
	function focus() {
		editor.focus()
	}

    //Initially update the preview.
    updatePreview(editor)

    return {
        previewVisible: setPreviewVisiblity,
		setMarkdown,
		getMarkdown,
		editor,
		on: registerEventListener,
		focus: focus
    }

}

if(window !== undefined){
	window.BlankUp = BlankUp
}
