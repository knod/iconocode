/* search-images.js

Trying to implement fuzzy search functionality with
multiple lists for images.

TODO:
- Hide images that have no matching terms
- Rank images by how closely they match the query
- Re-order images to appear by rank of match
*/

'use strict'


adder.updateChoiceList 	= function ( choiceNode, query ) {
/*

Runs the search for matches on each choiceNode. Shows just
matching terms. Doesn't get rid of search terms.
*/
	var terms 			= $(choiceNode).data('terms');
	var fuzzySearcher 	= new FuzzySearcher();
	
	// Get match data and store it in the node
	var matchData 	= fuzzySearcher.toNode( terms, query );
	$(choiceNode).data('matchData', matchData);

	// Re-make list of terms with styled list elements
	var list 		= $(choiceNode).parent().find('ol')[0];
	$(list).empty();
	list.appendChild( matchData.node );

	return choiceNode
};  // End adder.updateChoiceList()


adder.updateChoiceLists = function ( choiceGrid, query ) {
/*

Updates the visible search terms for all choices.
*/
	var choiceNodes = [];

	for ( var rowi = 0; rowi < choiceGrid.length; rowi++ ) {
		for ( var coli = 0; coli < choiceGrid[rowi].length; coli++ ) {
			// Change the visible search terms for that image
			var choiceNode = choiceGrid[ rowi ][ coli ];
			adder.updateChoiceList( choiceNode, query );
			// List to be ranked
			choiceNodes.push(choiceNode); console.log(choiceNode)
		}
	}

	var matchComparator = function ( node1, node2 ) {
	/* This is in here because in here is where the test properties are created */
		// !!!: TODO: This is terrible. I have to dig way down deep
		var match2 = $(node2).data('matchData').matchesData[0];
		var match1 = $(node1).data('matchData').matchesData[0];

		var diff = match2.score - match1.score;

		// If the scores are the same
		if ( match1.score === match2.score ) {
			// Add the number of letters before the first match
			match2.altScore = match2.score - match2.term.length;
			match1.altScore = match1.score - match1.term.length;

			diff = match2.altScore - match1.altScore;
		}

		return diff;
	};  // End matchComparator()

	console.log(choiceNodes.sort( matchComparator ));
	

	return choiceGrid;
};  // End adder.updateChoiceLists()


adder.runSearch 		= function ( choiceGrid ) {

	var cmEditor = adder.viewer;

	// Get the text in the current token
	cmEditor.getCursor()
	var token = cmEditor.getTokenAt( cmEditor.getCursor() );
	// console.log('token:', token);
console.log('------------')
	if ( token.string.length > 0 ) {

		// Sanitize query (maybe not necessary. TODO: test removal of this later)
		// Remove any semicolons, though actually if anything but this adds them, I think this breaks
		var query = token.string.replace( /;/, '' );

		adder.updateChoiceLists( choiceGrid, query );	
	}

	return choiceGrid;
};




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

