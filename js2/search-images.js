/* search-images.js

Trying to implement fuzzy search functionality with
multiple lists for images.
*/

'use strict'


// Take the form of [{ fileName: '', searchTerms: [], folderPath: '' }, ...]
var imageObjArray 		= adder.defaultImages;

var fuzzySearcher 		= new FuzzySearcher();


adder.updateChoiceList 	= function ( choiceNode, query ) {
/*

Gets the matching terms for this choice and shows just them.
Doesn't get rid of search terms.
*/
	var terms 	= $(choiceNode).data('terms');
	
	// Search within each of those and do stuff with the results
	var matchData 	= fuzzySearcher.toNode( terms, query );
	var list 		= $(choiceNode).parent().find('ol')[0];
	$(list).empty();
	list.appendChild( matchData.node );

	return choiceNode
};  // End adder.updateChoiceList()


adder.updateChoiceLists = function ( choiceGrid, query ) {
/*

Updates the visible search terms for all choices.
*/
	for ( var rowi = 0; rowi < choiceGrid.length; rowi++ ) {
		for ( var coli = 0; coli < choiceGrid[rowi].length; coli++ ) {
			// Change the visible search terms for that image
			var choiceNode = choiceGrid[ rowi ][ coli ];
			adder.updateChoiceList( choiceNode, query );
		}
	}

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

