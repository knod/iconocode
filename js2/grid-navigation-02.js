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
/*
* thisGrid.lastPosition must be of form {row: int, y: int}
*/

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
	/* ( {row, col} ) -> Node
	* 
	* Get the node at the current position. If there isn't one
	* there, scroll to where there will be a node and update the grid
	* to show the nodes at that position, _then_ get the node
	*/
		var cellId 	  = modeName_ + '_choice_row' + position.row + '_col' + position.col,
			choiceNode = document.getElementById( cellId );

		// If that node doesn't exist right now (it's not scrolled to atm), scroll there
		if ( choiceNode === null ) {
			var heightPer = thisGrid.rowBlueprint.height + thisGrid.rowBlueprint.vertMargin;
			// I don't think this triggers a scroll event
			thisGrid.scrollable.scrollTop = position.row * heightPer;  // I think this is blocking
			// Not sure this is the right row num (0-indexed or not?), but it should be fine anyway? Not sure
			thisGrid.update( position.row, false );
		}

		choiceNode 		= document.getElementById( cellId );
		var container 	= $(choiceNode).closest('.icd-choice-container');

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
	* 
	* Just changes position values based on direction, no further adjusments
	* (no wrapping or anything)
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
	* 
	* Works for rows or columms, makes sure the numbers wrap around
	* ??: What does lastPossiblePos mean? Is it 0-indexed? I think
	* it is required to be 0-indexed?
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
	/* ( {JS}, str ) -> same {JS}
	* 
	* Allows keyboard navigation and selection of images
	* 
	* TODO: Make universal so Variable Types can use it too?
	* ??: Triggered by 'tab' keypress?
	* ??: 'tab' navigation wraps around last row over and over. Is that what we want?
	*/
		// Stay in bounds
		var dimensions 		= thisGrid.dimensions;  // { numRows, numCols, numItems, numColsLastRow };

		// So we can compare the previous row number to the current row number later
		var prevRowNum 		= position.row;
		// Don't worry about wrapping around for now
		var currPosition 	= incrementPosition( position, direction, dimensions.numCols );
		var currRowNum 		= currPosition.row,
			currColNum 		= currPosition.col;

		// ==================
		// STAY IN BOUNDS
		// ==================
		// --- WRAP ROW --- \\
		currRowNum = wrapPosition( currRowNum, (dimensions.numRows - 1) );

		// --- HANDLE COLUMN --- \\
		// Last row is a special case. If it's the last row, 
		if ( currRowNum === (dimensions.numRows - 1)  ) {
			// and we got there by pressing up or down from another row
			if ( currRowNum !== prevRowNum ) {
				// Make sure we don't go into a column that doesn't exist by
				// not going above the max number of columns in the last row
				// -1 because numColsLastRow is not 0-indexed
				currColNum = Math.min( currColNum, (dimensions.numColsLastRow - 1) );
			// but if we're just moving left or right in the last row,
			} else {
				// wraps around using the number of columns in the last row
				currColNum = wrapPosition( currColNum, (dimensions.numColsLastRow - 1) );
			}
		// If we're not in the last row,
		} else {
			// wrap around using the number of columns in a full row
			currColNum = wrapPosition( currColNum, (dimensions.numCols - 1) );
		}


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
