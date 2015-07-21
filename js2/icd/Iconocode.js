/* Iconocode.js
* 
* Manages all the iconocode parts
* 
* TODO:
* - ???: How do I handle new instances of editors
* 	being added to the current page. (leave that for much later)
* - ???: How do I mark properties that have the same name, but
* 	belong to different objects as different icons? Should that be
* 	possible? How about variable names that match property names?
* 	For example, 'push' as a var name would probably look different
* 	than js's .push (if the coder is writing good var names). Maybe
* 	at least in Icon should have a variable purpose and a type, and
* 	the type can be checked against the token type.
*/

'use strict'


var Iconocode = function () {
/* ( None ) -> Iconocode {}
* 
* 
*/

	var icd = {};

	icd.map = new IcdMap();

	icd.utils = new IcdUtils();

	icd.adder = {};  // Must integrate main start.js with this
	icd.updater = new IcdUpdater( icd.utils, icd.map );


	icd.editors = [];
	icd.addEditor = function ( editorInstance ) {
		icd.editors.push( editorInstance );
		// !!!: This is terrible, but it's a hack for now
		icd.hotbar = new HotBar( icd.map, editorInstance );
	};

	// I think each editor instance will have to add its own event listener
	// icd.utils.cursorMovementHandler( editorInstance? );
	// _rgn (##javascript) suggests looking at the source to see if the
	// instances are stored globally at some point: "it will at least give
	// you clues if it stores them somehow to keep track of them internally"

	return icd;
};  // End Iconocode {}


var icd;
window.addEventListener('load', function () {

	icd = new Iconocode();

});
