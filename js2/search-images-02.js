/* search-images-02.js
* 
* Trying to implement fuzzy search functionality with
* multiple lists for images.
* 
* TODO:
* - Allow searching with multiple search terms (can use this for 'folder'
* 	navigation)
* - Generalize a bunch of stuff, then specify other stuff for specific
* 	modes?
* 
* DONE:
* - Hide images that have no matching terms
* - Rank images by how closely they match the query
* - Re-order images to appear by rank of match
* - Use list of choices instead of grid of choices
*/

'use strict'


var AdderSearcher = function ( searchbar ) {
/* 
* Fuzzy searches through image objects for matching tags
*/
	var searcher = {};

	var fuzzySearcher = new FuzzySearcher();  // my-fuzzy-search-02.js


	// ========================
	// DATA
	// ========================
	searcher.getUniqueObjIds = function ( tagNames, idsByTag ) {
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



	var terms = tagsArray.slice(0);  // tags-array.js
	// idsByTag from ids-by-tag.js, we'll work out how to do it better later

	searcher.runSearch 	= function ( query ) {
	/* ( str ) -> ?? */

		// A way to look up the objects that will match the query
		var objIds;
		// Make sure there's some text in the search to match with
		// If I use length > 0 and type in 'a', I get 4707 unique ids, 'ac' gets 812
		if ( query.length > 1 ) {
			// terms always stays the same
			var matchData = fuzzySearcher.runSearch( terms, query );
			adder.currentMatchData = matchData;

			// idsByTag  from tag-dict.js
			// These turn out already ranked
			objIds = searcher.getUniqueObjIds( matchData.matches, idsByTag );
			adder.currentMatchIds = objIds;

			// if ( objIds.length === 0 ) {
			// 	objIds = searcher.getUniqueObjIds( matchData.failures, idsByTag );
			// }

		} else {
			// objIds = searcher.getUniqueObjIds( terms, idsByTag );
		}

		return objIds;
	};  // End runSearch()


	return searcher;
};  // End AdderSearcher









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

