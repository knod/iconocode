/* search-images.js

Trying to implement fuzzy search functionality with
multiple lists for images.
*/

'use strict'


// Take the form of [{ fileName: '', searchTerms: [], folderPath: '' }, ...]
var imageObjArray = adder.defaultImages;

var fuzzySearcher = new FuzzySearcher();


adder.runSearch = function ( imgGrid ) {

	var cmEditor = adder.viewer;

	// Get the text in the current token
	cmEditor.getCursor()
	var token = cmEditor.getTokenAt( cmEditor.getCursor() );
	// console.log('token:', token);
console.log('------------')
	if ( token.string.length > 0 ) {

		// Remove any semicolons, though actually they shouldn't be there until
		// the search is completed
		var query = token.string.replace( /;/, '' );

		for ( var rowi = 0; rowi < imgGrid.length; rowi++ ) {
			for ( var coli = 0; coli < imgGrid[rowi].length; coli++ ) {
				// Get the search terms for that image
				var imgNode = imgGrid[ rowi ][ coli ];
				var terms 	= $(imgNode).data('object').searchTerms;
				
				// Search within each of those and do stuff with the results
				var matchData = fuzzySearcher.toNode( terms, query );
				console.log(matchData);  // So far so good!

			}
		}


		// for ( var imgObji = 0; imgObji < imageObjArray.length; imgObji++ ) {
		// 	var imgObj = imageObjArray[ imgObji ];

		// 	var terms = 

		// 	var matchData = fuzzySearcher.toNode( terms, query );
		// };
		
	}


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

