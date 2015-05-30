/* my-fuzzy-match-simple-node.js

!!! Don't know if this works yet

Because this charcter finding thing is such a specific
use case, there actually may be a way to make it a lot
"simpler"!

In that other script, I was making room for multiple
use cases, now I'm just dealing with one.

I can still mostly use the scoring system from fuzzy.js
(Ben Ripkens)

Each stylized letter will be a span with a class? Users
will be responsible for styling that class themselves?
But then they don't have immediate visible funcitonality...
*/

'use strict'

var MyFuzzy = function ( context ) {


	var fuzzy = {};

	fuzzy.result 				= {
		term: "", query: "", score: 0, matchArray: [],
		htmlString: "", node: null
	};

	fuzzy.matchedLetterClass 	= 'fuzzy-matched-letter';
	fuzzy.resultTag 			= 'li';


	fuzzy.calcScore = function ( matchArray ) {
	/* ( [] ) -> matchArray

	Match loses points based on number of letters found between
	matches.
	Note: str.match()[0] === str
	*/
		var score = 0;
		// The first thing in the array is always the original string, take it out
		matchArray = matchArray.slice(1);
		var numGroups = matchArray.length;
		// Don't lose points for number of letters before the first match is found
		for ( var groupi = 1; groupi < numGroups; groupi++ ) {
			// Don't lose points for number of letters after the final match
			if ( (groupi % 2 !== 0) && (groupi < (numGroups - 1)) ) {
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
		var regexMiddle 	= query.split('').concat(['']).join( ')(.*)(' );
		var regexStr 	= '(.*)(' + regexMiddle + ')';  // empty paren at the end won't return anything
		regexStr = regexStr.replace( "()", '' );  // otherwise, get '' at the end with an extra span
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
	// DOM
	// ===================
	fuzzy.buildNode = function ( matchArray ) {

		var numGroups 	= matchArray.length;

		for ( var groupi = 0; groupi < numGroups; groupi++ ) {

			var chars = matchArray[ groupi ];
			// If group is even, it matched .*, which isn't styled text
			if ( groupi % 2 === 0 ) {

				var textNode = document.createTextNode( chars );
				fuzzy.result.node.appendChild( textNode );

			// If the group is odd, it's a match to an actual letter
			} else {
				var matchLetterNode 		= document.createElement( 'span' );
				matchLetterNode.className 	= fuzzy.matchedLetterClass;
				fuzzy.result.node.appendChild( matchLetterNode );

				var textNode = document.createTextNode( chars );
				matchLetterNode.appendChild( textNode );
			}  // end if even
		}  // end for each array of letters
		console.log(fuzzy.result.node);
		return fuzzy.result.node;
	};  // End fuzzy.buildNode()


	// ===================
	// STUFF
	// ===================
	fuzzy.toNode = function ( term, query, tagName ) {
	/*


	*/
		var result_ = fuzzy.result;
		result_.term 	= term; result_.query 	= query;

		// Create the provided element, or a default one
		var nodeTag = tagName || fuzzy.resultTag;

		var resultNode 	= document.createElement( nodeTag );
		result_.node 	= resultNode;

		var matches 	= fuzzy.getMatch( term, query );
		if ( matches !== null ) {

			result_.matchArray = matches;
			result_.score = fuzzy.calcScore( matches );
			fuzzy.buildNode( matches );

		// ??: If there wasn't a match, what do I return?
		}  else {
			return null;  // ??
		} // end if match

		return result_;
	};  // End fuzzy.toNode()
	// fuzzy.numMatched letters


	fuzzy.matchComparator = function (m1, m2) {
		return m2.score - m1.score;
	};  // End fuzzy.matchComparator()


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

var myFuzzy = MyFuzzy( window );


