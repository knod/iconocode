/* my-fuzzy-search.js 

Finds all fuzzy matches in an array and
builds them into an html node unless otherwise specified

TODO:
- Make a function that returns an html string too
- If performance gets to be an issue, we can bring the
regex thing in here

*/

'use strict'

var FuzzySearcher = function () {

	var searcher = {};

	var matcher = new FuzzyMatcher( searcher );
	var result = { node: null, matchingElements: [], matchingTerms: [], matchesData: [] }

	// Defaults
	searcher.searchTagName 	= 'ol';  // ol because of ranking?
	searcher.matchTagName 	= 'li';
	searcher.containerClass = 'fuzzy-matches';
	searcher.termClass 		= 'fuzzy-matched-term';

	searcher.maxResults 	= 50;


	searcher.getMatches 	= function( terms, query ) {
	/* ( str, [str] ) -> [ {} ]

	Builds, sorts, and returns an array of matches
	*/
		var matchArray = [];
		for ( var termi = 0; (termi < terms.length) &&
							( termi < searcher.maxResults ) ; termi++ ) {
			// Get possible match data for each word in turn
			var aMatch = matcher.toNode( terms[ termi ], query );
			if ( aMatch !== null ) {
				matchArray.push( aMatch );
			}
		}
		// This is kind of not the same functionality as the rest of the
		// stuff here, but it's so short... Anyway, puts stuff in the right order
		// based on score
		return matchArray.sort( matcher.matchComparator );
	};  // End searcher.getMatches()


	searcher.toNode 		= function( terms, query, tagName ) {

		result = { node: null, matchesData: [], matchingElements: [], matchingTerms: [] };

		// Validator should be separate from the two scripts. Need
		// A utils script, but then it's less self-contained. Which
		// I gues it isn't anymore anyway :(
		var tagName 		= tagName || searcher.searchTagName;
		var node 			= document.createElement( tagName );
		result.node 		= node;
		node.className 		= searcher.containerClass;

		matcher.matchedTermClass = searcher.termClass;

		var matchesData 	= searcher.getMatches( terms, query );
		result.matchesData 	= matchesData;

		for ( var matchi = 0; matchi < matchesData.length; matchi++ ) {
			var match = matchesData[ matchi ];
			node.appendChild( match.node );
			result.matchingElements.push( match.node );
			result.matchingTerms.push( match.term );
		}

		return result;
	};  // End searcher.search()

	// appends them to whatever element matters
		// Makes a dummy element first?
		// Just makes a dummy element so the type of parent is determined by the user?
			// That seems too complicated for the user

	return searcher;
};  // End FuzzySearcher()

// Testing
// var fuzzySearcher = new FuzzySearcher();

// var terms = [
// 	'Update payment method', 'See payment statistics',
// 	'Shopping cart', 'Recently bought', 'Check out',
// 	'Check in', 'ca', 'caa', 'cana', 'crabapple'
// ];

// console.log(fuzzySearcher.toNode( terms, 'ca' ));
