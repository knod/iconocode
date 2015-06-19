/* start.js
* Gets the adder object set up
* 
* Functionality:
* https://docs.google.com/document/d/1noMJaJN5vGC80BwIqofgU7YU2JPu_gqkylPBSmIA_LU/edit
* 
* Diagram:
* https://drive.draw.io/#G0B5hKyz4A3fV6U05YMmhqSmlQT2c
* http://imgur.com/VKdysVg,G9i7w35#1
* 
* Create picker node first, then create tab and send the picker to the tab
*/

'use strict'

var prefix 	= 'icd';

var adder 	= {};

// State
adder.typeSelected 	= false;
adder.activeMode 	= null;

// Container for everything
adder.node 	 		= null;

// Inside the adder
adder.viewer 		= null;
adder.sections 		= { tabs: null, viewer: null, pickers: null };
adder.modes  		= {
	types: { tab: null, section: null, choices: {} }, // verb, noun, message

	// Not comfortable that choices is a list and not an object
	images: { tab: null, section: null, choices: [] }, // img list

	colors: {
		tab: null,
		section: null,
		modes: {
			section: null,
			inDocument: { tab: null, section: null, choices: [] },
			custom: { tab: null, section: null, choices: [] } // color picker?
		}  // end colors.modes {}
	}  // end modes.colors{}
}  // end adder.modes{}

adder.defaultImages = null;
adder.imgFolder 	= null;
adder.addImgList 	= null;


window.addEventListener( 'load', function () {

	adder.addAdder();  // adder.js


	adder.addTypeMode();  // mode-types.js
	adder.addImageMode();  // mode-images.js
	// No idea how to do this
	// adder.addColorMode();  // mode-colors.js

	adder.arrangeTabs();  // adder.js

	// Has to be after others I think
	adder.addViewer( adder.sections.viewer );

	// This should happen from an event, of course
	adder.showAdder();  // adder.js


});  // End on load ()

