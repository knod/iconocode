/* Grid.js
* 
* Handles a grid of choices/options that
* are selectable and choosable
*/


adder.Grid = function ( pickerName, maxCols, choiceNodes ) {
/* ( str, int, [Nodes] ) -> {}
* 
* 
*/

	var thisGrid = {};

	thisGrid.choiceNodes 	= choiceNodes;
	thisGrid.rowNodes 		= [];


	// ========================
	// CREATION
	// ========================
	thisGrid.setRow = function ( pickerName, rowNum, rowNodes ) {
	/* ( int, [Nodes], Node ) -> Node
	* 
	* Adds a row of choice nodes to the Picker node
	*/
		var rowNode 		= document.createElement( 'div' );

		var parentNode = document.getElementById( 'icd_' + pickerName + '_picker' )
		parentNode.appendChild( rowNode );

		rowNode.className 	= pickerName + '-picker-row';
		rowNode.id 			= pickerName + '_choice_row' + rowNum;

		// // This is what the grid will actully use to access selections or navigate?
		// // Not sure this is needed
		// var rowArray 		= [];

		// Give the choice node its id and position data
		for ( var nodei = 0; nodei < rowNodes.length; nodei++ ) {
			var node = rowNodes[ nodei ];

			// If it's undefined it means we've run out of nodes (bottom row)
			if ( node !== undefined ) {
				rowNode.appendChild( node );

				node.id = rowNode.id + '_col' + nodei;
				$(node).data('row', rowNum);  // TODO: check if this is used
				$(node).data('col', nodei);  // TODO: check if this is used
			}

		}

		return rowNode;
	};  // End thisGrid.addRow()


	thisGrid.set 	= function ( pickerName, maxCols, choiceNodes ) {
	/**/
		var rowNodes = [];

		// Get the right number of rows for the given number of choices, each time
		// Takes into account having a non-evenly divided number
		var numRows = Math.ceil( choiceNodes.length / maxCols )

		for ( var rowi = 0; rowi < numRows; rowi++ ) {

			// Get the relevant choice nodes for this row.
			var startIndx 	= maxCols * rowi,
			// Use maxCols because .slice() doesn't include the last item
				endIndx		= startIndx + maxCols;
			var rowNodes 	= choiceNodes.slice( startIndx, endIndx );

			// Add a row to the DOM, then add the row's node to the list
			var rowNode = thisGrid.setRow( pickerName, rowi, rowNodes );
			rowNodes.push( rowNode );

		}

		thisGrid.rowNodes = rowNodes;
		return rowNodes;
	};  // End thisGrid.set()


	thisGrid.set( pickerName, maxCols, choiceNodes );

	return thisGrid;
};  // End adder.Grid {}


// *************************************************
// Testing
// *************************************************
var pickerName = 'images';
var maxCols = 5;
var imageChoiceNodesTest = [];

var allImageObjs = adder.defaultImages

for ( var imgi = 0; imgi < allImageObjs.length; imgi++ ) {
	var imgObj = allImageObjs[ imgi ]
	var parent = document.createDocumentFragment();

	var imgChoice 	= new adder.ImgChoice2( imgObj, parent );
	imageChoiceNodesTest.push( imgChoice.node );
}

// Test in console:
// var myGrid = adder.Grid( pickerName, maxCols, imageChoiceNodesTest );


