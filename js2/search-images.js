/* search-images.js

Trying to implement fuzzy search functionality with
multiple lists for images.

TODO:
- Hide images that have no matching terms
- Rank images by how closely they match the query
- Re-order images to appear by rank of match
*/

'use strict'

adder.hideUnmatched 	= function ( choiceArray ) {};  // End adder.hideUnmatched()


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
// 	console.log('term:', $(choiceNode).data('matchData').matchesData[0].term)
// // if (($(choiceNode).data('matchData').matchesData[0].score) !== undefined )){
// 	console.log('score:',$(choiceNode).data('matchData').matchesData[0].score)
// //}
// // if ($(choiceNode).data('matchData').matchesData[0].altScore && $(choiceNode).data('matchData').matchesData[0].altScore>-100 ){
// 	console.log('altScore:',$(choiceNode).data('matchData').matchesData[0].altScore)
// // }
	// Re-make list of terms with styled list elements
	var list 		= $(choiceNode).parent().find('ol')[0];
	$(list).empty();
	list.appendChild( matchData.node );

	return choiceNode
};  // End adder.updateChoiceList()


adder.updateChoiceLists = function ( choiceGrid, query ) {
/* ( [[Node]], str ) -> [Node]

Updates the visible search terms for all choices.
*/
	var choiceNodes = [];

	for ( var rowi = 0; rowi < choiceGrid.length; rowi++ ) {
		for ( var coli = 0; coli < choiceGrid[rowi].length; coli++ ) {
			// Change the visible search terms for that image
			// var choiceNode = choiceGrid[ rowi ][ coli ];
			var choiceNode = document.getElementById( 'image_choice_row' + rowi + '_col' + coli );
			adder.updateChoiceList( choiceNode, query );
			// List to be ranked
			choiceNodes.push(choiceNode);

			// If it didn't match, hide it (it'll still be in the DOM)
			if ( $(choiceNode).data('matchData').matchesData[0] === undefined ) {
				$(choiceNode).parent().hide();
			} else {  // Otherwise make sure it's visible
				$(choiceNode).parent().show();
			}
		}
	}

	var matchComparator = function ( node1, node2 ) {
	/* This is in here because in here is where the test properties are created 

	!!!: This is actually not working and I'm not sure why. For 'a', I get
	add, face, black, pacman, reading, acronym, magnifying glass. It should be more like
	add, acronym, face, pacman, magnifying glass, black, reading

	Better to always return either 1, -1, or 0?
	*/
		// !!!: TODO: This is terrible. I have to dig way down deep
		var match2 = $(node2).data('matchData').matchesData[0];
		var match1 = $(node1).data('matchData').matchesData[0];

		// If either of the nodes had no matches, somehow put them at the bottom
		// of the rankings
		if ( match2 === undefined ) { match2 = {score: -1000, term: 'z', matchArray: ['z']}; }
		if ( match1 === undefined ) { match1 = {score: -1000, term: 'z', matchArray: ['z']}; }

		var sortResult;
		// If the scores are the same
		if ( match1.score === match2.score ) {
			// Add the number of letters before the first match
			var alt2 = match2.score - match2.matchArray[0].length;
			var alt1 = match1.score - match1.matchArray[0].length;

			sortResult = alt2 - alt1;  // I'm not sure why this works, maybe go with below:
			// if 		( alt2 === alt1 ) { sortResult = 0; }
			// else if ( alt2 > alt1 ) { sortResult = 1; }
			// else { sortResult = -1; }

		} else {

			sortResult = match2.score - match1.score;  // Same as alt note above
			// if ( match2.score > match1.score ) { sortResult = 1; }
			// else 	{ sortResult = -1; }
		}

		return sortResult;
	};  // End matchComparator()

	choiceNodes.sort( matchComparator );
	return choiceNodes;
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

		// Choice nodes sorted by rank:
		var choiceArray = adder.updateChoiceLists( choiceGrid, query );
		adder.updateImageGrid( choiceArray );

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

