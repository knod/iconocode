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


	// searcher.matchQuery 	= function ( imgObj, query ) {
	// /*

	// Runs the search for matches on a container's node. Doesn't
	// get rid of the node's terms
	// */
	// 	var terms = imgObj.tags;

	// 	// Get match data and store it in the node
	// 	var matchData 		= fuzzySearcher.runSearch( terms, query );
	// 	imgObj.matchData 	= matchData;

	// 	return matchData;
	// };  //  End searcher.matchQuery()


	// searcher.runSearch 		= function ( imageObjects ) {
	// /* ( [Nodes] ) -> Nodes
	// */

	// 	// var cmEditor = adder.viewer;

	// 	// Get the text in the current token
	// 	var token = searchbar.getTokenAt( searchbar.getCursor() );

	// // console.log('------------')

	// 	if ( token.string.length > 3 ) {

	// 		// Sanitize query (maybe not necessary. TODO: test removal of this later)
	// 		// Remove any semicolons, though actually if anything but this adds them, I think this breaks
	// 		var query = token.string.replace( /;/, '' );

	// 		// Choice nodes sorted by rank:
	// 		// var choiceArray = searcher.updateContainerList( imageObjects, query );
	// 		for ( var obji = 0; obji < 3000; obji++ ) {

	// 			var test = searcher.matchQuery( imageObjects[obji], query );
	// 			// if ( obji < 3 ) {
	// 			// 	console.log(test);
	// 			// }
	// 			if ( (obji % 1000) === 0) {console.log('bleh');debugger;}
	// 		}

	// 		// adder.updateImageGrid( choiceArray );

	// 	}

	// 	return imageObjects;
	// };


	// 				adder.updateChoiceList 	= function ( choiceContainer, query ) {
	// 				/*

	// 				Runs the search for matches on each choiceNode. Shows just
	// 				matching terms. Doesn't get rid of search terms.
	// 				*/
	// 					var matchData = searcher.matchQuery( choiceContainer, query );

	// 					// !!!: HERE'S THE THING THAT'S NOT GENERAL
	// 					// Re-make list of terms with styled list elements
	// 					var list 		= $(choiceContainer).find('ol')[0];
	// 					$(list).empty();
	// 					list.appendChild( matchData.node );

	// 					return choiceContainer
	// 				};  // End adder.updateChoiceList()


	// 				adder.updateContainerList = function ( choiceContainers, query ) {
	// 				/* ( [Node], str ) -> [Node]

	// 				Updates the visible search terms for all choices.
	// 				*/
	// 					// List to be ranked
	// 					var newChoiceOrder = [];

	// 					for ( var nodei = 0; nodei < choiceContainers.length; nodei++ ) {

	// 						var choiceContainer = choiceContainers[ nodei ];
	// 						// Change the visible search terms for that image
	// 						adder.updateChoiceList( choiceContainer, query );
	// 						newChoiceOrder.push(choiceContainer);

	// 						// !!!: THIS ISN'T GENERALIZED EITHER
	// 						// If it didn't match, hide it (it'll still be in the DOM)
	// 						if ( $(choiceContainer).data('matchData').matchesData[0] === undefined ) {
	// 							$(choiceContainer).hide();
	// 						} else {  // Otherwise make sure it's visible
	// 							$(choiceContainer).show();
	// 						}
	// 					}


	// 					var matchComparator = function ( node1, node2 ) {
	// 					/* This is in here because in here is where the test properties are created 

	// 					!!!: This is actually not working and I'm not sure why. For 'a', I get
	// 					add, face, black, pacman, reading, acronym, magnifying glass. It should be more like
	// 					add, acronym, face, pacman, magnifying glass, black, reading

	// 					Better to always return either 1, -1, or 0?
	// 					*/
	// 						// !!!: TODO: This is terrible. I have to dig way down deep
	// 						var match2 = $(node2).data('matchData').matchesData[0];
	// 						var match1 = $(node1).data('matchData').matchesData[0];

	// 						// If either of the nodes had no matches, somehow put them at the bottom
	// 						// of the rankings
	// 						if ( match2 === undefined ) { match2 = {score: -1000, term: 'z', matchArray: ['z']}; }
	// 						if ( match1 === undefined ) { match1 = {score: -1000, term: 'z', matchArray: ['z']}; }

	// 						var sortResult;
	// 						// If the scores are the same
	// 						if ( match1.score === match2.score ) {
	// 							// Add the number of letters before the first match
	// 							var alt2 = match2.score - match2.matchArray[0].length;
	// 							var alt1 = match1.score - match1.matchArray[0].length;

	// 							sortResult = alt2 - alt1;  // I'm not sure why this works, maybe go with below:
	// 							// if 		( alt2 === alt1 ) { sortResult = 0; }
	// 							// else if ( alt2 > alt1 ) { sortResult = 1; }
	// 							// else { sortResult = -1; }

	// 						} else {

	// 							sortResult = match2.score - match1.score;  // Same as alt note above
	// 							// if ( match2.score > match1.score ) { sortResult = 1; }
	// 							// else 	{ sortResult = -1; }
	// 						}

	// 						return sortResult;
	// 					};  // End matchComparator()

	// 					newChoiceOrder.sort( matchComparator );
	// 					return newChoiceOrder;
	// 				};  // End adder.updateContainerList()


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

