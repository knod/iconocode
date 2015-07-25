/* my-fuzzy-search-02.js 
* 
* Finds all fuzzy matches in an array and builds them
* into a node. Returns other interesting info as well
* 
* TODO:
* - Make a function that returns an html string too
* http://codereview.stackexchange.com/questions/23899/faster-javascript-fuzzy-string-matching-function
* - If we want to optimize, look at that (also
* 	if we want to optimize, put regex in fuzzy-search)
* - Allow searching using multiple words separated by a ","
* 
* ----------------
* --- NEW PLAN ---
* Should return list of matches, list of non-matches and
* rank of matches
*/

'use strict'

var FuzzySearcher = function () {

	var searcher = {};

	searcher.results = {};  // term: rank

	var matcher = new FuzzyMatcher( searcher );
	var result = { node: null, matchingElements: [], matchingTerms: [], matchesData: [] }

	// Defaults
	// searcher.searchTagName 	= 'ol';  // ol because of ranking?
	searcher.matchTagName 	= 'li';
	searcher.containerClass = 'fuzzy-matches';
	searcher.termClass 		= 'fuzzy-matched-term';

	searcher.maxResults 	= 2000;


	searcher.escapeRegex = function ( str ) {
	/* ( str ) -> Str
	* 
	* !!!: SUPER IMPORTANT FOR SECURITY
	* Escapes all symbols that could be used to call commands to turn them into just text
	*/
		// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}  // End searcher.escapeRegex()


	searcher.queryRegex = function ( query ) {
	/* (str) -> RegExp
	* 
	* Since this is a very unique situation, we'll use the order
	* of the list to our advantage and change it using every other one
	*/
		// .concat() makes .join() work for one char. Can't use .split().push()
		// ? is there because, for example 'Update payement method' with query 'd' will highlight the last 'd'
		var queryArray 		= query.split('').concat([''])
		// Escape the characters that need escaping
		for ( var chari = 0; chari < queryArray.length; chari++ ) {
			queryArray[ chari ] = searcher.escapeRegex( queryArray[ chari ] );
		}
		// Get possible letters in between and after matching letters
		var regexMiddle 	= queryArray.join( ')(.*?)(' );
		// Get possible letters before matching letters, close off the end
		var regexStr 	= '(.*?)(' + regexMiddle + ')';
		// Without this, we cut off the last word and () get '' at the end with an extra span
		regexStr = regexStr.replace( "(.*?)()", '(.*)' );

		// 'i' means case doesn't matter. RegExp() adds in the start and end '/'
		return ( new RegExp( regexStr, 'i' ) )
	};  // End searcher.queryRegex()


	searcher.getMatches = function( terms, query ) {
	/* ( str, [str] ) -> [ {} ]
	* 
	* Builds, sorts, and returns an array of matches
	*/
		var matchArray = []
		var queryRegex = searcher.queryRegex( query );

		for ( var termi = 0; ( termi < terms.length ) &&
							 ( termi < searcher.maxResults ); termi++ ) {
			// Get possible match data for each word in turn
			matcher.matchedTermClass = searcher.termClass;
			// In case user has changed this to something like '<span>'
			var matchTagName = searcher.matchTagName.replace( /[<> ]/g, '' )
			
			var term = terms[ termi ];
			var aMatch = matcher.toNode( term, query, queryRegex, matchTagName );
			
			// Added .doesMatch, also properties for a term that doesn't match the query

			// if ( aMatch === null ) {
			// 	// Make a 'match' that will have a really low rank
			// 	var aMatch = {
			// 		doesMatch: false,
			// 		term: term, query: query,
			// 		node: document.createElement('li'),  // Not correct, but this functionality will be removed later anyway
			// 		matchArray: [''], score: -1000
			// 	}
			// } else {
			// 	aMatch.doesMatch = true;
			// }
			matchArray.push( aMatch );

		}

		// This doesn't quite fit here , but it's so short... Anyway,
		// puts stuff in the right order based on score
		return matchArray.sort( matcher.matchComparator );
	};  // End searcher.getMatches()


	searcher.buildResults = function ( sortedMatches ) {
	/* Creates results values in appropriate format */

		var results 	= { matches: [], failures: [], matchesData: {}, failuresData: {} };
		var numTerms 	= sortedMatches.length;

		for ( var matchi = 0; matchi < numTerms; matchi++ ) {
			
			var match 	= sortedMatches[ matchi ];
			// Rank helps sort them when they're not in an array
			// Build list with arrayName[ obj.rank ] = obj;
			// Smaller number is higher rank
			var rank 	= matchi;  // sortedMatches is already ordered by rank, so index == rank
			var obj 	= { 
				'doesMatch': match.doesMatch,
				'rank'		: rank,
				'score'		: match.score,
				'matchArray': match.matchArray
			};

			if ( match.doesMatch === true ) {
				results.matches.push( match.term );
				results.matchesData[ match.term ] = obj;
			} else {
				results.failures.push( match.term );
				results.failuresData[ match.term ] = obj;
			}
		}

		return results;
	};  // End searcher.buildResults()


	// This is not a good name, but I don't know what is
	searcher.runSearch = function( terms, query ) {
	/* ( [str], str, str ) -> { failures: { term: { matchData } }, matches: {} }
	* Returned matchData: doesMatch, rank, score, matchArray
	* 
	*/
		// result = { node: null, matchesData: [], matchingElements: [], matchingTerms: [] };

		// TODO: Validator should be separate from the two scripts. Need
		// A utils script, but then it's less self-contained. Which
		// I gues it isn't anymore anyway :(
		// var tagName 		= tagName || searcher.searchTagName;
		// tagName = tagName.replace( /[<> ]/g, '' );

		// var node 			= document.createDocumentFragment();
		// result.node 		= node;
		// node.className 		= searcher.containerClass;

		if ( query.length > 0 ) {
			// Array of data from the matcher functions
			var matchesData = searcher.getMatches( terms, query );
			// Objects in the format we need them
			var results 	= searcher.buildResults(matchesData);
			// console.log(results);
			// result.matchesData 	= matchesData;
		}

		// for ( var matchi = 0; matchi < matchesData.length; matchi++ ) {
		// 	var match = matchesData[ matchi ];
		// 	node.appendChild( match.node );
		// 	result.matchingElements.push( match.node );
		// 	result.matchingTerms.push( match.term );
		// }

		return results;
	};  // End searcher.runSearch()

	return searcher;
};  // End FuzzySearcher()

// Testing
// var fuzzySearcher = new FuzzySearcher();

// var terms = [
// 	'Update payment method', 'See payment statistics',
// 	'Shopping cart', 'Recently bought', 'Check out',
// 	'Check in', 'ca', 'caa', 'cana', 'crabapple'
// ];

// console.log(fuzzySearcher.search( terms, 'ca' ));
