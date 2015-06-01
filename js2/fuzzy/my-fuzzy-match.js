/* my-fuzzy-match.js

Because this charcter finding thing is such a specific
use case, there actually may be a way to make it a lot
faster!

I can still mostly use the scoring system from fuzzy.js
(Ben Ripkens)

Each stylized letter will be a span with a class? Users
will be responsible for styling that class themselves?
But then they don't have immediate visible funcitonality...

TODO:
- Change behavior of tag validation. Keep whatever tag name
they give, just give a warning if it's not on the approved
list
http://codereview.stackexchange.com/questions/23899/faster-javascript-fuzzy-string-matching-function
- Properly escape non-alphanumeric characters from that
- Also, if we want to optimize, look at that (also
	if we want to optimize, put regex in fuzzy-search)

*/

'use strict'

var FuzzyMatcher = function ( context ) {

	var matcher = {};

	var result;
	matcher.matchedLetterClass 	= 'fuzzy-matched-letter';
	matcher.matchedTermClass	= 'fuzzy-matched-term';
	matcher.defaultTag 			= 'li';


	matcher.calcScore = function ( matchArray ) {
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
	};  // End matcher.calcScore()


	// ===================
	// TAGNAME
	// ===================
	matcher.sanitizeTagName = function ( tagName ) {
	/* ( str ) -> Str

	If a tagName hasn't been provided, return the default
	tag name.
	Otherwise take out any superfluous characters, like < and
	>, and give a warning if it's not an 'approved' tag name.
	*/
		var defaultTag_ = matcher.defaultTag;

		tagName = tagName || defaultTag_;
		tagName = tagName.replace( /[<>]/g, '' );
		// Are there any others to watch for?
		// ?? What are invalid characters in custom html tags? Should I remove them?
		// http://w3c.github.io/webcomponents/spec/custom/#concepts
		// tagName.replace( /[^a-z0-9-]/g, '' );  // no uppercase allowed

		if ( tagName === "''" || tagName === '""' || tagName === '' ) {
			console.warn( 'Provind an empty string does not stop the creation of ' +
				'an element, it will just be an invalid element. If you want to ' + 
				'just find matches and use them as strings, use the .term property ' +
				'of the returned value.' );
		}

		if ( HTML5Tags.indexOf( tagName ) === -1 ) {
			console.warn( 'The string "' + tagName + '" is not recognized ' +
				'as a valid tag name as of 2015. Your element may be an unregistered ' +
				'element or you may get an error. Source ' +
				'https://developer.mozilla.org/en-US/docs/Web/HTML/Element. ' +
				'Also check out http://w3c.github.io/webcomponents/spec/custom/#concepts.');
		}

		return tagName;
	};  // End matcher.sanitizeTagName()


	// ===================
	// STRING MATCHING
	// ===================
	matcher.getMatch = function ( term, query, queryRegex ) {
		var matchArray	= term.match( queryRegex )
		// Leave out the first group, which is just the term
		if ( matchArray !== null ) { matchArray	 = matchArray.slice(1); }
		// console.log(matchArray)
		return matchArray
	};  // End matcher.getMatch()


	// ===================
	// DOM
	// ===================
	matcher.addTextNode = function ( nodeStr, parentNode ) {
		var textNode = document.createTextNode( nodeStr );
		parentNode.appendChild( textNode );
		return textNode
	};  // End matcher.addTextNode()


	// I have no idea what this does or how I might use it,
	// but it seems like something...
	matcher.forEveryOther = function ( array, ifEven, ifOdd ) {

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
	};  // End matcher.forEveryOther()


	matcher.buildHTML = function ( matchArray ) {
	/* ( [] ) -> Str */
		var html 		= '';

		var numGroups 	= matchArray.length;
		for ( var groupi = 0; groupi < numGroups; groupi++ ) {

			// If group is even, it matched .*, which isn't styled text
			if ( groupi % 2 === 0 ) {

				html = html + matchArray[ groupi ];
			// If the group is odd, it's a match to an actual letter
			} else {

				html = html + '<span class="' + matcher.matchedLetterClass +
								'">' + matchArray[ groupi ] + '</span>';
			}  // end if even
		}  // end for each array of letters
		// console.log(html)
		return html;
	};  // End matcher.buildStr()


	// ===================
	// STUFF
	// ===================
	matcher.toString = function ( term, query, queryRegex, tagName ) {
	/* ( str, str, str ) -> Str or null

	Returns null if no match is found
	*/
		var result_ 	= result;
		result_.term 	= term; result_.query 	= query;

		// Create the provided element, or a default one

		var matches 	= matcher.getMatch( term, query, queryRegex );
		if ( matches !== null ) {

			result_.matchArray 	= matches;
			result_.score 		= matcher.calcScore( matches );

			var htmlTag 		= matcher.sanitizeTagName( tagName );
			var html 			= matcher.buildHTML( matches );
			result_.htmlString 	= '<' + htmlTag + ' class="' +
					matcher.matchedTermClass +
					'">' + html + '</' + htmlTag + '>';

		// ??: If there wasn't a match, what do I return?
		}  else {
			result_ = null;  // ??
		} // end if match

		return result_;
	};  // End matcher.toString()


	matcher.buildNode = function ( matchArray ) {
	/* ( [] ) -> Node */

		var numGroups 	= matchArray.length;
		for ( var groupi = 0; groupi < numGroups; groupi++ ) {

			var chars = matchArray[ groupi ];
			// If group is even, it matched .*, which isn't styled text
			if ( groupi % 2 === 0 ) {

				matcher.addTextNode( chars, result.node );

			// If the group is odd, it's a match to an actual letter
			} else {

				var matchLetterNode 		= document.createElement( 'span' );
				matchLetterNode.className 	= matcher.matchedLetterClass;
				result.node.appendChild( matchLetterNode );

				matcher.addTextNode( chars, matchLetterNode );

			}  // end if even
		}  // end for each array of letters

		return result.node;
	};  // End matcher.buildNode()


	matcher.toNode = function ( term, query, queryRegex, tagName ) {
	/* ( str, str, str ) -> Node or null

	Returns null if no match is found
	*/
		result = {};
		result.term 	= term; result.query 	= query;

		// Create the provided element, or a default one
		var nodeTag = matcher.sanitizeTagName( tagName );

		var resultNode 				= document.createElement( nodeTag );
		result.node 				= resultNode;
		resultNode.className 		= matcher.matchedTermClass;
		resultNode.dataset['term'] 	= term;

		var matches 				= matcher.getMatch( term, query, queryRegex );
			if ( matches !== null ) {

				result.matchArray = matches;
				result.score = matcher.calcScore( matches );
				matcher.buildNode( matches );

				// console.log(resultNode)
			// ??: If there wasn't a match, what do I return?
			}  else {
				result = null;  // ??
			} // end if match

		return result;
	};  // End matcher.toNode()
	// matcher.numMatched letters


  matcher.matchComparator = function(m1, m2) {
  /* This is in here because here is where the properties used are created */
  	// might need Math.abs(m1.score) - Math.abs(m2.score)?
  	// on the other hand: http://stackoverflow.com/questions/2961047/javascript-sorting-arrays-containing-positive-and-negative-decimal-numbers
  	// console.log('m1:', m1.term, m1.score)
  	// console.log('m2:', m2.term, m2.score)
    return m2.score - m1.score;
  };

  /*
   * Whether or not matcher.js should analyze sub-terms, i.e. also
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
   * This can be configured through matcher.analyzeSubTermDepth = 10.
   */
  // matcher.analyzeSubTerms = false;

  /*
   * How many sub terms should be analyzed.
   */
  // matcher.analyzeSubTermDepth = 10;

  // matcher.highlighting = {
  //   before: '<em>',
  //   after: '</em>'
  // };

/*
   * Exporting the public API
   * ------------------------
   * In a browser, the library will be available through this.matcher. Should
   * requireJS be used, we register matcher.js through requireJS.
   * For other environments, CommonJS is supported.
   */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = matcher;
  } else if (typeof define === 'function') {
    define(function() {
      return matcher;
    });
  } else {
    /*
	This was from Ben Ripkins. I have no idea what it means
     * In case the global variable matcher needs to be reset to its previous
     * value, the matcher library is returned by this method.
     */
    // var previousFuzzy = context.matcher;
    // matcher.noConflict = function() {
    //   context.matcher = previousFuzzy;
    //   return matcher;
    // };

    // context.matcher = matcher;
  }

  return matcher;
};

// var fuzzyMatcher = FuzzyMatcher( window );
