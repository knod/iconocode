/* my-fuzzy-match.js
* 
* Tests a term to see if it contains the letters from a query
* in it. The letters have to be in the same order, but they
* don't have to be next to each other. For example, if the
* query is 'al' and the term is 'crabapple', it will match
* because 'crabapple' has an 'l' that is after an 'a'.
* 
* It will also score the match based on how close the
* matching letters are to each other. The above example
* would get a score of -4 because 4 letters are between the
* first 'a' and the first 'l'.
* 
* It creates either a node or an html string, depending on
* which function was called.
* 
* It returns all that interesting info to something that will
* deal with comparing the strings.
* 
* ??: Each stylized letter will be a span with a class? Users
* will be responsible for styling that class themselves? But
* then they don't have immediate visible funcitonality...
* 
* I can still mostly use the scoring system from fuzzy.js
* (Ben Ripkens)
* Actually, I think mine works a bit better and negates
* the need for separate subterm treatment
* 
*
* TODO:
* 
*/

'use strict'

var FuzzyMatcher = function ( context ) {
/* ( obj ) -> FuzzyMatcher (context not currently needed)
* 
* This object's functions test one term only.
* 
* Tests a term to see if it contains the letters from a query
* in it. The letters have to be in the same order, but they
* don't have to be next to each other. For example, if the
* query is 'al' and the term is 'crabapple', it will match
* because 'crabapple' has an 'l' that is after an 'a'.
* 
* It will also score the match based on how close the
* matching letters are to each other. The above example
* would get a score of -4 because 4 letters are between the
* first 'a' and the first 'l'.
* 
* It also creates either a node or an html string, depending
* on which function was called.
* 
* All that stuff is returned in an object.
*/

	var matcher = {};

	var result;
	matcher.matchedLetterClass 	= 'fuzzy-matched-letter';
	matcher.matchedTermClass	= 'fuzzy-matched-term';
	matcher.defaultTag 			= 'li';


	matcher.calcScore 		= function ( matchArray ) {
	/* ( [] ) -> matchArray
	* 
	* Match loses points based on number of letters found between matches.
	* Note: str.match()[0] === str
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
	* 
	* If a tagName hasn't been provided, return the default tag name.
	* Otherwise take out any superfluous characters, like < and >, and
	* give a warning if it's not an 'approved' tag name.
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
	matcher.getMatch 		= function ( term, query, queryRegex ) {
		var matchArray	= term.match( queryRegex )
		// Leave out the first group, which is just the term
		if ( matchArray !== null ) { matchArray	 = matchArray.slice(1); }
		// console.log(matchArray)
		return matchArray
	};  // End matcher.getMatch()


	// ===================
	// STRING
	// ===================
	matcher.buildHTML 		= function ( matchArray ) {
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


	matcher.toString 		= function ( term, query, queryRegex, tagName ) {
	/* ( str, str, str ) -> Str or null
	* 
	* Returns null if no match is found
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


	// ===================
	// NODE
	// ===================
	matcher.addText 		= function ( nodeStr, parentNode ) {
		var textNode = document.createTextNode( nodeStr );
		parentNode.appendChild( textNode );
		return textNode
	};  // End matcher.addText()


	matcher.buildNode 		= function ( matchArray ) {
	/* ( [] ) -> Node */

		var numGroups 	= matchArray.length;
		for ( var groupi = 0; groupi < numGroups; groupi++ ) {

			var chars = matchArray[ groupi ];
			// If group is even, it matched .*, which isn't styled text
			if ( groupi % 2 === 0 ) {

				matcher.addText( chars, result.node );
			// If the group is odd, it's a match to an actual letter
			} else {

				var matchLetterNode 		= document.createElement( 'span' );
				matchLetterNode.className 	= matcher.matchedLetterClass;
				result.node.appendChild( matchLetterNode );

				matcher.addText( chars, matchLetterNode );
			}  // end if even
		}  // end for each array of letters

		return result.node;
	};  // End matcher.buildNode()


	matcher.toNode 			= function ( term, query, queryRegex, tagName ) {
	/* ( str, str, str ) -> Node or null
	* 
	* Returns null if no match is found
	* If you want to see how to make a queryRegex, look at fuzzy searcher
	* script.
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
	/* This is in here because in here is where the test properties are created */
		return m2.score - m1.score;
	};


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

// Test
// var fuzzyMatcher = FuzzyMatcher( window );  // context not currently needed
