/* my-fuzzy.js

Because this charcter finding thing is such a specific
use case, there actually may be a way to make it a lot
faster!

I can still mostly use the scoring system from fuzzy.js
(Ben Ripkens)

*/

'use strict'

var MyFuzzy = function ( context ) {


	var fuzzy = {};

	// Each result will take the form of:
	// { term: "", query, "", score: #, matchArray: [], htmlString: "", node: Node }
	fuzzy.results = [];
	fuzzy.str 		= "";

	fuzzy.resultTag = 'li';
	fuzzy.node 		= null;



	fuzzy.buildRegExp = function ( query ) {
	/* (str) -> RegExp

	Since this is a very unique situation, we'll use the order
	of the list to our advantage and change it using every other one
	*/
		var queryArray 	= query.split('');

		var regexEnd 	= queryArray.join( '{1}.*' );  // {1} is automatic, not needed
		var regexStr 	= '.*' + regexEnd;

		// 'i' means case doesn't matter. RegExp() adds in the start and end '/'
		return ( new RegExp( regexStr, 'i' ) )
	};  // End fuzzy.buildRegex()


	// fuzzy.getMatchData = function ( query,  ) {
	
	
	// Note: str.match()[0] === str
	



	// };  // End fuzzy.getMatchData()


	fuzzy.buildStrResult = function ( matchArray ) {};  // End fuzzy.buildStr()


	fuzzy.buildNode = function ( matchArray ) {};  // End fuzzy.buildNode()


	fuzzy.calcScore = function ( matchArray ) {
	/* ( [] ) -> matchArray

	Match looses points based on number of letters found between
	matches.
	*/
		var score = 0;
		// The first thing in the array is always the original string, take it out
		matchArray = matchArray.slice(1);
		console.log( '-------non-term array: ', matchArray );
		var numGroups = matchArray.length;

		// Don't lose points for number of letters before the first match is found
		for ( var groupi = 1; groupi < numGroups; groupi++ ) {
			console.log( groupi, ":", matchArray[groupi])
			// Test
			// if ( groupi < (numGroups - 1 ) ) { console.log( 'last-group: ', matchArray[ groupi ]); }
			// Don't lose points for number of letters after the final match
			if ( (groupi % 2 === 0) && (groupi < (numGroups - 1)) ) {
				score -= matchArray[ groupi ].length;
			}
			console.log('score: ', score)
		}

		return score;
	};  // End fuzzy.calcScore()


	fuzzy.addOnePrediction = function ( term, query, toNode, parentNode ) {
	/*

	Note: str.match()[0] === str
	*/

	};  // End fuzzy.addOnePrediction()


	fuzzy.toString = function ( term, queriesList ) {



	};  // End fuzzy.toString()


	fuzzy.toSpan = function ( term, queriesList ) {
	/*


	*/
		var span = document.createElement('span');



	};  // End fuzzy.toNode()
	// fuzzy.numMatched letters

  // var fuzzy = function fuzzy(term, query) {
  //   var max = calcFuzzyScore(term, query);
  //   var termLength = term.length;

  //   if (fuzzy.analyzeSubTerms) {

  //     for (var subTermi = 1; subTermi < termLength &&
  //                         subTermi < fuzzy.analyzeSubTermDepth; subTermi++) {
  //       var subTerm = term.substring(subTermi);
  //       var score = calcFuzzyScore(subTerm, query);
  //       if (score.score > max.score) {
  //         // we need to correct 'term' and 'matchedTerm', as calcFuzzyScore
  //         // does not now that it operates on a substring. Doing it only for
  //         // new maximum score to save some performance.
  //         score.term = term;
  //         score.highlightedTerm = term.substring(0, subTermi) + score.highlightedTerm;
  //         max = score;
  //       }
  //     }
  //   }

  //   return max;
  // };

  var calcFuzzyScore = function calcFuzzyScore(term, query) {
    var score = 0;
    var termLength = term.length;
    var queryLength = query.length;
    var highlighting = '';
    var termi = 0;
    // -1 would not work as this would break the calculations of bonus
    // points for subsequent character matches. Something like
    // Number.MIN_VALUE would be more appropriate, but unfortunately
    // Number.MIN_VALUE + 1 equals 1...
    var previousMatchingCharacter = -2;

    for (var queryi = 0; queryi < queryLength && termi < termLength; queryi++) {
      var queryChar = query.charAt(queryi);
      var lowerCaseQueryChar = queryChar.toLowerCase();

      // termi is already defined
      for (; termi < termLength; termi++) {
        var termChar = term.charAt(termi);

        if (lowerCaseQueryChar === termChar.toLowerCase()) {
          score++;

          if ((previousMatchingCharacter + 1) === termi) {
            score += 2;
          }

          highlighting += fuzzy.highlighting.before +
              termChar +
              fuzzy.highlighting.after;
          previousMatchingCharacter = termi;
          termi++;
          break;
        } else {
          highlighting += termChar;
        }
      }
    }

    highlighting += term.substring(termi, term.length);

    return {
      score: score,
      term: term,
      query: query,
      highlightedTerm: highlighting
    };
  };

  fuzzy.matchComparator = function matchComparator(m1, m2) {
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
    var previousFuzzy = context.fuzzy;
    fuzzy.noConflict = function() {
      context.fuzzy = previousFuzzy;
      return fuzzy;
    };

    context.fuzzy = fuzzy;
  }

  return fuzzy;
};

var myFuzzy = MyFuzzy( window );
