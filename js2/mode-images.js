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

	// ====================
	// Navigation
	// ====================
	// http://jsfiddle.net/g9HMf/3/ - has a problem with scrolling
	adder.selectImg = function ( imgNode ) {
	/*

	*/
		$('.image-choice.selected').removeClass('selected');
		$(imgNode).addClass('selected');
		// $('.image-choice.selected')[0].contentWindow.focus();
		// $($('.image-choice.selected')[0]).attr('tabIndex', 0);
		// console.log($(":focus"))

	};  // adder.selectImg();


	adder.deselectAllImages = function () {
		$('.image-choice.selected').removeClass('selected');
	};  // End adder.deselectAllImages()


	adder.getCellNode = function ( position, grid ) {
		console.trace(grid, position, grid[ position.row ])
		return grid[ position.row ][ position.col ];
	};  // End adder.getCellNode()


	adder.chooseImg = function ( imgNode ) {

		var filePath = $('.image-choice.selected').attr('src');
		console.log('chooseImg():', filePath);



		// Deselect anything that's selected
		$('.image-choice.selected').removeClass('selected');

	};  // End adder.chooseImg()


	adder.position;
	adder.selectImgByPos = function ( position, grid ) {

		// Change the nodes
		var node = adder.getCellNode( position, adder.imgGrid );
		adder.selectImg( node );

		return position;
	};  // End adder.selectImgByPos()


	adder.activateKeyboardNav = function ( grid ) {
	/*

	Trigger this when the user wants to navigate the choices with the keyboard
	(Triggered by 'tab' kyepress?)
	*/

		// Take focus off of wherever it is that has focus

		$(':focus').blur();  // Take focus of whatever element has focus

		adder.position = { col: 0, row: 0 };
		// Change the nodes
		adder.selectImgByPos( adder.position, grid );

		return adder.position;
	};  // adder.activateKeyboardNav()


	adder.keyboardNavChoices = function ( position, direction, grid ) {
	/*

	??: How to do initial navigation to selections?

	Make universal so variable types can use it too?
	Triggered by 'tab' keypress?

	TODO: Tab should just increase the cell number
	*/
		var numCols = grid[ position.row ].length

		if 		( direction === 'right' ) 	{ position.col++ }
		else if ( direction === 'left' ) 	{ position.col-- }
		else if ( direction === 'down' ) 	{ position.row++ }
		else if ( direction === 'up' ) 		{ position.row-- }
		else if ( direction === 'next' ) 	{
			// Navigate to the next cell
			position.col++
			if ( position.col > (numCols - 1) ) {
				position.col = 0;
				position.row++;
			}
		}

		position.col = position.col % numCols;
		position.row = position.row % adder.numRows;

		// They can only ever get to -1, so the math works
		if ( position.col < 0 ) { position.col += numCols }
		if ( position.row < 0 ) { position.row += adder.numRows }


			// console.log(adder.imgGrid)
		var imgNode = adder.getCellNode( position, adder.imgGrid );
		if ( imgNode === undefined ) {
			position.row = adder.imgGrid.length - 1;
			position.col = adder.imgGrid[ position.row ].length - 1;
			imgNode = adder.getCellNode( position, adder.imgGrid );
		}

		adder.selectImg( imgNode );

		// // Change the nodes
		// var imgNode = adder.selectImgByPos( position, adder.imgGrid );

		// // If there was no image there, which would happen if there were
		// // more images in the row above than the row below
		// if ( imgNode === undefined ) {
		// 	position.col = numCols - 1;
		// 	imgNode = adder.selectImgByPos( position, adder.imgGrid );
		// }

		return position;
	};  // End adder.keyboardNavChoices()

	// $('.image-choice').on( 'keypress', function ( evnt ) {
	// 	console.log('bleh');

	// 	var key = evnt.keyCode || evnt.which;

	// 	var direction;
	// 	if ( key === 40) { direction = 'down' }
	// 	else if ( key === 39) { direction = 'right' }
	// 	else if ( key === 37) { direction = 'left' }
	// 	else if ( key === 38) { direction = 'up' }

	// 	adder.keyboardNavChoices( adder.position, direction, adder.imgGrid);

	// });
// document.addEventListener( 'keypress', function () { console.log(document.activeElement) } );
// document.addEventListener( 'click', function () { console.log(document.activeElement) } );

	document.addEventListener( 'keydown', function ( evnt ) {

		var key 			= evnt.keyCode || evnt.which;
		var selectedImage 	= $('.image-choice.selected')[0];

		if ( selectedImage !== undefined ) {
			var direction;

			if ( key === 40) { direction = 'down' }
			else if ( key === 39) { direction = 'right' }
			else if ( key === 37) { direction = 'left' }
			else if ( key === 38) { direction = 'up' }

			if ( direction !== undefined ) {
							if ( adder.imgGrid === undefined ) {debugger;}
				adder.keyboardNavChoices( adder.position, direction, adder.imgGrid);
			}

			// evnt.preventDefault();
			// evnt.stopPropagation();
		}


	});

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

		// imgNode.addEventListener( 'keypress', function ( evnt ) {
		// 	console.log('bleh');

		// 	var key = evnt.keyCode || evnt.which;

		// 	var direction;
		// 	if ( key === 40) { direction = 'down' }
		// 	else if ( key === 39) { direction = 'right' }
		// 	else if ( key === 37) { direction = 'left' }
		// 	else if ( key === 38) { direction = 'up' }

		// 	adder.keyboardNavChoices( adder.position, direction, adder.imgGrid);

		// });

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
	adder.numRows;
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
		adder.imgGrid 	= [];

		// Get the right number of rows for the given number of images
		adder.numRows 	= Math.ceil( allImgObjs.length / adder.numCols )
		var numRows 	= adder.numRows;
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
