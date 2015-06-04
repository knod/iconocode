/* mode-images.js

Creates everything to do with the images mode?

TODO:
- For grid navigation with scrolling, checkout:
	http://stackoverflow.com/questions/4884839/how-do-i-get-a-element-to-scroll-into-view-using-jquery
	or https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView



Affects:
adder.modes.images - { tab: null, section: null, choices: [] }

Makes use of:
adder.sections 	= { tabs: null, viewer: null, pickers: null };
*/

'use strict'

adder.addImageMode 	= function () {
/* Enclose and name so it can be called in order */

	// ====================
	// Choosing
	// ====================
	adder.chooseImg = function ( imgNode ) {

		var filePath = imgNode.attr('src');
		console.log('chooseImg():', filePath);



		// Deselect anything that's selected
		// $('.image-choice.selected').removeClass('selected');
		return imgNode;
	};  // End adder.chooseImg()


	// ====================
	// Navigation
	// ====================
	// http://jsfiddle.net/g9HMf/3/ - has a problem with scrolling
	adder.selectImg = function ( imgNode ) {
	/*

	*/
		$('.image-choice.selected').removeClass('selected');
		$(imgNode).addClass('selected');
		// Takes focus off of last thing, puts it on this thing
		imgNode.focus();
		return imgNode;
	};  // adder.selectImg();


	adder.deselectAllImageChoices = function () {
	// Not sure this is needed anymore
		return $('.image-choice.selected').removeClass('selected');
	};  // End adder.deselectAllImageChoices()


	adder.backToSearcbar = function ( selectedElem ) {
		adder.searchBar.focus();
		return $(selectedElem).removeClass('selected');
	};  // End adder.backToSearcbar()


	adder.getCellNode = function ( position, grid ) {
		return grid[ position.row ][ position.col ];
	};  // End adder.getCellNode()


	adder.position;
	adder.selectImgByPos = function ( position, grid ) {
		// Change the nodes
		var node = adder.getCellNode( position, adder.imgGrid );
		adder.selectImg( node );

		return node;
	};  // End adder.selectImgByPos()

	adder.choicesJustActivated;
	adder.searchBar;
	adder.activateKeyboardNav = function ( grid ) {
	/*

	Trigger this when the user wants to navigate the choices with the keyboard
	(Triggered by 'tab' kyepress?)

	Holy moly focus: http://jsfiddle.net/bnr5xnc7/4/
	TODO: Implement that ASAP

	*/
		adder.searchBar = $(':focus')[0];
		adder.position = { col: 0, row: 0 };
		// Change the nodes
		// Maybe this function should be taken out. This is the only
		// place it's used so far
		// This will remove focus from the editor
		adder.selectImgByPos( adder.position, grid );

		// Prevent 'tab' from going to the next element on the
		// first press... how...?
		adder.choicesJustActivated = true;

		return adder.position;
	};  // adder.activateKeyboardNav()


	var incrementPosition 	= function ( position, direction, numCols ) {
	/* ( {}, str ) -> {}

	Just changes position values based on direction, no further adjusments
	*/
		if 		( direction === 'right' ) 	{ position.col++ }
		else if ( direction === 'left' ) 	{ position.col-- }
		else if ( direction === 'down' ) 	{ position.row++ }
		else if ( direction === 'up' ) 		{ position.row-- }
		else if ( direction === 'next' ) 	{
			// // Navigate to the next cell
			// position.col++
			// // If you're at the end of a row, go to the next one
			// if ( position.col > (numCols - 1) ) {
			// 	position.col = 0;
			// 	position.row++;
			// }
			// ??: There must be a more clever way to do this. Something with:?
			// var cellNum = coli + ( numCols * rowNum );
			var newColPos 	= position.col + 1;
			// One above 0-index numCols will result in 1, all others in 0
			position.row 	+= Math.max( 0, (newColPos - (numCols - 1)) );
			position.col 	= newColPos % numCols;
		}

		return position;
	};  // End incrementPosition()


	adder.keyboardNavChoices = function ( position, direction, grid ) {
	/*

	??: How to do initial navigation to selections?

	Make universal so variable types can use it too?
	Triggered by 'tab' keypress?

	TODO: Tab should just increase the cell number
	*/
		var numCols = grid[ position.row ].length

		position = incrementPosition( position, direction, numCols );

		position.col = position.col % numCols;
		position.row = position.row % adder.numRows;

		// They can only ever get to -1, so the math works
		if ( position.col < 0 ) { position.col += numCols }
		if ( position.row < 0 ) { position.row += adder.numRows }

		var imgNode = adder.getCellNode( position, adder.imgGrid );
		// If we've hit a position that doesn't exist in the grid
		if ( imgNode === undefined ) {
			// Go to the last existing position in the grid
			position.row = adder.imgGrid.length - 1;
			position.col = adder.imgGrid[ position.row ].length - 1;
			imgNode = adder.getCellNode( position, adder.imgGrid );
		}

		adder.selectImg( imgNode );

		return position;
	};  // End adder.keyboardNavChoices()

	// document.addEventListener( 'keypress', function () { console.log(document.activeElement) } );
	// document.addEventListener( 'click', function () { console.log(document.activeElement) } );

	adder.imgKeyHandler = function ( evnt ) {
	/* ( int ) -> Node
	Navigating through image choices. Maybe through any choices,
	with the keyboard
	Can just be var?
	*/
		var key 			= evnt.keyCode || evnt.which;
		var selectedImage 	= $('.image-choice.selected')[0];

		if ( selectedImage !== undefined ) {
			// Prevents tab from cycling through other DOM stuff
			evnt.preventDefault();

			var direction;

			if ( key === 40) { direction = 'down' }
			else if ( key === 39) { direction = 'right' }
			else if ( key === 37) { direction = 'left' }
			else if ( key === 38) { direction = 'up' }
			else if ( key ===  9) { // tab			
			// TODO: ??: Didn't I want tab to tab through modes and modes' modes? How do I
			// not have tabbings interfere with each other?

				// Maybe something about fixing focus changed this, but now this
				// state check seems to malfunction. With the check, tab
				// has to be pressed twice to work. Why is this?

				// Don't move if it's the tab that activates the choice selection
				// if ( adder.choicesJustActivated !== true ) {
					direction = 'next';
				// } else {
				// 	adder.choicesJustActivated = false;
				// 	console.log(false);
				// }
			} else if (key === 13) { // Enter
				// Get selected image before removing that marker
				var selectedImage = $('.image-choice.selected')[0]

				// Bring everything back to where it last was in the search bar
				adder.backToSearcbar( selectedImage );
				// Add the icon to the viewer in place of whatever text is there
				adder.chooseImg( selectedImage );

			} else if (key === 27) { // ESC
				// Just bring everything back to the search bar
				adder.backToSearcbar( selectedImage );
			}

			if ( direction !== undefined ) {
				adder.keyboardNavChoices( adder.position, direction, adder.imgGrid);
			}
		}

		return $('.image-choice.selected')[0];
	};  // End adder.imgKeyHandler


	// document.addEventListener( 'keydown', function ( evnt ) {
	// 	adder.imgKeyHandler( evnt );
	// });

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

		// Allows image to recieve focus (not a usual thing for images)
		imgNode.tabIndex = '0';
		// No id?
		// Will use src of clicked image to add correct image
		// No label?

		// TODO: add when clicked
		imgNode.addEventListener( 'keydown', function ( evnt ) {
			adder.imgKeyHandler( evnt );
		});

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
