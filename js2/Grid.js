/* Grid.js
* 
* Handles a grid of choices/options that are selectable and choosable
* 
* TODO:
* How to restore choices to original order when all search text is gone?
*/


adder.Grid = function ( modeName, maxCols, choiceContainers ) {
/* ( str, int, [Nodes] ) -> {}
* 
* 
*/

	var thisGrid = {};

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


	thisGrid.set 	= function ( modeType_, maxCols, choiceContainers ) {
	/**/
		var rowNodes = [];

		// Get the right number of rows for the given number of choices, each time
		// Takes into account having a non-evenly divided number
		var numRows = Math.ceil( choiceContainers.length / maxCols )

		for ( var rowi = 0; rowi < numRows; rowi++ ) {

			// Get the relevant choice nodes for this row.
			var startIndx 	= maxCols * rowi,
			// Use maxCols because .slice() doesn't include the last item
				endIndx		= startIndx + maxCols;
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


	var createGrid 	= function ( modeType_, maxCols, parentNode ) {
	/* ( str, int ) -> [Nodes] */

		var rowNodes = [];

		// Get the right number of rows for the given number of choices, each time
		// Takes into account having a non-evenly divided number
		var numRows = Math.ceil( choiceContainers.length / maxCols )

		for ( var rowi = 0; rowi < numRows; rowi++ ) {
			// Add a row to the DOM, then add the row's node to the list
			var rowNode = createRow( modeType_, rowi, parentNode );
			rowNodes.push( rowNode );
		}

		thisGrid.rowNodes = rowNodes;
		return rowNodes;
	};  // End createGrid()


	createGrid( modeType_, maxCols, parentNode );
	thisGrid.set( modeType_, maxCols, choiceContainers );

	adder.setupGridNavigation( thisGrid, modeName );

	adder.modes[ modeName ].grid = thisGrid;

	return thisGrid;
};  // End adder.Grid {}


// *************************************************
// Testing
// *************************************************
// // --- IMAGES --- \\
// var picker1 				= 'images';
// var maxCols1 				= 5;
// var imageChoiceNodesTest 	= [];

// var allImageObjs = adder.defaultImages

// for ( var imgi = 0; imgi < allImageObjs.length; imgi++ ) {
// 	var imgObj = allImageObjs[ imgi ]
// 	var parent = document.createDocumentFragment();

// 	var imgChoice 	= new adder.ImgChoice2( imgObj, parent );
// 	imageChoiceNodesTest.push( imgChoice.node );
// }

// // Test in console:
// // var myGrid = adder.Grid( picker1, maxCols1, imageChoiceNodesTest );


// // --- TYPES --- \\
// // Not working, have to adjust how types container works in general to make
// // it work.
// var picker2 				= 'types';
// var maxCols2 				= 3;

// // Test in console: 
// // var verbThing 				= adder.addVerbChoice( document.createDocumentFragment(), 'icd' ),
// // 	nounThing				= adder.addNounChoice( document.createDocumentFragment(), 'icd' ),
// // 	messageThing			= adder.addMessageChoice( document.createDocumentFragment(), 'icd' );

// // var typeChoiceNodesTest 	= [ verbThing, nounThing, messageThing ]
// // var typeGrid = adder.Grid( picker2, maxCols2, typeChoiceNodesTest );



