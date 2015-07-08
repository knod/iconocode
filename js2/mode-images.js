/* mode-images.js
* 
* Creates everything to do with the images mode?
* 
* Affects:
* adder.modes.images - { tab: null, section: null, choices: [] }
* Makes use of:
* adder.sections 	= { tabs: null, viewer: null, pickers: null };
* 
* TODO:
* - For grid navigation with scrolling, checkout:
* 	http://stackoverflow.com/questions/4884839/how-do-i-get-a-element-to-scroll-into-view-using-jquery
* 	or https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
* - Look at js .scrollIntoView() or jQuery $.scrollTo()
* 	- I think .focus() takes care of the scrolling
* - When a term is too long, the second to last letter should be '-' and the rest of
* 	the word should be hidden. When hovered over or selected with the keyboard,
* 	the rest of the word should appear (as should the other search terms or matches).
* 	That sounds super complicated.
* - Handle semicolon being added by user into the text of the 'searchBar'
* 
* DONE:
* - Convert to select image container instead of image itself
* - Hovering should do the same thing as navigating to a choice with the keyboard does
* - !!!: Semicolon appearing when image is selected while no text is in the search bar
* 
* ??:
* - How to replace a whole token instead of just a word? Maybe turn it into a
* 	single word first and then erase it? In that case, maybe when the user
* 	deletes the icon, don't show the text from before because that will
* 	require remembering what the text looked like before the switch.
* 
* Notes:
* - With codemirror flattenSpans set to true (by default), I can add a class to a
* 	set of consecutive words by marking them with .markText(). I'm not sure if I
* 	can then get that text as a token, but I can at least get the text from
* 	inside that class and use it for searching, or for showing when an image (or,
* 	in future, icon) is deleted. Just don't add any styles to the .markText() class
* 	- I think I need individual spans in order to be able to do this, which, right
* 	now, means javascript mode.
*/

'use strict'

adder.addImageMode 	= function () {
/* Enclose and name so it can be called in order */

	adder.imageChoices = [];

	// ====================
	// Choosing
	// ====================
	adder.chooseImage = function ( imgNode ) {
	/* ( node ) -> ?

	Hide text and show image where text was
	Returns new node? what does it return?

	!!!: Now not working at beginning of search bar! wtf?!
	*/
		var newNode 		= document.createElement('img');
		newNode.className 	= 'icon-part'
		// Not implemented yet. Not necessary? Or do we want access to the search terms?
		// newNode.dataset['object'] = imgNode.dataset['object'];

		// Set same image file path
		var filePath 	 = $(imgNode).attr('src');
		newNode.src 	 = filePath;

		// Add data (terms and name, I think)
		$(newNode).data('terms', $(imgNode).data('terms'));
		$(newNode).data('name', $(imgNode).data('name'));

		// ===================
		// EDITOR CONTENTS
		// ===================
		// --- GET SEARCH TERMS --- \\
		var editor 		= adder.viewer;
		var cursorPos 	= editor.getCursor();

		// There is only one line
		var token 		= editor.getTokenAt( cursorPos );

		// Fix not being able to replace token when at/before the start of token
		if ( token.string === '' ) {
			cursorPos.ch 	+= 1;
			token 			= editor.getTokenAt( cursorPos );
		}

		var start 	= { line: 0, ch: token.start },
			end 	= { line: 0, ch: token.end };

		// Make sure the token is ended appropriately
		editor.replaceRange( ';', end, end );
		// Get the new end of the token, including the end symbol
		// ??: I don't remember why I have to get the cursor again
		token 	= editor.getTokenAt( editor.getCursor() );  // Why does this not end up at original cursorPos?
		end 	= { line: 0, ch: token.end };
		start 	= { line: 0, ch: token.start };  // Is this needed?

		// --- PLACE MARKER --- \\
		var inViewer 	= editor.markText( start, end,
			// I don't think classname matters when using 'replaceWith'
			{className: 'chosen-image', replacedWith: newNode
				// clearOnEnter doesn't unclear on exit, need other way
				// , clearOnEnter: true  // experiment
				, handleMouseEvents: 	true // think I will need this
				, addToHistory: 		true
			}
		);

		// Trigger saving for undo, I hope, and resizing of fake icon container
		CodeMirror.signal(adder.viewer, 'change' );

		// ===================
		// RE-FOCUS
		// ===================
		// Bring everything back to where it last was in the search bar
		adder.backToSearchbar( adder.viewer );

		return inViewer;
	};  // End adder.chooseImage()


	// ====================
	// Navigation
	// ====================

	adder.backToSearchbar = function ( cmEditor ) {
		cmEditor.focus();  // assigned in viewer.js
		// TODO: put cursor in a logical place. Not sure how CodeMirror does that.
		return $('.selected').removeClass('selected');
	};  // End adder.backToSearchbar()


	// =============
	// PICKER
	// =============

	// --- GRID --- \\
	adder.imgGrid = [];
	adder.numCols = 5;
	adder.numRows;

	adder.updateImageGrid 	= function ( imageArray ) {

		var maxCols = 5;
		adder.imageGridObj.set( 'images', maxCols, imageArray );

		return adder.imageGridObj;
	};  // End adder.updateGrid()


	adder.imageGridObj;
	adder.addGrid = function ( allImgObjs, parentNode ) {

		var maxCols 			= 5,
			allImageObjs 		= adder.defaultImages,
			imageChoicesNodes 	= [];

		for ( var imgi = 0; imgi < allImageObjs.length; imgi++ ) {
			var imgObj = allImageObjs[ imgi ]
			var parent = document.createDocumentFragment();

			var imgChoice 	= new adder.ImgChoice2( imgObj, parent );
			imageChoicesNodes.push( imgChoice.node );
		}

		// Now this is being kept in two places (also in adder.modes[ modeName ].grid)
		adder.imageGridObj = new adder.Grid( 'images', maxCols, imageChoicesNodes );

		return adder.imageGridObj;
	};  // End adder.addGrid()


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
		adder.addGrid( adder.modes.images.choices, imagePicker );


		imagePicker.addEventListener( 'mouseover', function ( evnt ) {

			var $target 	= $(evnt.target);
			var $ancestor 	= $target.closest('.image-choice-container');

			// Visually indicate selection of image
			if ( $ancestor.length > 0 ) {
				adder.imageGridObj.selectChoice( $ancestor[0] );
			}
			// TODO: Show all matching terms at full length

		} );

		imagePicker.addEventListener( 'click', function ( evnt ) {

			var $target 	= $(evnt.target);
			var $ancestor 	= $target.closest('.image-choice-container');

			if ( $ancestor.length > 0 ) {
				adder.chooseImage($ancestor.find('.image-choice')[0]);
			}

		} );


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
