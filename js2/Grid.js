/* Grid.js
* 
* Handles a grid of choices/options that are selectable and choosable
* 
* TODO:
* - How to restore choices to original order when all search text is gone?
* - Change grid navigation to work with row array instead of DOM,
* 	set selection after matching with the right row array element.
* - Reveal new rows on scroll
* - ???: No navigation to top from bottom and bottom from top? Would
* 	the DOM scroll the whole length of the div?
* - What happens to selection if someone scrolls the selection out of view?
* 
* Main Logic:
* - Use image objects
* - Set dimensions of sizer
* - Create the sizer?
* - Set rows and grid based on scroll
* 	- Get image objects for each row
* 	- Get their svg's or src's
* 	- Build the element, including classes, data, and events with choosing function
* 	- Add that row to the grid
*/


adder.Grid = function ( choiceObjs, rowBlueprint, parentNode ) {

	/* 
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

	TODO: position absolute for rows, centered though, also, set a definite height
	*/



	var newGrid = {};


	// varName_ to know they're in the top level of this scope, clarity

	// --- Object (master object list for this mode/picker) --- \\
	var choiceObjs_ = choiceObjs;

	// --- Nodes --- \\
	var parentNode_ = parentNode;

	newGrid.scrollable  = document.getElementById( 'icd_' + modeName + '_picker' );
	var scrollable_ 	= newGrid.scrollable;
	
	newGrid.sizer 		= null;

	// --- Blueprints --- \\
	var rowHeight_ 	= rowBlueprint.height,
		rowMargin_ 	= rowBlueprint.vertMargin,
		numCols_ 	= rowBlueprint.numCols;

	// Includes buffer rows (use the biggest number needed for any pickers)
	var NUM_EXISTING_ROWS = 10;



	// ====================
	// DATA
	// ====================
	newGrid.redrawRowBlueprints = function ( rowBlueprint ) {
	/* { height, margin } -> Grid */
		rowHeight_ = rowBlueprint.height;
		rowMargin_ = rowBlueprint.vertMargin;
		numCols_ 	= rowBlueprint.numCols;

		return newGrid;
	};  // End newGrid.redrawRowBlueprints()


	var getHeightByNumRows = function( numRows ) {
	/* ( int ) -> int 
	* Re-calcuate height of sizer using sizes of choices */
		return ( numRows * (rowHeight_ + rowMargin_) ) + rowMargin_;
	};  // End getHeightByNumRows()


	var getNumRows = function ( objs, numCols ) {
		var numObjects 		= Object.keys( objs ).length;
		return Math.ceil( numObjects / numCols);
	};  // End getNumRows()


	var resizeSizer = function ( objIds, numCols ) {
		// Get total number of rows that could exist with all the objects
		var numTotalRows = getNumRows( objIds, numCols_ );
		// Re-calcuate height of sizer using sizes of choices
		var heightStyle  = getHeightByNumRows( numTotalRows_ ) + 'px';
		newGrid.sizer.style.height = heightStyle;

		return newGrid.sizer;
	};

	newGrid.update = function ( objIds ) {
	/* ( [ strs ] ) -> Grid
	* 
	* objIds: a list of current matching object id's, ranked
	* 
	* When:
	* 	At start, after a search (objs change, changing height, etc.)
	* 	After scrolling
	* 	After mouse leave element (because may leave in the middle of scroll))
	*/
		resizeSizer( objIds, numCols_ );  // Always size to fit imginary full contents

		// Current top visible row. With this math, it will never exceed the max allowed.
		var currRowNum = Math.ceil( scrollable_.scrollTop/(rowHeight_ + rowMargin_) );



		return newGrid;
	};  // End newGrid.update()



	// ====================
	// SETUP (create initial content, start off logic)
	// ====================
	newGrid.addSizer = function ( numObjs, parentNode ) {
	/*
	* Add element that will "contain" "all" the elements, providing
	* the scrolling size
	*/
		var sizer = document.createElement( 'div' );
		parentNode.appendChild( sizer );

		sizer.style.height  = getHeightByNumRows( numTotalRows_ ) + 'px';
		sizer.id 			= 'icd_' + modeName + '_sizer';
		// Testing
		sizer.style['backgroundColor'] = 'teal';

		return sizer;
	};  // End addSizer()


	newGrid.start = function ( parentNode ) {
	// Add sizer to parent node
	// Add rows starting at 0
		newGrid.sizer = newGrid.addSizer( parentNode );

		return newGrid;
	};  // End newGrid.start()


	newGrid.start( parentNode_ );

	return newGrid;
};  // End adder.Grid {} (new version)




adder.Grid = function ( modeName, MAX_COLS, choiceContainers, imageObjects, rowBlueprint ) {
/* XXX( str, int, [Nodes] ) -> {}
* 
* rowSize = {height: int, vertMargin: int}
*/
	var thisGrid = {};




	// Change "__newGrid__" to "thisGrid" when stuff is working
	var __newGrid__ = {};

	// --- To Be Instantiated Later --- \\
	__newGrid__.sizer = null;  // Element to placehold scrolling height


	__newGrid__.scrollable = document.getElementById( 'icd_' + modeName + '_picker' );
	var scrollable_ = __newGrid__.scrollable;

	// Includes buffer rows
	var NUM_EXISTING_ROWS = 10;

	var numTotalRows = imageObjects.length;  // TODO: Must be recalculated each time in case more images are added
	var rowHeight = rowBlueprint.height, rowVertMargin = rowBlueprint.vertMargin;


	// ====================
	// DATA
	// ====================
	var getHeightByNumRows = function( numRows ) {
	/* ( int ) -> int
	* Gets the height of a certain number of rows
	*/
		var rowHeight = rowBlueprint.height, margin = rowBlueprint.vertMargin;
		var height = ( numRows * (rowHeight + margin) ) + margin;
		return height;
	};  // End getHeightByNumRows()



	// ====================
	// REGENERATING CONTENT
	// ====================
	var scroller_ = new ScrollManager();


	__newGrid__.update = function ( imgObjs ) {
	/* 
	*/
		console.log('---- UPDATING ----')
		// Get an array of all the current row numbers
		// var currentRows = __newGrid__.sizer.getElementsByClassName('row');

		var rowHeight = rowBlueprint.height, margin = rowBlueprint.vertMargin;
		var currRowNum = Math.ceil(container_.scrollTop/(rowHeight + margin))

		scroller_.getNewRowNums( currRowNum  );



		var getRowOfObjectsByRowNum = function ( rowNum ) {

			var row = [];

			for ( var colNum = 0; colNum < numCols; colNum++ ) {
				// Get the index number the id of each object we need
				var indx = (rowNum * numCols) + colNum;
				// Get the id
				var id 	= objIds[ indx ];
				// Get the actual object using that id
				var obj = objsByIds[ id ];

				row.push( obj );
			}

			return row;
		};  // End getRowOfObjectsByRowNum()


		// Create 10 visible rows, with 8 columns each
		for ( var iteri = 0; iteri < numExistingRows; iteri++ ) {

			var rowNum = firstRowIndx + iteri;
			var row = getRowOfObjectsByRowNum( rowNum );
			existingRows.push( row );
		}
		console.log(existingRows)

		return existingRows;

		var currRowNums = scroller.getCurrentRowNums( currentRows );
		// Get all the new row numbers we'll need, starting with the top row
		var newRowNums  = scroller.getNewRowNums( topRowNum );

		// Remove all the old rows that won't be needed anymore
		scroller.removeExcessRows( currRowNums, newRowNums, parentNode );

		var newRowNum = topRowNum;
		for ( var rowCount = 0; rowCount < NUM_EXISTING_ROWS; rowCount++ ) {

			var rowNode = document.getElementById( 'row_' + newRowNum );
			// If a row of that id isn't there add it. Doesn't matter about prepending or appending, they're all positioned absolutely

			if ( rowNode === null ) {
			  var rowNode = makeRow( newRowNum );
			  parentNode.appendChild( rowNode );
			}
			// Prepare for next iteration
			newRowNum += 1;
		}  // End for each new row

		return currentRows;
	};  // End __newGrid__.update()



	// ========================
	// SCROLL LOGIC
	// ========================



	// ====================
	// SETUP (create initial content, start off logic)
	// ====================
	var addSizer = function ( parentNode ) {
	/*
	* Add element that will "contain" "all" the elements, providing
	* the scrolling size
	*/
		var sizer = document.createElement( 'div' );
		parentNode.appendChild( sizer );

		sizer.style.height  = getHeightByNumRows( numTotalRows ) + 'px';
		sizer.id 			= 'icd_' + modeName + '_sizer';
		// Testing
		sizer.style['backgroundColor'] = 'teal';

		__newGrid__.sizer = sizer;

		return sizer;
	};  // End addSizer()




	// ==========================
	// ==========================
	// OLD VERSION (using elments instead of objects)
	// ==========================
	thisGrid.choiceContainers 	= choiceContainers,
		thisGrid.rowNodes 		= [],
		thisGrid.modeType 		= modeName,
		thisGrid.choiceFunction = adder.chooseImage;

	var parentNode 	= document.getElementById( 'icd_' + modeName + '_picker' ),
		modeType_ 	= thisGrid.modeType;  // For clarity


	// ========================
	// UPDATING
	// ========================
	thisGrid.setRow = function ( modeType_, rowNum, rowChoiceContainers ) {
	/* ( int, [Nodes], Node ) -> Node
	* 
	* Adds a row of choice nodes to the Picker node
	*/
		rowNode = document.getElementById( modeType_ + '_choice_row' + rowNum );

		// Give the choice node its id and position data
		for ( var nodei = 0; nodei < rowChoiceContainers.length; nodei++ ) {
			var node = rowChoiceContainers[ nodei ];

			// If it's undefined it means we've run out of nodes (bottom row)
			if ( node !== undefined ) {
				rowNode.appendChild( node );

				node.id = rowNode.id + '_col' + nodei;
				$(node).data('row', rowNum);  // TODO: check if this is used
				$(node).data('col', nodei);  // TODO: check if this is used
			}

			// Add choice the first time around
			if ( $(node).data('choice') === undefined ) {
				var choice = $(node).find('.icd-adder-choice')[0];
				$(node).data('choice', choice )
			}

		}

		return rowNode;
	};  // End thisGrid.addRow()


	thisGrid.getNumRows = function ( choiceContainers ) {

		// Get the right number of rows for the given number of choices, each time
		// Takes into account having a non-evenly divided number
		var numRows = Math.ceil( choiceContainers.length / MAX_COLS );
		// To make sure not all the np icons are added at once
		numRows 	= Math.min( 40, choiceContainers.length );

		return numRows
	};  // End thisGrid.getNumRows()


	thisGrid.set 	= function ( modeType_, MAX_COLS, choiceContainers ) {
	/**/
		var rowNodes = [];

		// Get the right number of rows for the given number of choices, each time
		var numRows = thisGrid.getNumRows( choiceContainers );

		for ( var rowi = 0; rowi < numRows; rowi++ ) {

			// Get the relevant choice nodes for this row.
			var startIndx 	= MAX_COLS * rowi,
			// Use MAX_COLS because .slice() doesn't include the last item
				endIndx		= startIndx + MAX_COLS;
			var rowChoices 	= choiceContainers.slice( startIndx, endIndx );

			// Add a row to the DOM, then add the row's node to the list
			var rowNode = thisGrid.setRow( modeType_, rowi, rowChoices );
			rowNodes.push( rowNode );

		}

		thisGrid.rowNodes = rowNodes;
		return rowNodes;
	};  // End thisGrid.set()


	// ========================
	// CREATION
	// ========================
	var createRow 	= function ( modeType_, rowNum, parentNode ) {
	/* ( str, int ) -> Nodes */
		var rowNode 		= document.createElement( 'div' );

		parentNode.appendChild( rowNode );

		rowNode.className 	= modeType_ + '-picker-row';
		rowNode.id 			= modeType_ + '_choice_row' + rowNum;

		return rowNode;
	};  // End createRow()


	var createGrid 	= function ( modeType_, MAX_COLS, parentNode ) {
	/* ( str, int ) -> [Nodes] */

		var rowNodes = [];

		// Get the right number of rows for the given number of choices, each time
		var numRows = thisGrid.getNumRows( choiceContainers );

		for ( var rowi = 0; rowi < numRows; rowi++ ) {
			// Add a row to the DOM, then add the row's node to the list
			var rowNode = createRow( modeType_, rowi, parentNode );
			rowNodes.push( rowNode );
		}

		thisGrid.rowNodes = rowNodes;
		return rowNodes;
	};  // End createGrid()


	createGrid( modeType_, MAX_COLS, parentNode );
	thisGrid.set( modeType_, MAX_COLS, choiceContainers );

	adder.setupGridNavigation( thisGrid, modeName );

	adder.modes[ modeName ].grid = thisGrid;

	return thisGrid;
};  // End adder.Grid {}


// *************************************************
// Testing
// *************************************************
// // --- IMAGES --- \\
// var picker1 				= 'images';
// var MAX_COLS1 				= 5;
// var imageChoiceNodesTest 	= [];

// var allImageObjs = adder.defaultImages

// for ( var imgi = 0; imgi < allImageObjs.length; imgi++ ) {
// 	var imgObj = allImageObjs[ imgi ]
// 	var parent = document.createDocumentFragment();

// 	var imgChoice 	= new adder.ImgChoice2( imgObj, parent );
// 	imageChoiceNodesTest.push( imgChoice.node );
// }

// // Test in console:
// // var myGrid = adder.Grid( picker1, MAX_COLS1, imageChoiceNodesTest );


// // --- TYPES --- \\
// // Not working, have to adjust how types container works in general to make
// // it work.
// var picker2 				= 'types';
// var MAX_COLS2 				= 3;

// // Test in console: 
// // var verbThing 				= adder.addVerbChoice( document.createDocumentFragment(), 'icd' ),
// // 	nounThing				= adder.addNounChoice( document.createDocumentFragment(), 'icd' ),
// // 	messageThing			= adder.addMessageChoice( document.createDocumentFragment(), 'icd' );

// // var typeChoiceNodesTest 	= [ verbThing, nounThing, messageThing ]
// // var typeGrid = adder.Grid( picker2, MAX_COLS2, typeChoiceNodesTest );



