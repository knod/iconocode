/* mode-images.js

Creates everything to do with the images mode?

TODO:
- Checkout http://jsfiddle.net/g9HMf/3/ for grid navigation with scrolling


Affects:
adder.modes.images - { tab: null, section: null, choices: [] }

Makes use of:
adder.sections 	= { tabs: null, viewer: null, pickers: null };
*/

'use strict'

adder.addImageMode 	= function () {
/* Enclose and name so it can be called in order */

	// ====================
	// Grid
	// ====================
	adder.grid = [];

	// ====================
	// Navigation
	// ====================
	// http://jsfiddle.net/g9HMf/3/
	var position = { x: 0, y: 0 };
	var imgGrid = [];

	function highlightImage( x, y ) {
	    $('.image-choice').removeClass('selected');
	    imgGrid[y][x].addClass('selected');
	}

    $('.row').each(function () {
        imgGrid.push([]);
        $('.day, .date', this).each(function () {
            imgGrid[imgGrid.length - 1].push($(this));
        });
    });
    highlightImage( position.x, position.y );


	$(window).on('keydown', function (e) {
	    if (e.keyCode === 37) // left
	        moveLeft();
	    else if (e.keyCode === 38) // up
	        moveUp();
	    else if (e.keyCode === 39) // right
	        moveRight();
	    else if (e.keyCode === 40) // down
	        moveDown();
	    highlightImage();
	});

	function moveLeft() {
	    position.x--;
	    if (position.x < 0) position.x = 0;
	}

	function moveUp() {
	    position.y--;
	    if (position.y < 0) position.y = 0;
	}

	function moveRight() {
	    position.x++;
	    if (position.x >= imgGrid[0].length) position.x = imgGrid[0].length - 1;
	}

	function moveDown() {
	    position.y++;
	    if (position.y >= imgGrid.length) position.y = imgGrid.length - 1;
	}


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
			var filePath 	= img.folderPath + img.fileName;
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
