/* mode-images.js

Creates everything to do with the images mode?
Effects:
adder.modes.images - { tab: null, section: null, choices: [] }

Makes use of:
adder.sections 	= { tabs: null, viewer: null, pickers: null };

TODO:
	NOW:
- !!! Convert to hide and rearrange images instead of removing them from the DOM
	LATER:
- For grid navigation with scrolling, checkout:
	http://stackoverflow.com/questions/4884839/how-do-i-get-a-element-to-scroll-into-view-using-jquery
	or https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
- Look at js .scrollIntoView() or jQuery $.scrollTo()
- Convert to select image container instead of image itself
- Hovering should do the same thing as navigating to a choice with the keyboard does
- When a term is too long, the second to last letter should be '-' and the rest of
	the word should be hidden. When hovered over or selected with the keyboard,
	the rest of the word should appear (as should the other search terms or matches).
	That sounds super complicated.
- Make images and grid separately, so image nodes can be handed to .setGrid().


??:
- How to replace a whole token instead of just a word? Maybe turn it into a
	single word first and then erase it? In that case, maybe when the user
	deletes the icon, don't show the text from before because that will
	require remembering what the text looked like before the switch.

Notes:
- With codemirror flattenSpans set to true (by default), I can add a class to a
	set of consecutive words by marking them with .markText(). I'm not sure if I
	can then get that text as a token, but I can at least get the text from
	inside that class and use it for searching, or for showing when an image (or,
	in future, icon) is deleted. Just don't add any styles to the .markText() class
	- I think I need individual spans in order to be able to do this, which, right
	now, means javascript mode.
*/

'use strict'

adder.addImageMode 	= function () {
/* Enclose and name so it can be called in order */

	// ====================
	// Choosing
	// ====================
	adder.chooseImg = function ( imgNode ) {
	/* ( node ) -> ?

	Hide text and show image where text was
	Returns new node? what does it return?
	*/
		// --- DOM NODE --- \\
		var newNode 		= document.createElement('img');
		newNode.className 	= 'icon-part'
		// Not implemented yet. Not necessary? Or do we want access to the search terms?
		// newNode.dataset['object'] = imgNode.dataset['object'];
		// Where to get the image
		var filePath 		= $(imgNode).attr('src');
		newNode.src 		= filePath;

		// --- CODEMIRROR EDITOR --- \\
		var editor 		= adder.viewer;
		var wordRange 	= editor.findWordAt( editor.getCursor() );
		// var word 		= editor.getRange( wordRange.anchor, wordRange.head );
		// console.log(word);
		// If .markText() is used, editor.getTokenAt({line: #, ch: #})
		// will still get the correct text. Marker doesn't interfere with that.
		var inViewer 	= editor.markText( wordRange.anchor, wordRange.head,
			// I don't think classname matters when using 'replaceWith'
			{className: 'chosen-image', replacedWith: newNode
				// TODO: clearOnEnter doesn't unclear on exit, need other way
				// Look at http://codemirror.net/doc/manual.html#events ('beforeCursorEnter' and 'clear')
				// Also cm.findMarks({},{})[0].lines[0].text
				// , clearOnEnter: true  // experiment
				, handleMouseEvents: true // think I will need this
				, addToHistory: true
			}
		);

		return inViewer;
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

		// // Prevent 'tab' from going to the next element on the
		// // first press... how...?

		// // Maybe something about fixing focus changed this, but now this
		// // state check seems to malfunction. With the check, tab
		// // has to be pressed twice to work. Why is this?
		// adder.choicesJustActivated = true;

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
			// Navigate to the next cell

			// position.col++
			// // If you're at the end of a row, go to the first position in the next one
			// if ( position.col > (numCols - 1) ) { position.row++; position.col = 0; }

			// ??: More clever, less clear?
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

	TODO: Move this into ImageChoice.js
	*/
		var key 			= evnt.keyCode || evnt.which;
		// TODO: try using target instead;
		var selectedImage 	= $('.image-choice.selected')[0];

		if ( selectedImage !== undefined ) {
			// Prevents tab from cycling through other DOM stuff
			evnt.preventDefault();

			var direction;

			if ( key === 40) { direction = 'down' }
			else if ( key === 39) { direction = 'right' }
			else if ( key === 37) { direction = 'left' }
			else if ( key === 38) { direction = 'up' }
			// TODO: ??: Didn't I want tab to tab through modes and modes' modes? How do I
			// not have tabbings interfere with each other
			else if ( key ===  9) { direction = 'next'; }  // tab
			else if ( key === 13) { // Enter
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

	/**/


	// =============
	// PICKER
	// =============

	// --- GRID --- \\
	// TODO: ??: Problem, we're doing two things here, building a js
	// array grid and building the DOM. We need to figure out how to just pick one

	adder.numCols = 5;
	adder.numRows;

	adder.imgGrid = [];
	adder.originalImageChoiceNodes 	= []

	adder.createImageChoiceNodes = function ( imgObjects ) {
	/* ( [{}] ) -> [ Node ]
	* 
	* Creates an array of all the nodes. Individual arrays for
	* filtered choices will be made separately later
	*/

		for ( var obji = 0; obji < imgObjects.length; obji++ ) {
			var imgObj 			= imgObjects[ obji ];
			var imgChoiceObj 	= new adder.ImgChoice( imgObj )
			var imgNode 		= imgChoiceObj.image;

			adder.originalImageChoiceNodes.push( imgNode );
		}

		// When you need the container, get the parent
		return adder.originalImageChoiceNodes;
	};  // End adder.createImageChoiceNodes()


	adder.addCell 		= function ( pos, imgNodes, rowNode, rowArray ) {
	/* ( {col:, row:}, [Node], Node ) -> Node

	Can be used by both .addImageRow and .setImageRow
	Returns what? Cell node? Row node?
	*/
		// Mathematically get the index using the column and row
		var cellNum 	= pos.col + ( adder.numCols * pos.row );
		var imgNode 	= imgNodes[ cellNum ];

		// At the end, when we run out of images, skip this
		if ( imgNode !== undefined ) {
			var imgContainer 	= imgNode.parentNode;
			// Not great. This is the only node that has to be attached outside its instantiation
			rowNode.appendChild( imgContainer );
			// Because this is in this 'if', we can't do it in .setImgRow()
			rowArray.push( imgNode );
		}

		return imgNode;
	};  // End adder.addCell()


	adder.setImageRow 		= function ( rowNum, imgNodes ) {
	/*
	* 
	* Puts imgNodes in each row by order of appearance.
	*/
		var rowNode = document.getElementById( ('picker_row_' + rowNum) );
		// This is what the grid will actully use to access selections
		var rowArray 		= [];

		var numCols_ = adder.numCols;
		for ( var coli = 0; coli < numCols_; coli++ ) {
			adder.addCell( {col: coli, row: rowNum}, imgNodes,
													rowNode, rowArray );
		}

		return rowArray;
	};  // End adder.setImageRow()


	adder.setGrid 			= function ( imgNodes, grid ) {
	/* ( [Node], Node ) -> [[Node]]
	* 
	* Sets up a grid each time based on the order of imgNodes in their array.
	* Would it be better to not have to pass in a parent node?
	*/
		grid = [];

		// Get the right number of rows for the given number of images
		// (in case this has changed. Not sure how to handle that change though)
		adder.numRows 	= Math.ceil( imgNodes.length / adder.numCols )
		var numRows 	= adder.numRows;
		for ( var rowi = 0; rowi < numRows; rowi++ ) {

			var row = adder.setImageRow( rowi, imgNodes );
			grid.push(row);

		}

		return grid;
	};  // End adder.setGrid()


	adder.addImageRow 		= function ( rowNum, parentNode ) {
	/*
	* 
	* Just adds row elements
	*/
		var rowNode 		= document.createElement( 'div' );
		parentNode.appendChild( rowNode );
		rowNode.className 	= 'image-picker-row';
		rowNode.id 			= 'picker_row_' + rowNum;

		return rowNode;
	};  // End adder.addImageRow()


	adder.createGrid 			= function ( imgNodes, parentNode ) {
	/* ( [Node], Node ) -> [[Node]]
	* 
	* Same as .setGrid(), just for initial creation because that has to be separate
	*/
		adder.imgGrid 	= [];

		// Get the right number of rows for the given number of images
		adder.numRows 	= Math.ceil( imgNodes.length / adder.numCols )
		var numRows 	= adder.numRows;
		for ( var rowi = 0; rowi < numRows; rowi++ ) {
			adder.addImageRow( rowi, parentNode );
		}
		adder.imgGrid = adder.setGrid( imgNodes );

		return adder.imgGrid;
	};  // End adder.createGrid()


	// --- PICKER --- \\
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
		var imgObjs 				= adder.modes.images.choices;
		var imgChoiceNodes 			= adder.createImageChoiceNodes( imgObjs );
		// Create a grid using an array of all the image elements
		adder.createGrid( imgChoiceNodes, imagePicker );

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
		);  // in tab utils
		parent.appendChild( typeTab );

		return typeTab;
	};  // End adder.addImageTab()



	// ==================
	// START STUFF
	// ==================
	adder.addImagePicker( adder.sections.pickers );
	adder.addImageTab( adder.sections.tabs );
};  // End adder.addTypeMode()
