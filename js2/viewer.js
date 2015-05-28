/* viewer.js

http://stackoverflow.com/questions/13026285/codemirror-for-just-one-line-textfield

CodeMirror addons to try:
https://codemirror.net/demo/simplescrollbars.html
search/search.js: https://codemirror.net/demo/search.html


Adds element that will show the icon as it's being built
??: Should I start out with the code editor being there?
I don't want the user to be able to edit in the code editor when
not in image editing mode?
https://codemirror.net/doc/manual.html (check out readOnly and nocursor
and cm.getWrapperElement() )

Lazy search?:
http://codepen.io/atwulf/pen/vczhJ
*/

'use strict'

adder.addViewer = function ( parentNode ) {
/*

Really a code mirror instance
Working example: http://jsfiddle.net/8fjpbc5L/
*/
	var cmEditor = CodeMirror( parentNode,
		{
		  value: 		"What does this variable do?",
		  theme:  		"monokai",
		  lineNumbers: 	false
		}
	);

	adder.viewer = cmEditor;

	// cmEditor.setSize( '100%', cmEditor.defaultTextHeight() + 2 * 4);
	cmEditor.setSize( '100%', '100%');
	// 200 is the preferable width of text field in pixels,
	// 4 is default CM padding (which depends on the theme you're using)

	// now disallow adding newlines in the following simple way
	cmEditor.on("beforeChange", function(instance, change) {
	    var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
	    change.update(change.from, change.to, [newtext]);
	    return true;
	});

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

	return cmEditor;
};  // End adder.addViewer()
