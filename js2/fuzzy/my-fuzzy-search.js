/* my-fuzzy-search.js 

Finds all fuzzy matches in an array and
builds them into an html node unless otherwise specified

TODO:
- Make a function that returns an html string too

*/

'use strict'

var FuzzySearcher = function () {

	var searcher = {};

	var matcher = FuzzyMatcher( searcher );
	var results = { node: null, matchingTerms: [], matchesData: [] }

	// Defaults
	searcher.searchTagName 	= 'ol';  // ol because of ranking?
	searcher.matchTagName 	= 'li';

	searcher.maxResults 	= 50;


	searcher.getMatches 	= function( terms, query ) {
	/* ( str, [str] ) -> [ {} ]

	Builds, sorts, and returns an array of matches
	*/
		var matchArray = [];
		for ( var termi = 0; (termi < terms.length) &&
							( termi < searcher.maxResults ) ; termi++ ) {
			var aMatch = matcher.toNode( terms[ termi ], query );
		// console.log(aMatch)
			if ( aMatch !== null ) {
				matchArray.push( aMatch );
				console.log(aMatch)
			}
		}
		console.log(matchArray);
		// console.log(matchArray);
		// console.log(matchArray.sort( matcher.matchComparator ))
		// This is kind of not the same functionality, but it's so short...
		return matchArray.sort( matcher.matchComparator );
	};  // End searcher.getMatches()


	searcher.matchesToNode 	= function( terms, query, tagName ) {

		// Validator should be separate from the two scripts. Need
		// A utils script, but then it's less self-contained. Which
		// I gues it isn't anymore anyway :(
		var tagName 		= tagName || searcher.searchTagName;
		var node 			= document.createElement( tagName );
		results.node 		= node;

		var matchesData 	= searcher.getMatches( terms, query );
		results.matchesData = matchesData;
// console.log(matchesData);
		for ( var matchi = 0; matchi < matchesData.length; matchi++ ) {
			node.appendChild( matchesData[ matchi ].node );
		}

		// console.log(matchesData)
		console.log(node)
		return results;
	};  // End searcher.search()
	// gets a list of words and a query

	// Sends one word at a time to fuzzy match

	// puts them in some kind of order

	// appends them to whatever element matters
		// Makes a dummy element first?
		// Just makes a dummy element so the type of parent is determined by the user?
			// That seems too complicated for the user

	return searcher;
};  // End FuzzySearcher()

// Testing
var fuzzySearcher = FuzzySearcher();

var terms = [
	'Update payment method', 'See payment statistics',
	'Shopping cart', 'Recently bought', 'Check out',
	'Check in', 'ca', 'caa', 'cana', 'crabapple'
];

console.log(fuzzySearcher.matchesToNode( terms, 'ca' ));
