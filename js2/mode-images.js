/* mode-images.js

Creates everything to do with the images mode?

TODO:


Affects:
adder.modes.images - { tab: null, section: null, choices: [] }

Makes use of:
adder.sections 	= { tabs: null, viewer: null, pickers: null };
*/

'use strict'

adder.addImageMode 	= function () {
/* Enclose and name so it can be called in order */

	// =============
	// PICKER
	// =============
	adder.addImageChoice 	= function ( imgFilePath, parentNode ) {
	/* ( str, Node, Node ) -> new Node

	Maybe way to do image size to maximize image http://jsfiddle.net/0bmws0me/1/
	(from TheP... something), but maybe we want the images to be their proper size?
	*/

		// var imgContainer 		= document.createElement('div');
		// parentNode.appendChild( imgContainer );
		// imgContainer.className 	= prefix + ' image-choice-container';

		var img 				= document.createElement('img');
		// imgContainer.appendChild( img );
		parentNode.appendChild( img );
		img.className 			= prefix + ' image-choice';
		img.src 				= imgFilePath;
		// No id?
		// Will use src of clicked image to add correct image
		// No label?

		// TODO: add when clicked

		// return imgContainer;
		return img;
	}  // End adder.addChoice()


	adder.addImagePicker = function ( parentNode ) {
	/*

	Offers a selection of types for new icons
	*/
		// --- PICKER --- \\
		var imagePicker 			= adder.createPicker( 'images' );  // In adder.js atm
		adder.modes.images.section 	= imagePicker;
		parentNode.appendChild( imagePicker );

		// Add images to the DOM
		adder.modes.images.choices 	= adder.defaultImages;
		var imgs 					= adder.defaultImages;
		for ( var imgi = 0; imgi < imgs.length; imgi++ ) {
			var img 		= imgs[ imgi ];
			var filePath 	= img.folder + img.fileName;
			adder.addImageChoice( filePath, imagePicker );
		}

		return imagePicker;
	};  // End adder.addTypePicker()


	// =============
	// TAB
	// =============
	adder.addImageTab 	= function ( parent ) {

		// For my own clarity
		var args = {
			group: 'mode', type: 'images', label: 'Images',
			toShow: adder.modes.images.section, parentObj: adder.modes.images
		};

		var typeTab 		 = adder.createTabInGroup(
			args.group, args.type, args.label, args.toShow, args.parentObj
		);
		parent.appendChild( typeTab );

		return typeTab;
	};  // End adder.addImageTab()



	// ==================
	// START STUFF
	// ==================
	adder.addImagePicker( adder.sections.pickers );
	adder.addImageTab( adder.sections.tabs );
};  // End adder.addTypeMode()
