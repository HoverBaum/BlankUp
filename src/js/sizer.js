/*
	This module ensures that BlankUp is as tall as its container.
 */

module.exports = function ensureSize(container) {
	sizeCodeMirror(container)
	window.onresize = () => {
		sizeCodeMirror(container)
	}
}

function sizeCodeMirror(container) {
	const height = window.getComputedStyle(container).getPropertyValue('height')
	container.querySelector('.CodeMirror').style.height = height

}
