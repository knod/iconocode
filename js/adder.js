/* uiMan.js

Allows a user to select an icon for some text

TODO:
- Allow users to build on previous icons
- Allow user to drag icons around, or manipulate their location
	with the keyboard
- When in image selector, cursor is in viewer, can copy and paste and
	delete just as if editing text. Typing text will search for an icon
	and show options.
*/

'use strict'

var adder = {};
var uiMan = {};

uiMan.selectionSanitizer = function () {
/*

Make sure: 1) a whole word is selected and 2) this
word doesn't yet have an icon associated with it
*/


};  // End uiMan.selectionSanitizer()



// ==================
// SHOWING UI
// ==================


uiMan.onTrigger = function () {
/*

Create icon bit by bit, add variable to dictionary
*/

	// Show adder
	// Scroll text till adder is below selected word
	// Prevent scrolling or clicking on other stuff
	// Activate type selecting tab
	// After user selects a type
		// Show icon being built
		// Activate image searching tab
		// (Make existing combos searchable?)

};  // End uiMan.onTrigger()



// ==================
// END uiMan{}
// ==================

