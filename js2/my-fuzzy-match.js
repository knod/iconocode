/* my-fuzzy-match.js

Because this charcter finding thing is such a specific
use case, there actually may be a way to make it a lot
faster!

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

	// What was I going to use this for?
	// fuzzy.str 					= "";

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
			// console.log('score: ', score)
		}

		return score;
	};  // End fuzzy.calcScore()


	// ===================
	// TAGNAME
	// ===================
	fuzzy.sanitizeTagName = function ( tagName ) {
	/* ( str ) -> Str
	*/
		var toRemove = ['<', '>', '"', "'"];

		for ( var chari = 0; chari < toRemove.length; chari++ ) {
			tagName = tagName.replace( toRemove[ chari ], '' );
		}
		// console.log( 'sanitized tagname:', tagName );

		return tagName;
	};  // End fuzzy.sanitizeTagName()


	fuzzy.tagNameIsValid = function ( tagName ) {
	/* ( str ) -> Bool

	Checks if the tagName is in the list of approved tag names.
	Gives a warning if the tagname isn't valid.

	'' will indicate that someone doesn't want an html element.
	Not sure what to do if that's given to fuzzy.toNode()
	*/
		tagName = fuzzy.sanitizeTagName( tagName );

		var isValid = false;
		if ( (tagName === '') || (HMT5Tags.indexOf( tagName ) > -1) ) {
			isValid = true;
		} else {
			console.warn( 'The string "' + tagName + '" is not recognized ' +
				'as a valid tag name as of 2015. Source ' +
				'https://developer.mozilla.org/en-US/docs/Web/HTML/Element. ' +
				'Default ' + tagName + 'will be used' );
		}

		return isValid;
	};  // End fuzzy.tagNameIsValid()


	var determineTagName = function ( tagName ) {
		// Decide what tag name to use - given or default
		var nodeTag = fuzzy.resultTag;

		if ( (tagName !== undefined) && (fuzzy.tagNameIsValid( tagName ) === true) ) {
			nodeTag = tagName;
		}
		return nodeTag;
	};  // End determineTagName()


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
	fuzzy.addTextNode = function ( nodeStr, parentNode ) {
		var textNode = document.createTextNode( nodeStr );
		parentNode.appendChild( textNode );
		return textNode
	};  // End fuzzy.addTextNode()


	// These two would have to be different for node vs. html str
	fuzzy.addNonQueryGroup = function () {};  // End fuzzy.addNonQueryGroup()
	fuzzy.addQueryLetter = function () {};  // End fuzzy.addQueryLetter

	// I have no idea what this does or how I might use it,
	// but it seems like something...
	fuzzy.forEveryOther = function ( array, ifEven, ifOdd ) {

		var numItems 	= array.length;
		var resultArray = [];

		for ( var indx = 0; indx < numItems; indx++ ) {

			var item = array[ indx ];

			if ( indx % 2 === 0 ) {
				resultArray.push( ifEven( item ) );
			} else {
				resultArray.push( ifOdd( item ) );
			}  // end if even
		}  // end for each array of letters

		return resultArray;
	};  // End fuzzy.forEveryOther()


	fuzzy.buildStrResult = function ( matchArray ) {};  // End fuzzy.buildStr()


	fuzzy.buildNode = function ( matchArray ) {

		var numGroups 	= matchArray.length;

		for ( var groupi = 0; groupi < numGroups; groupi++ ) {

			var chars = matchArray[ groupi ];
			// If group is even, it matched .*, which isn't styled text
			if ( groupi % 2 === 0 ) {

				fuzzy.addTextNode( chars, fuzzy.result.node );

			// If the group is odd, it's a match to an actual letter
			} else {

				var matchLetterNode 		= document.createElement( 'span' );
				matchLetterNode.className 	= fuzzy.matchedLetterClass;
				fuzzy.result.node.appendChild( matchLetterNode );

				fuzzy.addTextNode( chars, matchLetterNode );

			}  // end if even
		}  // end for each array of letters

		return fuzzy.result.node;
	};  // End fuzzy.buildNode()


	// ===================
	// STUFF
	// ===================
	fuzzy.toString = function ( term, query, tagName ) {
	/*


	*/
		// fuzzy.result 				= {
		// 	term: "", query: "", score: 0, matchArray: [],
		// 	htmlString: "", node: null
		// };	
		// Create the provided element, or a default one
		var htmlTag 		= determineTagName( tagName );
		
		var match = fuzzy.getMatch( term, query );

		if ( match !== null ) {

		}

// fuzzy-match class for letters
// fuzzy-found class for words
// entry.tagName (for use in fuzzy list search )

	};  // End fuzzy.toString()


	fuzzy.toNode = function ( term, query, tagName ) {
	/*


	*/
		var result_ = fuzzy.result;
		result_.term 	= term; result_.query 	= query;

		// Create the provided element, or a default one
		var nodeTag = determineTagName( tagName );

		if ( nodeTag !== '' ) {

			var resultNode 	= document.createElement( nodeTag );
			result_.node 	= resultNode;

			var matches 	= fuzzy.getMatch( term, query );
			if ( matches !== null ) {

				result_.matchArray = matches;
				result_.score = fuzzy.calcScore( matches );
				fuzzy.buildNode( matches );

				console.log(resultNode)

			// ??: If there wasn't a match, what do I return?
			}  else {
				return null;  // ??
			} // end if match

		} else {
			console.error( "A node can't be made with no tag name. If you want a string, use fuzzy.toString." );
		}  // end if tagName !== ''

		return result_;
	};  // End fuzzy.toNode()
	// fuzzy.numMatched letters


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
  fuzzy.analyzeSubTerms = false;

  /*
   * How many sub terms should be analyzed.
   */
  fuzzy.analyzeSubTermDepth = 10;

  fuzzy.highlighting = {
    before: '<em>',
    after: '</em>'
  };

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
