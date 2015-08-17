/* grid-navigation-02.js
* 
* ADDS NEW PROPERTIES TO EXISTING OBJECT
* 
* Sets Grid object properties for navigation of the grid
* (using just keyboard input, or also mouse?)
* 
* Just wanted to break Grid up into different files
* 
* Affects: Grid
* Makes use of: arguments
* 
* TODO:
* - If only one icon matches a search, automatically select that
* 	icon (but then focus would have to be on that element and
* 	pressing 'delete' would need to refocus in search bar?)
* - Starting to type actual letters should put you in the
* 	searchbar, with those letters typed in?
* - Update grid position based on mouse movement too
* 
* 
* Pseudo Code:
* - Account for scrolling somehow? Should down-arrow, put
*/

adder.setupGridNavigation02 = function ( thisGrid, modeName_ ) {

	// ====================
	// Navigation
	// ====================
	// http://jsfiddle.net/g9HMf/3/ - has a problem with scrolling

	thisGrid.selectChoice = function ( choiceContainer ) {
	/*

	*/
		// Unselect the curretnly selected element
		$('#icd_' + modeName_ + '_picker .selected').removeClass('selected');

		// Select the desired element
		var $choiceContainer = $(choiceContainer);
		$choiceContainer.addClass('selected');

		// Takes focus off of last thing, puts it on this thing's actual choice
		var infoHolder = $choiceContainer.find('.icd-adder-choice')[0];
		infoHolder.focus();

		return choiceContainer;
	};  // thisGrid.selectChoice();


	// Should keep this in here? It's kind of more general
	// thisGrid.backToSearchbar = function ( cmEditor ) {
	// 	cmEditor.focus();  // assigned in viewer.js
	// 	// TODO: put cursor in a logical place. Not sure how CodeMirror does that.
	// 	return $('.selected').removeClass('selected');
	// };  // End thisGrid.backToSearchbar()


	thisGrid.getCellNode = function ( position ) {
		var cellId 	  = modeName_ + '_choice_row' + position.row + '_col' + position.col,
			choicNode = document.getElementById( cellId ),
			container = $(choicNode).closest('.icd-choice-container');

		return container;
	};  // End thisGrid.getCellNode()


	thisGrid.position;
	thisGrid.selectChoiceByPos = function ( position ) {
		// Change the nodes
		var node = thisGrid.getCellNode( position );
		thisGrid.selectChoice( node );

		return node;
	};  // End thisGrid.selectChoiceByPos()


	thisGrid.activateKeyboardNav = function () {
	/*

	CALLED BY SEARCH BAR

	Trigger this when the user wants to navigate the choices with the keyboard
	(Triggered by 'tab' kyepress?)

	Holy moly focus: http://jsfiddle.net/bnr5xnc7/4/

	*/
		thisGrid.position = { col: 0, row: 0 };
		// Change the nodes. Will remove focus from the editor
		// Maybe this function should be taken out. This is the only
		// place it's used so far
		thisGrid.selectChoiceByPos( thisGrid.position );

		// // Prevent 'tab' from going to the next element on the
		// // first press... how...?

		// // Maybe something about fixing focus changed this, but now this
		// // state check seems to malfunction. With the check, tab
		// // has to be pressed twice to work. Why is this?
		// thisGrid.choicesJustActivated = true;

		return thisGrid.position;
	};  // thisGrid.activateKeyboardNav()


	// =================
	// POSITION VALUES
	// =================
	var incrementPosition 	= function ( position, direction, numCols ) {
	/* ( {}, str ) -> {}

	Just changes position values based on direction, no further adjusments
	*/
		// Don't change actual position values, need the old ones
		var newPos = { col: position.col, row: position.row };

		if 		( direction === 'right' ) 	{ newPos.col++ }
		else if ( direction === 'left' ) 	{ newPos.col-- }
		else if ( direction === 'down' ) 	{ newPos.row++ }
		else if ( direction === 'up' ) 		{ newPos.row-- }
		else if ( direction === 'next' ) 	{
			newPos.col++
			// If you're at the end of a row, go to the first position in the next one
			if ( newPos.col > (numCols - 1) ) { newPos.row++; newPos.col = 0; }
		}

		return newPos;
	};  // End incrementPosition()


	var wrapPosition = function ( currPos, lastPossiblePos ) {
	/* ( int, int ) -> Int

	Works for rows or columms, makes sure the numbers wrap around
	*/
		var newPos 	= currPos;
		// If currPos is before the beginning, put it at the end
		if ( currPos < 0 ) { newPos = lastPossiblePos; }
		// If the lastPossiblePos is exceeded, go to the first item
		// Want to use +1 for modulo. Try out the math if you don't believe me.
		newPos 		= newPos % (lastPossiblePos + 1);

		return newPos;
	};  // End wrapPosition()


	// ====================
	// USE INPUT
	// ====================
	thisGrid.keyboardNavChoices = function ( position, direction ) {
	/* ( {}, str, [[Node]] ) -> {}

	Allows keyboard navigation and selection of images

	TODO: Make universal so Variable Types can use it too?
	??: Triggered by 'tab' keypress?
	*/

		// Need max number of columns for navigation with tab key to work
		var maxCols 		= $('#' + modeName_ + '_choice_row' + position.row).children().toArray().length;
		// So we can compare the previous row number to the current row number later
		var prevRowNum 		= position.row;
		// If the row gotten is the last row and has fewer than the full number of columns
		// incrementpPosition() will bring the column number to the beginning of the column

		var currPosition 	= incrementPosition( position, direction, maxCols );
		var currRowNum 		= currPosition.row, currColNum = currPosition.col;

		// ==================
		// ROW
		// ==================
		// Make sure not to go past the last row with visible elements
		// Use row 0 so that we know we're using a valid row number
		var $choicePicker 	= $('#' + modeName_ + '_choice_row0').parent();
 		// Contingency for no nodes being visible
		var $lastVisibleCont = $choicePicker.find('.icd-choice-container:visible:last'),
			lastRowNum 		 = parseInt($lastVisibleCont.data( 'row' ));  // Need to parse int?

		currRowNum = wrapPosition( currRowNum, lastRowNum );

		// ==================
		// COL
		// ==================
		// Now use the number of columns in the correct row (is there a shorter way?)
		var $lastRowCont 		= $('#' + modeName_ + '_choice_row' + currRowNum).find('.icd-choice-container:visible:last'),
			lastColNum 			= $lastRowCont.data('col');

		// Basically, in case user pressed up or down to get to the last row
		// Without this the modulo thing below will do things we don't want
		if ( currRowNum !== prevRowNum ) {
			// If the previous selection was past the last possible item in this row
			if ( currColNum > lastColNum ) {
				// Go to the last possible item
				currColNum = lastColNum
			}
		}

		currColNum = wrapPosition( currColNum, lastColNum );


		// ==================
		// USE NEW VALUES
		// ==================
		// Set persistent values of object
		position.row = currRowNum; position.col = currColNum;
		// Use object values to get correct node
		var choiceNode = thisGrid.getCellNode( position );
		thisGrid.selectChoice( choiceNode );

		return position;
	};  // End thisGrid.keyboardNavChoices()


	thisGrid.gridKeyHandler = function ( evnt, choosingFunc ) {
	/* ( int ) -> Node
	Navigating through image choices. Maybe through any choices,
	with the keyboard
	Can just be var?

	TODO: Move this into ChoiceChoice.js or Grid.js
	*/
		var key 			= evnt.keyCode || evnt.which;
		// TODO: try using target instead;
		var selectedChoice 	= $('#icd_' + modeName_ + '_picker .selected').find('.icd-adder-choice')[0];

		// If we're in the image picker choices section already
		if ( selectedChoice !== undefined ) {
			// adder.makeCurrentChoiceGrid( selectedChoice.parentNode.parentNode.parentNode, 'images_choice' );
			// Prevents tab from cycling through other DOM stuff
			evnt.preventDefault();

			var direction;

			if ( key === 40) { direction = 'down' }
			else if ( key === 39) { direction = 'right' }
			else if ( key === 37) { direction = 'left' }
			else if ( key === 38) { direction = 'up' }
			// TODO: ??: Didn't I want tab to tab through modes and modes' modes? How do I
			// not have tabbings interfere with each other
			else if ( key ===  9) { direction = 'next'; }  // TAB
			else if ( key === 13) { // ENTER
				// Add the icon to the viewer in place of whatever text is there
				// Will return focus to the search bar
				choosingFunc( selectedChoice );

			} else if (key === 27) { // ESC
				// Just bring everything back to the search bar
				adder.backToSearchbar( adder.viewer );  // In mode-images.js as of 06/20/15
			}

			if ( direction !== undefined ) {
				thisGrid.keyboardNavChoices( thisGrid.position, direction );
			}
		}

		return $('#icd_' + modeName_ + '_picker .selected').find('.icd-adder-choice')[0];
	};  // End thisGrid.imgKeyHandler



	return thisGrid;
};  // End adder.setupGridNavigation()
