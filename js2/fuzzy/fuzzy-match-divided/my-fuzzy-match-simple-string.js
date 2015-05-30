/* my-fuzzy-match-simple-string.js

If I take out all the validation stuff, down to
bare bones, how compact does it get? Do I sacrifice
readability for this goal as well?
*/

'use strict'

var MyFuzzy = function ( context ) {

	var fuzzy = {};

	fuzzy.result = { term: "", query: "", score: 0, matchArray: [], htmlString: "" };
	fuzzy.matchedLetterClass 	= 'fuzzy-matched-letter';
	fuzzy.matchedWordClass		= 'fuzzy-matched-word';
	fuzzy.defaultTag 			= 'li';


	fuzzy.calcScore = function ( matchArray ) {
	/* ( [] ) -> matchArray

	Match loses points based on number of letters found between
	matches.
	Note: str.match()[0] === str
	*/
		var score = 0;

		var numGroups = matchArray.length;
		// Don't lose points for number of letters before the first match is found
		for ( var groupi = 1; groupi < numGroups; groupi++ ) {
			// Don't lose points for number of letters after the final match
			if ( (groupi % 2 === 0) && (groupi < (numGroups - 1)) ) {
				score -= matchArray[ groupi ].length;
			}
		}

		return score;
	};  // End fuzzy.calcScore()


	// ===================
	// STRING MATCHING
	// ===================
	fuzzy.buildRegExp = function ( query ) {
	/* (str) -> RegExp

	Since this is a very unique situation, we'll use the order
	of the list to our advantage and change it using every other one
	*/
		// .concat() makes .join() work for one char. Can't use .split().push()
		var regexMiddle = query.split('').concat(['']).join( ')(.*)(' );
		var regexStr 	= '(.*)(' + regexMiddle + ')';  // empty paren at the end won't return anything
		regexStr 		= regexStr.replace( "()", '' );  // otherwise, get '' at the end with an extra span
		// 'i' means case doesn't matter. RegExp() adds in the start and end '/'
		return ( new RegExp( regexStr, 'i' ) )
	};  // End fuzzy.buildRegExp()


	fuzzy.getMatch = function ( term, query ) {
		var regex 		= fuzzy.buildRegExp( query );
		var matchArray	= term.match( regex )
		// Leave out the first group, which is just the term
		if ( matchArray !== null ) { matchArray	 = matchArray.slice(1); }
		return matchArray
	};  // End fuzzy.getMatch()


	// ===================
	// STUFF
	// ===================
	fuzzy.toString = function ( term, query, tagName ) {
	/* ( str, str, str ) -> Str or null

	Returns null if no match is found
	*/
		var result_ 	= fuzzy.result;
		result_.term 	= term; result_.query 	= query;

		// Create the provided element, or a default one
		var htmlTag = tagName || fuzzy.defaultTag;

		var matches 	= fuzzy.getMatch( term, query );
		if ( matches !== null ) {

			result_.matchArray 	= matches;
			result_.score 		= fuzzy.calcScore( matches );

			var html 		= '';
			var numGroups 	= matches.length;
			for ( var groupi = 0; groupi < numGroups; groupi++ ) {
				// If group is even, it matched .*, which isn't styled text
				if ( groupi % 2 === 0 ) {
					html = html + matches[ groupi ];
				// If the group is odd, it's a match to an actual letter
				} else {
					html = html + '<span class="' + fuzzy.matchedLetterClass +
									'">' + matches[ groupi ] + '</span>';
				}  // end if even
			}  // end for each array of letters

			result_.htmlString 	= '<' + htmlTag + ' class="' +
					fuzzy.matchedWordClass +
					'">' + html + '</' + htmlTag + '>';
		// ??: If there wasn't a match, what do I return?
		}  else {
			result_ = null;  // ??
		} // end if match

		return result_;
	};  // End fuzzy.toString()


  fuzzy.matchComparator = function(m1, m2) {
  	// might need Math.abs(m1.score) - Math.abs(m2.score)?
  	// on the other hand: http://stackoverflow.com/questions/2961047/javascript-sorting-arrays-containing-positive-and-negative-decimal-numbers
    return m2.score - m1.score;
  };

  /*
   * Whether or not fuzzy.js should analyze sub-terms, i.e. also
   * check term starting positions != 0.
   *
   * Example:
   * Given the term 'Halleluja' and query 'luja'
   *
   * Fuzzy.js scores this combination with an 8, when analyzeSubTerms is
   * set to false, as the following matching string will be calculated:
   * Ha[l]lel[uja]
   *
   * If you activate sub temr analysis though, the query will reach a score
   * of 10, as the matching string looks as following:
   * Halle[luja]
   *
   * Naturally, the second version is more expensive than the first one.
   * You should therefore configure how many sub terms you which to analyse.
   * This can be configured through fuzzy.analyzeSubTermDepth = 10.
   */
  // fuzzy.analyzeSubTerms = false;

  /*
   * How many sub terms should be analyzed.
   */
  // fuzzy.analyzeSubTermDepth = 10;

  // fuzzy.highlighting = {
  //   before: '<em>',
  //   after: '</em>'
  // };

/*
   * Exporting the public API
   * ------------------------
   * In a browser, the library will be available through this.fuzzy. Should
   * requireJS be used, we register fuzzy.js through requireJS.
   * For other environments, CommonJS is supported.
   */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = fuzzy;
  } else if (typeof define === 'function') {
    define(function() {
      return fuzzy;
    });
  } else {
    /*
	This was from Ben Ripkins. I have no idea what it means
     * In case the global variable fuzzy needs to be reset to its previous
     * value, the fuzzy library is returned by this method.
     */
    // var previousFuzzy = context.fuzzy;
    // fuzzy.noConflict = function() {
    //   context.fuzzy = previousFuzzy;
    //   return fuzzy;
    // };

    // context.fuzzy = fuzzy;
  }

  return fuzzy;
};

// Testing:
var myFuzzy = MyFuzzy( window );

