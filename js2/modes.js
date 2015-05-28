/* modes.js
*/

'use strict'


adder.modeTabs 	= { section: null, types: null, images: null, colors: null };
adder.pickers 	= { section: null, types: {},
	images: { div: null, imageObjs: icdDefaultImages },
	colors: { div: null, colorValues: null }
};  // End pickers {}


adder.addTabsContainer 		= function ( parent ) {
/*

Adds tabs that will allow the selection of what to edit
*/
	var tabContainer 		= document.createElement('section');
	adder.modeTabs.section 	= tabContainer;
	parent.appendChild( tabContainer );

	return parent;
};  // End adder.addModeTabs()


adder.addModes = function () {


};  // End adder.addModes()



