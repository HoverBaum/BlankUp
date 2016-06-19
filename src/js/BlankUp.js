// Because highlight.js is a bit awkward at times
var languageOverrides = {
    js: 'javascript',
    html: 'xml'
};

emojify.setConfig({
    img_dir: 'emoji'
});

//Get an instance of markdown-it to parse the markdown to HTML
var md = markdownit({
        html: true,
        highlight: function(code, lang) {
            if (languageOverrides[lang]) lang = languageOverrides[lang];
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, code).value;
                } catch (e) {}
            }
            return '';
        }
    })
    .use(markdownitFootnote);


function update(e) {
    setOutput(e.getValue());
}

function setOutput(val) {
    var out = document.querySelector('.BlankUp-preview');
    var old = out.cloneNode(true);
    out.innerHTML = md.render(val);
    emojify.run(out);

	//Scroll to the first node that changed.
    var allold = old.getElementsByTagName("*");
    if (allold === undefined) return;

    var allnew = out.getElementsByTagName("*");
    if (allnew === undefined) return;

    for (var i = 0, max = Math.min(allold.length, allnew.length); i < max; i++) {
        if (!allold[i].isEqualNode(allnew[i])) {
            out.scrollTop = allnew[i].offsetTop;
            return;
        }
    }
}


var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    mode: 'gfm',
    lineNumbers: false,
    matchBrackets: true,
    lineWrapping: true,
    theme: 'genesis',
    extraKeys: {
        "Enter": "newlineAndIndentContinueMarkdownList"
    }
});


editor.on('change', update);
/*

document.addEventListener('drop', function(e){
  e.preventDefault();
  e.stopPropagation();

  var reader = new FileReader();
  reader.onload = function(e){
	editor.setValue(e.target.result);
  };

  reader.readAsText(e.dataTransfer.files[0]);
}, false);

*/

update(editor)
