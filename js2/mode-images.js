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

	// // ====================
	// // Navigation
	// // ====================
	// // http://jsfiddle.net/g9HMf/3/ - has a problem with scrolling
	var position = { x: 0, y: 0 };

	adder.selectImg = function ( imgNode ) {
	/*

	*/
		$('.image-choice.selected').removeClass('selected');
		$(imgNode).addClass('selected');

	};  // adder.selectImg();


	adder.chooseImg = function ( imgNode ) {

		var filePath = $('.image-choice.selected').attr('src');
		console.log('chooseImg():', filePath);



		// Deselect anything that's selected
		$('.image-choice.selected').removeClass('selected');

	};  // End adder.chooseImg()

	// var imgGrid = [];

	// function highlightImage( x, y ) {
	//     $('.image-choice').removeClass('selected');
	//     imgGrid[y][x].addClass('selected');
	// }

 	// highlightImage( position.x, position.y );


	// $(window).on('keydown', function (e) {
	//     if (e.keyCode === 37) // left
	//         moveLeft();
	//     else if (e.keyCode === 38) // up
	//         moveUp();
	//     else if (e.keyCode === 39) // right
	//         moveRight();
	//     else if (e.keyCode === 40) // down
	//         moveDown();
	//     highlightImage();
	// });

	// function moveLeft() {
	//     position.x--;
	//     if (position.x < 0) position.x = 0;
	// }

	// function moveUp() {
	//     position.y--;
	//     if (position.y < 0) position.y = 0;
	// }

	// function moveRight() {
	//     position.x++;
	//     if (position.x >= imgGrid[0].length) position.x = imgGrid[0].length - 1;
	// }

	// function moveDown() {
	//     position.y++;
	//     if (position.y >= imgGrid.length) position.y = imgGrid.length - 1;
	// }


	// =============
	// PICKER
	// =============
	adder.addImage 			= function ( imgFilePath, parentNode ) {
	/*

	Just create, return, and add an image node with the specified path
	*/

		var imgNode 				= document.createElement('img');
		parentNode.appendChild( imgNode );
		imgNode.src 				= imgFilePath;

		return imgNode;
	};  // End adder.addImage()


	adder.addImageChoice 	= function ( imgFilePath, parentNode ) {
	/* ( str, Node ) -> new Node

	Maybe way to do image size to maximize image http://jsfiddle.net/0bmws0me/1/
	(from TheP... something), but maybe we want the images to be their proper size?
	*/

		// var imgContainer 		= document.createElement('div');
		// parentNode.appendChild( imgContainer );
		// imgContainer.className 	= prefix + ' image-choice-container';

		var imgNode = adder.addImage( imgFilePath, parentNode );
		$(imgNode).addClass('image-choice');
		// var imgNode 				= document.createElement('img');
		// // imgContainer.appendChild( img );
		// parentNode.appendChild( imgNode );
		// imgNode.className 			= prefix + ' image-choice';
		// imgNode.src 				= imgFilePath;
		// No id?
		// Will use src of clicked image to add correct image
		// No label?

		// TODO: add when clicked

		// return imgContainer;
		return imgNode;
	}  // End adder.addChoice()


	adder.numCols = 5;
	adder.addImgRow 		= function ( rowNum, allImgObjs, parentNode ) {
	/*
	* 
	* Adds a row of image nodes to the imagePicker node, adds a row array
	* to the adder.imgGrid.
	*/

		var rowNode 		= document.createElement( 'div' );
		rowNode.className 	= 'image-picker-row';
		rowNode.id 			= 'picker_row_' + rowNum;

		// This is what the grid will actully use to access selections
		var rowArray 		= [];

		var numCols = adder.numCols;
		for ( var coli = 0; coli < numCols; coli++ ) {
			// Mathematically get the index using the column and row
			var cellNum = coli + ( numCols * rowNum );
			var img 	= allImgObjs[ cellNum ];

			// For when we run out of images early at the end
			if ( img !== undefined ) {
				var filePath 	= img.folderPath + img.fileName;
				var imgNode 	= adder.addImageChoice( filePath, rowNode );

				rowArray.push( imgNode );
			}
		}

		adder.imgGrid.push( rowArray );
		parentNode.appendChild( rowNode );

		return rowArray;
	};  // End adder.addImgRow()


	adder.addGrid = function ( allImgObjs, parentNode ) {
		adder.imgGrid = [];

		// Get the right number of rows for the given number of images
		var numRows = Math.ceil( allImgObjs.length / adder.numCols )
		for ( var rowi = 0; rowi < numRows; rowi++ ) {
			adder.addImgRow( rowi, allImgObjs, parentNode );
		}

		return adder.imgGrid;
	};  // End adder.addGrid()


	adder.imgGrid = [];
	adder.addImagePicker 	= function ( parentNode ) {
	/*
	* 
	* Offers a selection of types for new icons
	*/
		// --- PICKER --- \\
		var imagePicker 			= adder.createPicker( 'images' );  // In adder.js atm
		adder.modes.images.section 	= imagePicker;
		parentNode.appendChild( imagePicker );

		// Add images to the DOM (will also add custom images in future)
		adder.modes.images.choices 	= adder.defaultImages;
		adder.addGrid( adder.modes.images.choices, imagePicker );

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
