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

const forEach = (array, callback, scope) => {
	for (var i = 0; i < array.length; i++) {
		callback.call(scope, array[i], i)
	}
}

BlankUpEditor = function createBlankUpEditor(container) {

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
     *   @param  {DOM Element} e - Textarea from which to get the raw mardown.
     */
    function updatePreview(e) {
        previewMarkdown(e.getValue())
    }

    /**
     *	 Preview markdown using markdown-it.
     *   @param {String} rawMarkdown - The markdown ot be previewed
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
                    out.scrollTop = allnew[i].offsetTop
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
        autoCloseBrackets: true
    });

    editor.on('change', updatePreview)

    BlankUpInput.addEventListener('scroll', (e) => {
        const inputScroll = BlankUpInput.scrollTop
        const ratio = (BlankUpPreview.scrollHeight - BlankUpPreview.offsetHeight) / (BlankUpInput.scrollHeight - BlankUpInput.offsetHeight)
        const scrollTop = inputScroll * ratio
        BlankUpPreview.scrollTop = scrollTop
    })

    //Position the cursor inside the eidtor if the wrapper gets clicked.
    BlankUpInput.addEventListener('click', function(e) {
        const wrapperClick = /(^CodeMirror[^-]|BlankUp__input)/.test(e.target.className)
        if (wrapperClick) {
            const x = e.offsetX
            const y = e.offsetY
            const lineHeight = BlankUpInput.querySelector('.CodeMirror-code > pre').offsetHeight
            const lineNumber = Math.floor(y / lineHeight)
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
     *   @param {Boolean} visible - If the preview should be visible or not.
     */
    function setPreviewVisiblity(visible) {
        const previewClass = 'BlankUp_show-preview'
        if (visible === true) {
            BlankUpContainer.classList.add(previewClass)
        } else {
            BlankUpContainer.classList.remove(previewClass)
        }

    }

    //Initially update the preview.
    updatePreview(editor)

    return {
        previewVisible: setPreviewVisiblity
    }

}
