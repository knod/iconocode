/* viewer.js

http://stackoverflow.com/questions/13026285/codemirror-for-just-one-line-textfield

Adds element that will show the icon as it's being built
??: Should I start out with the code editor being there?
I don't want the user to be able to edit in the code editor when
not in image editing mode?
https://codemirror.net/doc/manual.html (check out readOnly and nocursor
and cm.getWrapperElement() )


TODO:
- Prevent people from typing in stuff that will make new spans in
CodeMirror...

CODEMIRROR:
cm.execCommand('');
goWordLeft, goWordRight, goGroupLeft, goGroupRight
delWordBefore, delWordAfter, delGroupBefore, delGroupAfter
	'before' doesn't delete an after, 'after' doesn't delete anything before
	'group' seems to be the whole line right now.
	??: How do I make new groups? Or keep each thing down to one word?
adder.viewer.getTokenAt({line: 0, ch: 1}) (gets whole word of wherever char is at, or spaces)
	adder.viewer.getTokenAt({line: 1, ch: #}), with only one line, seems to get the last token in that line
	??: How to prevent creating new tokens? Or perhaps just use groups somehow?
doc.getValue, doc.setValue, doc.getRange, doc.replaceRange
	doc. can be cm.
doc.setSelection?
doc.addLineClass(line: integer|LineHandle, where: string, class: string) → LineHandle
	Set a CSS class name for the given line. line can be a number or a line handle. where
	determines to which element this class should be applied, can can be one of "text" (the
	text element, which lies in front of the selection), "background" (a background element
	that will be behind the selection), "gutter" (the line's gutter space), or "wrap" (the
	wrapper node that wraps all of the line's elements, including gutter elements). class
	should be the name of the class to apply.
scrollTo

CodeMirror addons to try:
	https://codemirror.net/demo/simplescrollbars.html
	search/search.js: https://codemirror.net/demo/search.html



Lazy search?:
http://codepen.io/atwulf/pen/vczhJ
*/

'use strict'

adder.addViewer = function ( parentNode ) {
/*

Really a code mirror instance
Working example: http://jsfiddle.net/8fjpbc5L/
*/

	// ==================
	// MODE
	// ==================
	// My own mode!
	// This mode has to be defined before the editor gets created
	CodeMirror.defineSimpleMode("icd", {
		// The only thing that breaks up a token atm is a ';'
		start: [ {regex: /.*?;/i, token: "search-terms"} ]
	});

	// ===============
	// EDITOR
	// ===============
	var cmEditor = CodeMirror( parentNode,
		{
			mode: 			"icd", // text or text/html = cm-m-null class on span
			value: 			"What does this variable do?",
			theme: 			"monokai",
			lineNumbers: 	false,
			addModeClass: 	true
		}
	);

	adder.viewer = cmEditor;

	// var searcher = CodeMirror( parentNode,
	// 	{
	// 		mode: 			"javascript",
	// 		value: 			"Search here",
	// 		theme: 			"monokai",
	// 		lineNumbers: 	false
	// 	}
	// );

	// adder.searcher = searcher;

	// cmEditor.setSize( '100%', cmEditor.defaultTextHeight() + 2 * 4);
	cmEditor.setSize( '100%', '100%');
	// searcher.setSize( '100%', '100%');
	// 200 is the preferable width of text field in pixels,
	// 4 is default CM padding (which depends on the theme you're using)

	// now disallow adding newlines in the following simple way
	cmEditor.on("beforeChange", function(instance, change) {
	    var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
	    change.update(change.from, change.to, [newtext]);
	    return true;
	});
	// searcher.on("beforeChange", function(instance, change) {
	//     var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
	//     change.update(change.from, change.to, [newtext]);
	//     return true;
	// });

	// and then hide ugly horizontal scrollbar
	cmEditor.on("change", function(instance, change) {
	    // $(".CodeMirror-hscrollbar").css('display', 'none');
	    // (!) this code is using jQuery and the selector is quite imperfect if
	    // you're using more than one CodeMirror on your page. you're free to
	    // change it appealing to your page structure.
	});

	// the following line fixes a bug I've encountered in CodeMirror 3.1
	$(".CodeMirror-scroll").css('overflow', 'hidden');
	// jQuery again! be careful with selector or move this to .css file


	// Tab in this 'search bar' navigates to selecting choices
	cmEditor.setOption("extraKeys", {
	// http://codemirror.net/doc/manual.html#keymaps
		Tab: function() {
			// Change this to use the right grid using the adder mode
			adder.activateKeyboardNav( adder.imgGrid );
		}
	});




	return cmEditor;
};  // End adder.addViewer()
