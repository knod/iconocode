/* search-images.js

Trying to implement fuzzy search functionality with
multiple lists for images.

TODO:
- Make sure ALWAYS to not assign a new value to .data('terms')
- Search only through previous matches

*/

'use strict'


// Take the form of [{ fileName: '', searchTerms: [], folderPath: '' }, ...]
var imageObjArray = adder.defaultImages;

var fuzzySearcher = new FuzzySearcher();


adder.resetChoiceData = function ( choiceNodes ) {
/* 
* Reset choices so stuff won't be competing against old scores
* and matchData
*/
	for ( var nodei = 0; nodei < choiceNodes.length; nodei++ ) {
		$choiceNode = $(choiceNodes[ nodei ])

		$choiceNode.data( 'matchData', null );
		$choiceNode.data( 'score', -1000 );
		$choiceNode.data( 'altScore', -1000 );
	}

	return choiceNodes;
};  // adder.resetChoices()


adder.addMatchingChoice = function ( choiceNode, matchData ) {
/* ( Node, {} ) -> same Node

*/
	// Keep hold of their match data for ranking
	$(choiceNode).data( 'matchData', matchData );

	// Populate their lists
	var list = $(choiceNode).parent().find('ol')[0];
	$(list).empty();
	list.appendChild( matchData.node );

	return choiceNode;
};  // End adder.addMatchingChoice()

var toTest = null;
adder.findMatches = function ( nodeArray, query ) {
/* ( [[Node]], { col, row } ) -> new [ Nodes ]

Finds nodes in nodeArray that match the query, changes
each of those nodes, and returns the list of matching nodes
*/
	var matchingChoices = [];
	for ( var nodei = 0; nodei < nodeArray.length; nodei++ ) {
		// Get the search terms for that image
		var choiceNode 	= nodeArray[ nodei ];

		var terms 		= $(choiceNode).data('searchTerms');
		console.log('terms:', terms)
		// Search using terms
		var matchData 	= fuzzySearcher.toNode( terms, query );

		// Make sure only images with matching terms are shown
		if (matchData.matchingTerms.length > 0) {
			// Adds to and changes choiceNode
			adder.addMatchingChoice( choiceNode, matchData );
			matchingChoices.push( choiceNode )
		}
	}  // end for row

	return matchingChoices;
};  // End adder.findMatchesForChoice()


adder.matchComparator = function( node1, node2 ) {
/* ( Node, Node ) -> int

For the .sort() run on nodes to compare them
TODO: Alphabetize somehow
*/
	return $(node2).data('score') - $(node1).data('score');
};


adder.rankMatches = function ( matchingNodes ) {
/* [ Node ] -> [ Node ]

Compares scores of the top match in each node and sorts
the list based on that, highest ranking first on the list
*/
	for ( var matchi = 0; matchi < matchingNodes.length; matchi++ ) {
		var matchingNode 	= matchingNodes[ matchi ];
		// Contains .altScore or .score
		var topMatchData 	= $(matchingNode).data('matchData').matchesData[0];
		var score = topMatchData.score;
		console.log(score);

		// Give the node its score
		$(matchingNode).data('score', score)
	}  // end for each matching node

	// Use the scores to sort
	matchingNodes.sort( adder.matchComparator );

	return matchingNodes;
};  // End adder.rankMatches()


adder.getNodeObjs = function ( choicesNodes ) {
/*

Gets the objects from the nodes. Have to do this
because when grid is originally made it is handed the imgObjs
because its nodes aren't set yet, so they don't have their own 'object'
data (which .addRows creates). We'd have to make separate updateGrid and
updateRow functions.
TODO: untangle adding grids and rows so this isn't neccessary
*/
	var choicesObjs = [];
	for ( var nodei = 0; nodei < choicesNodes.length; nodei++ ) {

		var node = choicesNodes[ nodei ];
		choicesObjs.push( $(node).data('object') )

	}
	
	return choicesObjs;
};  // End adder.getNodeObjs()


adder.runSearch = function ( nodeArray, parentNode ) {
/* ( [[Node]] ) -> new [[Node]]


*/
console.log('------------');//console.log(nodeArray);
	// Make sure we never alter nodeArray
	var cloneArray = nodeArray.slice();
	var cmEditor = adder.viewer;

	// Get the text in the current token
	cmEditor.getCursor()
	var token 	= cmEditor.getTokenAt( cmEditor.getCursor() );
	var grid 	= null;


	if ( token.string.length > 0 ) {
		// Remove any semicolons, though actually they shouldn't be there until
		// the search is completed
		var query 			= token.string.replace( /;/, '' );

		// Will put matchData on each matching node
		var matchingChoices = adder.findMatches( cloneArray, query );
		// Put them in order by score of their top matching term
		adder.rankMatches( matchingChoices );

		// Put them in the DOM
		grid = adder.setGrid( matchingChoices, adder.imgGrid );

	}  // End if query is 1 or more letters

	return grid;
};  // End adder.runSearch()




/*
TODO: Make sure that when the images are added, their object is added to them too?
	Maybe not necessary. It already has the image name in it's src and such...

Probably don't start matching stuff until there are two letters or more?

For each image in the list
	Look for matches in its search terms
	Find the best match? Find all the matches?
	If a match is found, put it (and it's element?) on the list of possible completions
		??: Show the matching text in bold? I think it's important to show the text
		that's being matched, I'm just not sure how


*/

