/* adder.js

TODO:
- Change what you can type in the viewer depending on mode? Or
	change to appropriate tab if text appears to be a mismatch
	with mode (for example, if you're in the Types mode)


Makes use of:
adder.sections 	= { tabs: null, viewer: null, pickers: null };

*/

'use strict'


// adder.buildAdder = function () {
adder.addAdder 	= function () {
/*

Add the adder element
*/

	var adderNode_ 		= document.createElement('div');
	document.body.appendChild( adderNode_ );
	adder.node 			= adderNode_;
	adderNode_.className = prefix + ' icon-adder';


	var tabContainer 		= document.createElement('section');
	adderNode_.appendChild( tabContainer );
	adder.sections.tabs 	= tabContainer;
	tabContainer.className 	= prefix + ' adder-mode-tabs tabs';


	var viewerContainer 		= document.createElement('section');
	adderNode_.appendChild( viewerContainer );
	adder.sections.viewer 		= viewerContainer;
	viewerContainer.className 	= prefix + ' adder-icon-viewer-container';


	var pickerCont 			= document.createElement( 'section' );
	adderNode_.appendChild( pickerCont );
	adder.sections.pickers 	= pickerCont;

	pickerCont.className 	= prefix + ' adder-pickers-container';


	// Hide adder until needed
	// adder.node.style.display = 'none';

	return adderNode_;
};  // End adder.addAdder()


adder.createPicker 		= function ( pickerType ) {
/* ( str ) -> Node

Returns a picker node with custom properties. Hides the node.
Should go somewhere else, not in adder.js
*/
	var picker 		 = document.createElement('div');
	picker.id 		 = prefix + '-' + pickerType + '-picker';
	picker.className = 'adder-picker';

	// Hide all pickers on start
	picker.style.display = 'none';

	return picker;
};  // End adder.createPicker()


adder.showAdder = function () {
/*

Right now, no previous state is saved. Should probably add that.
Whenever adder is shown again, it starts the process of making
a creating a new icon (if process wasn't completed).
*/
	// Prevent moving on to other tabs till type is selected
	adder.typeSelected = false;
	// Testing
	adder.typeSelected = true;

	// Make adder visible
	// adder.node.style.display = 'auto';

	// Make "Type" tab active
	adder.activateMode( adder.modes.types.tab );

	return adder.node;
};  // End adder.showAdder()


adder.arrangeTabs = function () {
/*

Spreads tabs evenly horizontally. I think I tried to use flexboxes
and it messed something up?
*/
	// Once all tabs are made, size them properly
	// Now that they're all in DOM, fetch them easily to do stuff to them
	var allModeTabs 	= document.getElementsByClassName( 'adder-mode-tab' );
	var numTabs 		= allModeTabs.length;

	// --- Last Styling --- \\
	var lastTab 		= allModeTabs[ (numTabs - 1) ];
	lastTab.className 	= lastTab.className + ' last';

	// --- Sizing --- \\
	var tabWidth = 100/numTabs
	for ( var tabi = 0; tabi < numTabs; tabi++ ) {
		// console.log(allModeTabs[tabi])
		allModeTabs[ tabi ].style.width = tabWidth + '%';
	}
};  // End adder.arrangeTabs()


adder.addAdder();

// document.addEventListener( 'keypress', adder.showAdder );  // End show adder event listener

// };  // End adder.buildAdder()


// =================================
// AFTER INITIALIZATION?
// =================================
// ===============
// FOCUS HISTORY
// ===============
// LEAVE THIS FOR LATER, when we've actually decided it's worth it
adder.focusTrace 	= [];
adder.focusState 	= 'going in';  // can also be 'coming out'

// // This can't be so simple. Multiple images recieve focus, you
// // can't undo all that.
// adder.changeFocusTrace = function ( evnt ) {

// 	if ( adder.focusState === 'going in' ) {
// 		adder.focusTrace.push( evnt.target );
// 	} else {
// 		adder.focusTrace.pop();
// 	}
// 	console.log(adder.focusTrace)
// 	return adder.focusTrace;
// };  // End adder.changeFocusTrace()

// // This won't work on document, because 'focus' doesn't bubble
// document.addEventListener( 'focus', function (evnt) {
// 	adder.changeFocusTrace( evnt );
// });

/* Pseudo:
To each element that is in the focus tree, add a 'focus-tree' class
	Add a focus tree number too?
To each element that is in the focus tree, add a 'focusin' event
	listener and a 'focusout' event listener
Tie that to the functions that deal with tracing the focus tree
*/
