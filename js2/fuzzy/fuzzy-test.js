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
			adder.currentMatchData = matchData;  // { failures: { term: { matchData } }, matches: {} }
			
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
	
	var existingRows 	= [];


	var getRowOfObjectsByRowNum = function ( rowNum ) {

		var row = [];
		var objNames = [];  // For testing

		for ( var colNum = 0; colNum < numCols; colNum++ ) {
			// Get the index number the id of each object we need
			var indx = (rowNum * numCols) + colNum;
			// Get the id
			var id 	= objIds[ indx ];
			// Get the actual object using that id
			var obj = objsByIds[ id ];
			if ( obj !== undefined ) {
				row.push( obj );
				objNames.push( obj.name ); // For testing
			}
		}

		// console.log( 'row', rowNum, 'image names:', objNames );  // For testing
		return row;
	};  // End getRowOfObjectsByRowNum()



	// Pretend to scroll through rows
	var scrollRowArray = function ( wheelDelta ) {

		// Actually just do this when elements go off the visible page
		if ( wheelDelta > 2 ) {
			firstRowIndx += 1;
			// Don't go above the max number of rows (taking into account 0 index)
			var lastFirstRowIndx = (numTotalRows - 1) - numExistingRows;
			firstRowIndx = Math.min( lastFirstRowIndx, firstRowIndx );
		} else if ( wheelDelta < -2 ) {
			firstRowIndx -= 1;
			// Don't go below 0
			firstRowIndx = Math.max( 0, firstRowIndx );
		}

		console.log('----- Pretending to Update Rows -----')
		existingRows = [];
		for ( var iteri = 0; iteri < numExistingRows; iteri++ ) {
			
			// For number of rows that are showing, get the start of each row
			var rowNum = firstRowIndx + iteri;
			// Then fill that row with the right objects
			var row = getRowOfObjectsByRowNum( rowNum )
			// Add that row to all the rows
			existingRows.push( row );

		}

		return existingRows;
	}  // End scrollRowArray()


	// This is to build all the rows each time. What we really need to do
	// is just add a row to the top or bottom and remove one on the opposite end
	// This should only be done once at the end of each search round (resetting the grid)
	var setGridArray = function ( existingRows ) {

		// Create 5 visible rows, with 8 columns each
		for ( var iteri = 0; iteri < numExistingRows; iteri++ ) {

			var rowNum = firstRowIndx + iteri;
			var row = getRowOfObjectsByRowNum( rowNum );
			existingRows.push( row );
		}
		console.log(existingRows)

		return existingRows;
	};  // End setGridArray()




	document.addEventListener('wheel', function ( evnt ) {
		// console.log(evnt)
		// console.log(evnt.deltaY);

		var deltaY = evnt.deltaY;
		scrollRowArray( deltaY, existingRows );

	});


	// START TEST
	setGridArray( existingRows );

});  // End window on load

