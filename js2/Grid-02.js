/* Grid.js
* 
* Handles a grid of choices/options that are selectable and choosable
* 
* TODO:
* - How to restore choices to original order when all search text is gone?
* - Change grid navigation to work with row array instead of DOM,
* 	set selection after matching with the right row array element.
* - ???: No navigation to top from bottom and bottom from top? Would
* 	the DOM scroll the whole length of the div? (scrollTo is instantanious)
* - What happens to selection if someone scrolls the selection out of view?
* 
* DONE:
* - position absolute for rows, centered though, also, set a definite height
* - Reveal new rows on scroll
*/


adder.Grid2 = function ( currentKeys_, rowBlueprint, modeName_, makeChoiceNode_, chooseChoice_ ) {
// varName_ to know they're in the top level of this scope, clarity?
/* Psuedo code
	This should build everything, even the dom nodes, and handle navigation
	It should use the choice building function handed in

	Start grid:
		Add sizer to parent node
		Figure out the size of the parent (0 with message to type in search?)
		Add rows starting at 0
	
	Update grid:
		When:
			At start, after a search
			After scrolling
			After mouse leave element (because may leave in the middle of scroll))
		How:
			* Required: a list of current matching object id's, ranked (where is that?)
				If no matching object id's, get number of keys in all objects:
					Object.keys( objsObj ).length
			Using that, get total number of rows that could exist with all the objects
				reset height of sizer using sizes of choices
			Get current top visible row
				(based on scroll position)
			Use that to get the number values of all the rows that should exist (visible rows and buffer rows)
				Remove all old rows that don't belong
				Add any rows that don't currently exist
					Create each row:
						Use the row # and column # to get the cell #
							Use that to get the index in the list of ranked id's
						Use that index to get the actual object
						Create each choice node using the object and the callback handed in from the owner
	Row needs:
		- class 'row'
		- class: 'row-' + rowNum
		- dataset['row'] of rowNum
	Choice needs:
		- height?
	------------------
	Scroller:
		Detect top visible row
		Calculate needed rows
		if ( force === true || (currRowNum !== oldFirstRowNum && (evnt.deltaY < 100 || evnt.deltaY > -100)) ) {
			// Update grid
		}

	Grid's owner:
		Make row and choice elements from row obj array
		Rank and make choice's tags

	Searcher:
		Scroll to top
		Create ranked list of obj id's
			Search tags array for matches
			Use tags to get object id's
		If no matches, send failures

	???: How do I handle row navigation and choosing?
*/

	var newGrid = {};
	newGrid.dimensions = {};  // Will keep track of where the very last cell is
	adder.setupGridNavigation02( newGrid, modeName_ );


	// --- Nodes --- \\
	// var parentNode_ = parentNode;

	// !!!: USE THIS AS THE SIZER INSTEAD (parent is the scroller, it seems)
	newGrid.scrollable 	= document.querySelector('.adder-pickers-container');
	var scrollable_ 	= newGrid.scrollable;
	newGrid.sizer 		= null;  // Will be DOM node

	// --- Blueprints --- \\
	newGrid.rowBlueprint = rowBlueprint; // for navigation
	var rowHeight_ 		= rowBlueprint.height,
		rowMargin_ 		= rowBlueprint.vertMargin,
		numCols_ 		= rowBlueprint.numCols,
		numExisting_ 	= rowBlueprint.numExisting; // Includes buffer rows

	// Will this ever need to be recalculated? Yes, if row dimensions are changed...
	var numVisibleRows_ = scrollable_.getBoundingClientRect().height/( rowHeight_ + rowMargin_ );
	var totalNumRows_;



	// ====================
	// DATA
	// ====================
	newGrid.redrawBlueprints = function ( rowBlueprint ) {
	/* { height, margin } -> Grid */
		rowHeight_ 	= rowBlueprint.height;
		rowMargin_ 	= rowBlueprint.vertMargin;
		numCols_ 	= rowBlueprint.numCols;
		newGrid.rowBlueprint = { height: rowHeight_, vertMargin: rowMargin_, numCols: numCols_ };

		numVisibleRows_ = scrollable_.getBoundingClientRect().height/( rowHeight_ + rowMargin_ )


		return newGrid;
	};  // End newGrid.redrawBlueprints()


	var getHeightByNumRows = function( numRows ) {
	/* ( int ) -> int 
	* Re-calcuate height of sizer using sizes of choices */
		return (( numRows * (rowHeight_ + rowMargin_) ) + rowMargin_);
	};  // End getHeightByNumRows()



	// ================
	// UPDATING
	// ================
	var getTopRowNum = function ( numTopVisibleRow, totalNumRows ) {
	/* ( int ) -> int
	* 
	* Figure out which row number is actual top of the current set of rows,
	* including the buffer rows
	*/
	  // Get the row above the top visible row, our actual top row
	  // -2 is number of visible rows.
	  var topRowNum = Math.ceil( numTopVisibleRow - 
	  					( (numExisting_/2) - numVisibleRows_ ) );
	  // Don't go below 0
	  topRowNum = Math.max( 0, topRowNum );
	  // or above the max possible indexed top row (Both of these are non-0-indexed, so no -1's needed?)
	  var maxTopRow = Math.min( totalNumRows, numExisting_);
	  topRowNum = Math.min( maxTopRow, topRowNum );
	  
	  return topRowNum;
	};  // End getTopRowNum()


	var getNewRowNums = function ( topVisibleRowNum, totalNumRows ) {
	/* ( int ) -> [ints]
	* 
	* Get number id's of all rows that should be present,
	* including buffer rows.
	*/
		// Absolutely top row, including buffers.
		var topRowNum = getTopRowNum( topVisibleRowNum, totalNumRows );

		var rowNums = [];
		var currentRowNum = topRowNum;
		// Here we don't use rowCount for anything other than making sure we don't loop too much
		// It's just an iterator
		for ( var rowCount = 0; rowCount < numExisting_; rowCount++ ) {
			rowNums.push( currentRowNum );
			currentRowNum += 1;
		}

		return rowNums;
	};  // End getNewRowNums()


	// -------- DOM -------- \\
	// -- Removing -- \\
	var getCurrentRowNums = function ( rowNodes ) {
	/* ( [Nodes] ) -> [ints]
	Cycle through and get all the number values of the current rows */
		var numRows = rowNodes.length;
		var rowNums = [];
		for ( var rowi = 0; rowi < numRows; rowi++ ) {
			var rowNode = rowNodes[rowi];
			rowNums.push( parseInt( rowNode.dataset['row'] ) );
		}

		return rowNums;
	};  // End getCurrentRowNums()


	var containsSelected = function ( rowNode ) {
		var hasSelected = $(rowNode).find('.selected')[0];
		return !!hasSelected;
	};  // End containsSelected()


	var removeExcessRows = function ( newRowNums, parentNode ) {
	/* ( [ints], [ints], [Nodes] ) -> same Node
	* Doesn't really need to return anything? It just changes the DOM.
	* Don't get rid of an option that's selected, or the row it's in. That way lies madness;
	*/
		// Get an array of all the current row numbers
		var currentRows = parentNode.getElementsByClassName( modeName_ + '-picker-row');
		var currRowNums = getCurrentRowNums( currentRows );

		// Figure out which row numbers need to be removed
		var toRemove = [];
		for ( var rowi = 0; rowi < currRowNums.length; rowi++ ) {
			var rowNum = currRowNums[ rowi ];
			// If that row number isn't in the list of new row numbers
			if ( newRowNums.indexOf( rowNum ) === -1 ) {

				// and if it doesn't contain a node that has been selected by the mouse or keyboard
				var hasSelected = containsSelected( currentRows[ rowi ] );
				if ( !hasSelected ) {
					// Slate it for removal
					toRemove.push( rowNum );
				}

			}
		}  // End for every row in current row numbers array

		// Remove all the rows with those row numbers
		var numRemove = toRemove.length;  // Array length will change as we remove items from it
		for ( var numi = 0; numi < numRemove; numi++ ) {
			var num = toRemove[ numi ];
			// Get any element in the parent with that numbered row class
			// (Can't get element by id from parent, only elements by class name)
			var rowNode = document.getElementById( modeName_ + '_choice_row' + num );
			// If the row node does exist, which it should, remove it
			if ( rowNode !== null ) {
				parentNode.removeChild( rowNode );
			}
		}  // End for number of rows that need to be removed
	  
	  return parentNode;
	};  // End removeExcessRows()


	// -- Adding -- \\
	var addChoice = function ( objKey, parentRow, pos ) {
	/* 
	* 
	* Add a choice and its event listeners 
	* ??: What will 'obj' be for purpose choices?
	*/
		var choiceNode = makeChoiceNode_( objKey, parentRow );

		// Give it a cell id so it can be selected by the navigator
		var cellId = modeName_ + '_choice_row' + pos.row + '_col' + pos.col;
		choiceNode.id = cellId;
		// Give a cell its position info
		$(choiceNode).data('row', pos.row);
		$(choiceNode).data('col', pos.col);

		return choiceNode;
	};  // End addChoice()


	var makeRowNode = function ( rowNum, objIds ) {
		
		var row = document.createElement('div');

		row.className 	= modeName_ + '-picker-row ' + rowNum;
		row.id 			= modeName_ + '_choice_row' + rowNum;
		row.dataset['row'] = rowNum;
		// Height is position, rowNum is the numRows until this row
		var top = getHeightByNumRows( rowNum );

		// Temporary styling for test
		row.style.top 		= top + 'px';
		row.style.height 	= rowHeight_ + 'px';
		row.style.position = 'absolute';

		// For each column, make and add the choice in that cell
		for ( var colNum = 0; colNum < numCols_; colNum++ ) {
			// Get the index number of the id of each object we need
			var index = (rowNum * numCols_) + colNum;

			// If the index doesn't exceed the number of objects
			if ( index < objIds.length ) {
				// Get the right object key (the id # is the key)
				var key = objIds[ index ];

				// Add a choice at the current position
				var currPosition = {row: rowNum, col: colNum };
				addChoice( key, row, currPosition );

			}
		}  // end for every column

		return row;
	};  // End makeRowNode()


	var addNewRows = function ( topRowNum, objIds, parentNode ) {

		var newRowNum = topRowNum;
		for ( var rowCount = 0; rowCount < numExisting_; rowCount++ ) {

			var rowNode = document.getElementById( modeName_ + '_choice_row' + newRowNum );
			// If a row of that id isn't there add it. Doesn't matter about prepending or appending, they're all positioned absolutely

			if ( rowNode === null ) {
				var rowNode = makeRowNode( newRowNum, objIds );
				parentNode.appendChild( rowNode );
			}
			// Prepare for next iteration
			newRowNum += 1;
		}  // End for each new row

		return newGrid;
	};  // End addNewRows()




	// --- MAIN FUNCTION --- \\
	newGrid.update = function ( topVisibleRowNum, objIds ) {
	/* ( [ strs ] ) -> Grid
	* 
	* objIds: a list of current matching object id's, ranked
	* 
	* When:
	* 	At start, after a search (objs change, changing height, etc.)
	* 	After scrolling
	* 	After mouse leave element (because may leave in the middle of scroll))
	*/
		var objIds = objIds || currentKeys_;
		if ( objIds ) { currentKeys_ = objIds; }

		// Current top visible row. With this math (if not set manually), it will never exceed the max allowed.
		var topVisibleRowNum = topVisibleRowNum || Math.ceil( scrollable_.scrollTop/(rowHeight_ + rowMargin_) );
		// Do we need to do Math.max() on that?

		// Using that, get the number id 	of all the rows that should exist (visible and buffer)
		var newRowNums = getNewRowNums( topVisibleRowNum, totalNumRows_ );

		// Remove all old rows that don't belong
		removeExcessRows( newRowNums, newGrid.sizer );
		// Add any rows that don't currently exist
		addNewRows( newRowNums[0], objIds, newGrid.sizer );

		return newGrid;
	};  // End newGrid.update()


	newGrid.resizeSizer = function ( numRows ) {
	/* ( int ) -> Node */

		// Re-calcuate height of sizer using number of choices and their dimensions
		var heightStyle = getHeightByNumRows( numRows ) + 'px';
		newGrid.sizer.style.height = heightStyle;

		return newGrid.sizer;
	};  // End newGrid.resizeSizer()


	newGrid.setDimensions = function ( numObjs, numCols ) {
	/* ( int, int ) -> {JS}
	* 
	* Set the size of the sizer
	* Also, for grid navigation and, in the case of totalNumRows_), for
	* scrolling through rows
	*/
		// Set global var total number of rows that would exist with all the objects
		totalNumRows_ = Math.ceil( numObjs / numCols );
		// Resize sizer node
		newGrid.resizeSizer( totalNumRows_ );  // Always size to fit imginary full contents

		// How many are in the last row. If this is 0, the last row is full
		// For grid navigation for last row.
		var remainder = numObjs % numCols;
		var numColsLastRow;
		// If there's 0 left over, the last row must be full
		if ( remainder === 0 ) { numColsLastRow = numCols; }
		else 				   { numColsLastRow = remainder; }

		// For navigation
		newGrid.dimensions = {
			numRows: totalNumRows_, numCols: numCols, numItems: numObjs,
			numColsLastRow: numColsLastRow
		};
		
		return newGrid.dimensions;
	};  // End newGrid.setDimensions()


	newGrid.reset = function ( objIds ) {
	/* ( [str] ) -> Grid2 */

		var objIds = objIds || currentKeys_;  // If there are no objIds, just use the ones we last set, don't change
		if ( objIds ) { currentKeys_ = objIds; }  // Since there were objIds, set currentKeys_ again to match

		// Size the sizer and set the grids dimension values (and total number of rows)
		newGrid.setDimensions( objIds.length, numCols_);

		removeExcessRows( [], newGrid.sizer );  // Remove all the current rows
		
		scrollable_.scrollTop = 0;  // Go back to the top

		newGrid.update( 0, objIds );

		return newGrid;
	}  // End newGrid.reset()


	// ====================
	// SETUP (create initial content, start off logic)
	// ====================
	var setListeners = function ( container ) {
	/*
	* Uses functions from grid-navigation
	* For selection and choosing. Kind of wish we could just put it on
	* the parent. Hmmm.
	*/
		var $container = $(container);

		// Select a choice on mouseover, including setting position
		$container.on( 'mouseover', function ( evnt ) {

			var $target 	= $(evnt.target);
			var $ancestor 	= $target.closest('.icd-choice-container');

			// If there was actually a choice container there (if not on background or scrollbar)
			if ( $ancestor.length > 0 ) {
				newGrid.selectChoice( $ancestor[0] );  // Select choice
			}
			// TODO: Show all matching terms at full length

		} );

		// Choose choice with function that was handed in by creator
		$container.on( 'click', function ( evnt ) {

			var $target 	= $(evnt.target);
			var $ancestor 	= $target.closest('.icd-choice-container');

			// If there was actually a choice container there (if not on background or scrollbar)
			if ( $ancestor.length > 0 ) {
				// Get the correct child and use the given function to select it
				// The data on this node is set by the creator of this grid, so
				// it'll know what to fetch from the choice
				chooseChoice_($ancestor.find('.icd-adder-choice')[0]);
			}

		} );
	};  // End setListeners()


	newGrid.addSizer = function ( parentNode ) {
	/*
	* Add element that will "contain" "all" the elements, providing
	* the scrolling size
	*/
		var sizer = document.getElementById( 'icd_' + modeName_ + '_picker' );
		$(sizer).addClass('icd_' + modeName_ + '_sizer');
		setListeners( sizer );

		return sizer;
	};  // End addSizer()


	newGrid.start = function ( parentNode ) {
	// Add sizer to parent node
	// Add rows starting at 0

		newGrid.sizer = newGrid.addSizer( parentNode );
		// Size the sizer and set the grids dimension values (and total number of rows)
		newGrid.setDimensions( currentKeys_.length, numCols_);
		newGrid.update( 0 );

		return newGrid;
	};  // End newGrid.start()




	// =====================
	// EVENTS
	// =====================
	var oldFirstRowNum = 0;
	newGrid.scrollHandler = function ( evnt, sizer_, force ) {

		// Current top visible row. With this math, it will never exceed the max allowed.
		var currRowNum = Math.ceil( scrollable_.scrollTop/(rowHeight_ + rowMargin_) );

		if ( force === true || (currRowNum !== oldFirstRowNum && (evnt.deltaY < 100 || evnt.deltaY > -100)) ) {
			// Update the grid with the right rows
			newGrid.update( currRowNum );
	  }

	  oldFirstRowNum = currRowNum;
	};  // End newGrid.gridScrollHandler()


	var $scrollable_ = $(scrollable_)

	$scrollable_.on('wheel', function(evnt) {
		newGrid.scrollHandler( evnt, null, false );
	});  // End $scrollable_ event listener wheel

	// ??: Better on mousemove or mouseout?
	// Note: mousemove not working for scrollbar
	$scrollable_.on('mouseout', function(evnt) {
		newGrid.scrollHandler( evnt, null, true );
	});  // End $scrollable_ event listener mouseout


	$scrollable_.on('scroll', function(evnt) {
		// This event's behavior is great: it seems not to cycle through 
		// all the rows it passes through, just select rows
		newGrid.scrollHandler( evnt, null, true );
	});  // End $scrollable_ event listener scroll


	// =====================
	// START
	// =====================
	newGrid.start( scrollable_ );

	return newGrid;
};  // End adder.Grid {} (new version)


// // *************************************************
// // TESTING
// // *************************************************
// var testGrid
// window.addEventListener('load', function () {
// 	var choiceObjs = objsByIds;
// 	var rowBlueprint = {
// 		height: 60,
// 		vertMargin: 10,
// 		numCols: 8
// 	}
// 	var modeName = 'test';
// 	var makeChoiceNode = adder.makeImageNode;

// 	testGrid = new adder.Grid2( choiceObjs, rowBlueprint, modeName, makeChoiceNode )
// })

