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
- For fuzzy list search, remember: entry.tagName

*/

'use strict'

var MyFuzzy = function ( context ) {

	var fuzzy = {};

	fuzzy.result 				= {
		term: "", query: "", score: 0, matchArray: [],
		htmlString: "", node: null
	};
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
	// TAGNAME
	// ===================
	var sanitizeTagName = function ( tagName ) {
	/* ( str ) -> Str

	If a tagName hasn't been provided, return the default
	tag name.
	Otherwise take out any superfluous characters, like < and
	>, and give a warning if it's not an 'approved' tag name.
	*/
		var defaultTag_ = fuzzy.defaultTag;

		if ( tagName === undefined ) { tagName = defaultTag_; }
		else {

			tagName = tagName.replace( /[<>]/g, '' );  // Are there any others to watch for?
			// ?? What are invalid characters in custom html tags? Should I remove them?
			// http://w3c.github.io/webcomponents/spec/custom/#concepts
			// tagName.replace( /[^a-z0-9-]/g, '' );  // case is important
		}  // End if tagname is or isn't undefined

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

		console.log(tagName)

		return tagName;
	};  // End sanitizeTagName()


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


	fuzzy.buildHTML = function ( matchArray ) {
	/* ( [] ) -> Str */
		var html 		= '';

		var numGroups 	= matchArray.length;
		for ( var groupi = 0; groupi < numGroups; groupi++ ) {

			// If group is even, it matched .*, which isn't styled text
			if ( groupi % 2 === 0 ) {

				html = html + matchArray[ groupi ];
			// If the group is odd, it's a match to an actual letter
			} else {

				html = html + '<span class="' + fuzzy.matchedLetterClass +
								'">' + matchArray[ groupi ] + '</span>';
			}  // end if even
		}  // end for each array of letters

		return html;
	};  // End fuzzy.buildStr()


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

		var matches 	= fuzzy.getMatch( term, query );
		if ( matches !== null ) {

			result_.matchArray 	= matches;
			result_.score 		= fuzzy.calcScore( matches );

			var htmlTag 		= sanitizeTagName( tagName );
			var html 			= fuzzy.buildHTML( matches );
			result_.htmlString 	= '<' + htmlTag + ' class="' +
					fuzzy.matchedWordClass +
					'">' + html + '</' + htmlTag + '>';

			// console.log(result_.htmlString)

		// ??: If there wasn't a match, what do I return?
		}  else {
			result_ = null;  // ??
		} // end if match

		return result_;


	};  // End fuzzy.toString()


	fuzzy.buildNode = function ( matchArray ) {
	/* ( [] ) -> Node */

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


	fuzzy.toNode = function ( term, query, tagName ) {
	/* ( str, str, str ) -> Node or null

	Returns null if no match is found
	*/
		var result_ = fuzzy.result;
		result_.term 	= term; result_.query 	= query;

		// Create the provided element, or a default one
		var nodeTag = sanitizeTagName( tagName );

		var resultNode 			= document.createElement( nodeTag );
		resultNode.className 	= fuzzy.matchedWordClass;
		result_.node 			= resultNode;

		var matches 			= fuzzy.getMatch( term, query );
			if ( matches !== null ) {

				result_.matchArray = matches;
				result_.score = fuzzy.calcScore( matches );
				fuzzy.buildNode( matches );

				// console.log(resultNode)
			// ??: If there wasn't a match, what do I return?
			}  else {
				result_ = null;  // ??
			} // end if match

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

var myFuzzy = MyFuzzy( window );
