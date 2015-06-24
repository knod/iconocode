/* viewer.js
* http://stackoverflow.com/questions/13026285/codemirror-for-just-one-line-textfield
* 
* Adds element that will show the icon as it's being built
* ??: Should I start out with the code editor being there?
* I don't want the user to be able to edit in the code editor when
* not in image editing mode?
* https://codemirror.net/doc/manual.html (check out readOnly and nocursor
* and cm.getWrapperElement() )
* 
* 
* TODO:
* - Make text into placeholder text instead
* - When search bar is given focus, deselect anything that's selected (it's
* 	an issue when the search bar is clicked into instead of some keyboard input)
* - Style stuff to look nice. No idea how to do this, especially since
* 	there's a div with no class under CodeMirror-scroll that has
* 	position: absolute, but is still taking up a bunch of space and updates
* 	itself to do so, so that I can't seem to change it. And since two
* 	scrollbars keep appearing, and probably other stuff. And since
* 	$(".icd.icon-adder .CodeMirror-scroll").css('overflow', 'hidden');
* 	seems to not work.
* 
* DONE:
* - Prevent people from typing in stuff that will make new spans in
* CodeMirror...
* 
* CODEMIRROR:
* cm.execCommand('');
* goWordLeft, goWordRight, goGroupLeft, goGroupRight
* delWordBefore, delWordAfter, delGroupBefore, delGroupAfter
* 	'before' doesn't delete an after, 'after' doesn't delete anything before
* 	'group' seems to be the whole line right now.
* 	??: How do I make new groups? Or keep each thing down to one word?
* adder.viewer.getTokenAt({line: 0, ch: 1}) (gets whole word of wherever char is at, or spaces)
* 	adder.viewer.getTokenAt({line: 1, ch: #}), with only one line, seems to get the last token in that line
* 	??: How to prevent creating new tokens? Or perhaps just use groups somehow?
* doc.getValue, doc.setValue, doc.getRange, doc.replaceRange
* 	doc. can be cm.
* doc.setSelection?
* doc.addLineClass(line: integer|LineHandle, where: string, class: string) → LineHandle
* 	Set a CSS class name for the given line. line can be a number or a line handle. where
* 	determines to which element this class should be applied, can can be one of "text" (the
* 	text element, which lies in front of the selection), "background" (a background element
* 	that will be behind the selection), "gutter" (the line's gutter space), or "wrap" (the
* 	wrapper node that wraps all of the line's elements, including gutter elements). class
* 	should be the name of the class to apply.
* scrollTo
* 
* CodeMirror addons to try:
* 	https://codemirror.net/demo/simplescrollbars.html
* 	search/search.js: https://codemirror.net/demo/search.html
* 
* 
* 
* Lazy search?:
* http://codepen.io/atwulf/pen/vczhJ
* 
* 
* TODO:
* - Ask stack overflow questions:
* 	How to match the first occurance of each letter of a string? (answer self)
* 	How to get the CodeMirror DOM node? (right now using parent class)
* 	How to set the id of a CodeMirror DOM node?
* 	How to get the CodeMirror text area DOM node?
* - Answer CodeMirror forum questions
* - Add undo to search bar somehow
*/

'use strict'

adder.addViewer = function ( parentNode ) {
/*

Really a code mirror instance
Working example: http://jsfiddle.net/8fjpbc5L/
*/
	var thisViewer = {}


	thisViewer.constructIcon = function ( variableName, purpose, imageNodes ) {
	/* ( str, str, [Nodes] ) -> {}
	* 
	* Creates, sets, and saves an icon with the given values.
	*/
		var iconObj = new Icon( variableName );
		// Placeholder... Not sure this works this way anymore
		// Need to create marker
		iconObj.createNew( document.createDocumentFragment() );
		iconObj.setType( purpose , iconObj.container );

		iconObj.setImages( imageNodes, iconObj.body );

		iconObj.save( icd.map );

		return iconObj;
	};  // End thisViewer.constructIcon()


	thisViewer.apply = function ( variableName ) {
	/* 
	* 
	* Set the icon for the given variable.
	* Save the icon in a library somewhere and link the icon
	* element with the variable name's text. Replace any occurances
	* of the text with that icon.
	*/

		thisViewer.constructIcon( 'testX', 'verb', [] );
	};  // End thisViewer.apply()


	thisViewer.addApply = function ( parentNode, classes ) {

		var control = document.createElement('i');
		parentNode.appendChild( control )
		// Fontawesome class
		$(control).addClass( 'fa fa-check-square command' );
		$(control).addClass( 'apply' );

		control.addEventListener( 'click', function () {



		} );

		return control;
	};  // End thisViewer.addApply()


	adder.searchBar;

	// ==================
	// MODE
	// ==================
	// My own mode!
	// This mode has to be defined before the editor gets created
	CodeMirror.defineSimpleMode("icd", {
		// The only thing that breaks up a token atm is a ';'
		// From rewt: [^;\n]*;? (https://regex101.com/r/pC5lB2/5)
		start: [ {regex: /[^;\n]*;?/i, token: "search-terms"} ]
	});

	// ===============
	// EDITOR
	// ===============
	var cmEditor = CodeMirror( parentNode,
		{
			mode: 			"icd", // text or text/html = cm-m-null class on span
			value: 			"What does this variable do?",
			// theme: 			"monokai",
			lineNumbers: 	false,
			addModeClass: 	true,
			showCursorWhenSelecting: true,
			tabindex: 		0,
			resetSelectionOnContextMenu: false
		}
	);

	adder.viewer 		= cmEditor;

	// var searcher = CodeMirror( parentNode,
	// 	{
	// 		mode: 			"javascript",
	// 		value: 			"Search here",
	// 		theme: 			"monokai",
	// 		lineNumbers: 	false
	// 	}
	// );

	// adder.searcher = searcher;


	// =====================
	// ONE LINE HIGH
	// =====================
	// cmEditor.setSize( '100%', cmEditor.defaultTextHeight() + 2 * 4);
	cmEditor.setSize( 'auto', '100%');
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


	// ======================
	// KEY MAPPING
	// ======================
	// Tab in this 'search bar' navigates to selecting choices
	cmEditor.setOption("extraKeys", {
	// http://codemirror.net/doc/manual.html#keymaps
		Tab: function() {
			// Change this to use the right grid using the adder mode
			var activeGrid = adder.modes[ adder.activeMode ].grid;
			activeGrid.activateKeyboardNav();
		}
	});


	// =================
	// EVENTS
	// =================
	cmEditor.on("change", function(instance, change) {
		// When text is added or deleted (anything else?) search the mode's choices
		var activeGrid = adder.modes[ adder.activeMode ].grid;
		adder.runSearch( activeGrid.choiceContainers )
	});

	// the following line fixes a bug I've encountered in CodeMirror 3.1
	$(".icd.icon-adder .CodeMirror-scroll").css('overflow', 'hidden');
	// jQuery again! be careful with selector or move this to .css file

	adder.editorNode 		 = $('.icd.icon-adder .CodeMirror')[0];
	adder.searchBarContainer = $('.icd.icon-adder .CodeMirror-code')[0];
	// adder.searchBarContainer.style.display = 'flex';

	// --- STYLING --- \\
	// To display apply properly
	$(".icd.icon-adder .CodeMirror").css('display', 'flex');
	// I don't like the current horizontal scroll bar space
	$('.icd.icon-adder .CodeMirror-hscrollbar')[0].style['minHeight'] = '10px';
	$('.icd.icon-adder .CodeMirror-hscrollbar')[0].style.height = '10px';

	adder.sections.viewer.style.display = 'flex';
	adder.sections.viewer.style['alignItems'] = 'flex-start';
	adder.sections.viewer.style['justifyContent'] = 'space-between';
	var applier 			 = thisViewer.addApply( adder.sections.viewer );

	return cmEditor;
};  // End adder.addViewer()
