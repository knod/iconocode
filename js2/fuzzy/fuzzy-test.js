/* fuzzy-test.js
*/

'use strict'

window.addEventListener( 'load', function () {

	var fuzzySearcher = new FuzzySearcher();
	// var getQuery 	= function () {
	// 	return $(inputNode).val();
	// };  // End getQuery()

	// ========================
	// ELEMENTS
	// ========================
	var getSelectedNode = function () {
	/* Incase we want to change the classes used */
		return document.querySelector('.fuzzy-matched-term.selected');
	};  // End getSelectedNode()


	var selectOption = function ( direction ) {
	/* ( str ) -> Node

	Right now, something will always be selected. Is this generally expected behavior?
	*/
		var selectedNode 		= getSelectedNode(),
			newSelectedNode 	= null;

		if ( direction === 'up' ) {
			// If selectedNode is the first element in output, we'll get null
			newSelectedNode = selectedNode.previousSibling;
		} else {  // down
			// If selectedNode is the last element, we'll get null
			newSelectedNode = selectedNode.nextSibling;
		}  // End if direction

		selectedNode.classList.remove('selected');
		// If the user pressed up when at top or down when at bottom
		if ( newSelectedNode === null ) { newSelectedNode = selectedNode; }
		newSelectedNode.classList.add('selected');

		return newSelectedNode;
	};  // End selectOption()


	var useSelectedOption = function () {
	/* ( none ) -> Str
	
	Puts the selected option's text in the search node.
	Returns that text
	*/
		var selectedNode = getSelectedNode();

		if (selectedNode !== null) {
			$(inputNode).val( selectedNode.dataset.term );
		}

		return $(inputNode).val();  // Retern selected node instead?
	};

	// ========================
	// DATA
	// ========================
	var getUniqueObjIds = function ( tagNames, idsByTag ) {
	/* ( [""], { tagName: 'id#s'} )
	* 
	* Get all the unique object ids associated with all the tag names
	* These turn out already ranked.
	*/
		var objIds = [];
		
		for ( var tagi = 0; tagi < tagNames.length; tagi++ ) {  // for each tag

			var tag = tagNames[ tagi ];
			// Maybe check unique right in here
			// http://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array
			var tagIds = idsByTag[ tag ];

			// Add this tag's id's to the main list
			for ( var idi = 0; idi < tagIds.length; idi++ ) {  // for each id in tag
				var id = tagIds[ idi ];

				// but only if it's unique
				// if this is too slow, look at http://stackoverflow.com/questions/237104/array-containsobj-in-javascript
				if ( objIds.indexOf( id ) === -1 ) {
					objIds.push( id );
				}

			}  // end for each id in tag

		}  // end for each tag

		return objIds;
	};  // End getUniqueObjIds()


	// Always searching through the same terms?
	var terms = tagsArray;  // tags-array.js
	// idsByTag  from tag-dict.js, we'll work out how to do it better later
	var matchData;
	var objIds = getUniqueObjIds(terms , idsByTag);


	var runSearch 	= function ( query ) {
		console.log('----------- running search -----------')
		// outputNode.innerHTML 	= '';
		// $(outputNode).empty();
		// Make sure there's some text in the search to match with
		// If I use length > 0 and type in 'a', I get 4707 unique ids, 'ac' gets 812
		if ( $(inputNode).val().length > 3 ) {
			matchData 	= fuzzySearcher.runSearch( terms, query );
			adder.currentMatchData = matchData;
			
			// idsByTag  from idsByTag.js
			// These turn out already ranked
			objIds 		= getUniqueObjIds( matchData.matches, idsByTag );

			adder.currentMatchIds = objIds;

			// How do I connect the rankings with the object ids?

			// outputNode.appendChild( matchData.node );
			// $(matchData.node).children().first().addClass('selected');
		}

		// Pass out the objIds array and the reults? (results allow)
		// for not having to re-analyze the tags, can just use the data we
		// already have
		return outputNode;
	};  // End runSearch()


	// ====================
	// INPUT
	// ====================
	var inputNode 	= document.getElementById('search-query'),
		outputNode 	= document.getElementById('fuzzy-matches-container');

	inputNode.addEventListener('keydown', function( evnt ) {
	/* Prevent navigating in the text using the up and down keys */
		var key = evnt.keyCode || evnt.which;

		if (key === 40) { // down
			evnt.preventDefault();
		} else if (key === 38) { // up
			evnt.preventDefault();
		}

	}, false);


	inputNode.addEventListener('keyup', function( evnt ) {
		var key = evnt.keyCode || evnt.which;

		if (evnt.keyCode === 13) { // enter
			useSelectedOption();
			runSearch( $(inputNode).val() );  // Otherwise the whole list just stays there
		} else 
		// No left or right because need to be able to navigate search text
		if (key === 40) { // down
			selectOption('down');
		} else if ( key === 38 ) { // up
			selectOption('up');
		} else if (key === 27) { // ESC
			$(outputNode).empty();
			$(inputNode).val('');
		}
		else {
			runSearch( $(inputNode).val() );
		}

	}, false);


	// =======================
	// TEST
	// =======================
	// Pretend to scroll through rows
	var firstRowIndx 	= 0;
	// 5 visible rows, two buffers, one at top and one on bottom
	var numExistingRows = 3;
	var numCols 		= 8;
	// Number of items divided by number of columns for each row, then,
	// in case we get 100.23, get the next whole number up to make a whole
	// number for the total number of rows
	// http://stackoverflow.com/questions/3337367/checking-length-of-dictionary-object
	var numObjects 		= Object.keys(objsByIds).length
	var numTotalRows 	= Math.ceil( numObjects / numCols);
	
	var existingRows 			= [];


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


	// This is to build all the rows each time. What we really need to do
	// is just add a row to the top or bottom and remove one on the opposite end
	// This should only be done once at the end of each search round (resetting the grid)
	var setGridArray = function () {

		// Create 5 visible rows, with 8 columns each
		for ( var iteri = 0; iteri < numExistingRows; iteri++ ) {

			var rowNum = firstRowIndx + iteri;
			var row = getRowOfObjectsByRowNum( rowNum );
			existingRows.push( row );
		}
		console.log(existingRows)

		return existingRows;
	};  // End setGridArray()


	var scrollRowsArray = function ( wheelDelta, existingRows ) {
		// This should look like the same result as before, it'll just be done differently
		// Is there a point to doing it this way? Will the right element stay selected?
		// Will we still need to change the navigation position?

		if ( wheelDelta > 2 ) {
			console.log( '---------------' )
			console.log('existing rows before:', existingRows)
			// ???: Not sure how to handle 0 index in here
			// lastRowIndx starts at 0
			// numExistingRows and numTotalRows do not start at 0
			// Last and first row numbers refer to the last and first existing rows
			// Don't go below the max number of total rows (taking into account 0 index)

			// ???!: Which one?!
			// // +1 because we're pretending rows have been incremented to show possible next row
			// var lastRowIndx = firstRowIndx + 1 + (numExistingRows);
			// // 10 total rows, 7 existing ones, first row = 0, last row = 8;
			// // 10 total rows, 7 existing ones, first row = 2, last row = 10;
			// lastRowIndx 	= Math.min( numTotalRows - 1, lastRowIndx );
			// // Math.min( 9, 8 );
			// // Math.min( 9, 10 );
			// // If it won't go too far
			// if ( lastRowIndx < (numTotalRows - 1) ) {
			// 	// 8 < 9; 10 < 9 (this will be false when last row is 9, which is too early?)
			// }

			// +1 because we're pretending rows have been incremented to show possible next row
			var lastRowIndx = (firstRowIndx + 1) + (numExistingRows - 1);
			// 10 total rows, 7 existing ones, first row = 0, last row = 7;
			// 10 total rows, 7 existing ones, first row = 2, last row = 9;
			var numRows0Indx = numTotalRows - 1;
			lastRowIndx 	= Math.min( numRows0Indx, lastRowIndx );
			// Math.min( 9, 7 );
			// Math.min( 9, 9 );
			// If it won't go too far
			// console.log('lastRow:', lastRowIndx, '; numTotal - 1:', (numTotalRows - 1));  // Working, I think
			if ( lastRowIndx < (numTotalRows - 1) ) {
				// 7 < 9; 9 < 9 (just right?)
				// Actually increment everything
				firstRowIndx += 1;

				var newRow 	= getRowOfObjectsByRowNum( lastRowIndx );
				// console.log(newRow)
				// Remove first row from rows
				console.log(existingRows.shift());
				console.log('existing rows length:', existingRows.length)
		console.log('existingRows after shift:', existingRows)
				// Add a row to the end
				existingRows.push( newRow );

			}

		} else if ( wheelDelta < -2 ) {
			console.log( '***************' )
			firstRowIndx -= 1;

			// Don't go above first row
			firstRowIndx = Math.max( 0, firstRowIndx );
			console.log('firstRow:', firstRowIndx, '; 0')
			if ( firstRowIndx > 0 ) {
				var newRow = getRowOfObjectsByRowNum( firstRowIndx );
				// Remove the last row from rows
				existingRows.pop();
				// Add a row above this one
				existingRows.unshift( newRow )
		console.log('existingRows:', existingRows)
			}

		}

		
		// var scrollGrid = function 

		return existingRows;
	}  // End scrollRowsArray()



	document.addEventListener('wheel', function ( evnt ) {
		// console.log(evnt)
		// console.log(evnt.deltaY);

		var deltaY = evnt.deltaY;
		scrollRowsArray( deltaY, existingRows );

	});


	// START TEST
	setGridArray();

});  // End window on load

