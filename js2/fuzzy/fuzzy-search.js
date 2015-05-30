/* fuzzy-search.js

Based on:
https://github.com/bripkens/fuzzy.js/blob/master/demo/js/main.js

References:
http://stackoverflow.com/questions/9255840/regex-match-two-or-more-same-character-non-consecutive
From cjohnson: http://jsfiddle.net/yor2e7cc/

*/

(function() {
	fuzzy.analyzeSubTerms = false;
	fuzzy.highlighting.before = '<strong>';
	fuzzy.highlighting.after = '</strong>';

	var options = [
		'Update payment method',
		'See payment statistics',
		'Shopping cart',
		'Recently bought',
		'Check out',
		'Check in',
		'a',
		'aa',
		'ana'
	],
	maxResults = 50,  // 25 for strings, more for images
	input = document.querySelector('.fuzzy-search-wrapper input'),
	output = document.querySelector('.fuzzy-search-wrapper ul'),
	demoItemOutput = document.getElementById('demoItems');

	var createMatchRegex = function ( strToMatch ) {
	/*

	Since this is a very unique situation, we'll use the order
	of the list to our advantage and change it using every other one
	*/


		var toMatchArray 	= toMatch.split('');

		var regexEnd 		= toMatchArray.join( '{1}.*' );  // {1} is automatic, not needed
		var regexStr 		= '.*' + regexEnd;

		console.log(regexStr)
		// 'i' means case doesn't matter. RegExp() adds in the start and end '/'
		return ( new RegExp( regexStr, 'i' ) )

	};  // End createMatchRegex()

	var createMatchXRegExp = function ( strToMatch ) {
	/* ( str ) -> XRegExp

	Makes a XRegExp pattern for the input string
	
	??: !!! How do I get unique backreferences in there and how do
	I then add them in order?

	!!! This would invlove getting the keynames, I think
	*/
		var toMatchArray = strToMatch.split('');

		var xregexpEnd 	= '';
		var count = 0;  // The count will be started at 0, but after the
		// for loop. In the for loop it starts at 1

		for ( var chari = 0; chari < toMatchArray.length; chari++ ) {

			// '(?<#inList>a)(?<#notInList>.*)'
			count += 1;
			xregexpEnd = xregexpEnd + '(?<' + count + 'inList>' +
				toMatchArray[ chari ] + ')(?<';
			count +=1;
			xregexpEnd = xregexpEnd + count + 'notInList>.*)';

		}

		var xregexpStr 		= '(?<0notInList>.*)' + xregexpEnd;
		// 'i' means case doesn't matter. RegExp() adds in the start and end '/'
		var patternToTest 	= new RegExp( xregexpStr, 'i' )

		return patternToTest;
	};  // End createMatchXRegExp()


    var doesContainAll = function ( wordToTest, toMatch ) {
    /* ( str, str ) -> bool

	Returns whether wordToTest contains all letters in toMatch
	in the order in which they are given.

		.* 0 or more of any character
		a{1} one a
	Pattern: .* then a{1}.* (where 'a' represents any character)
    */
		var toMatchArray 	= toMatch.split('');

		var regexEnd 		= toMatchArray.join( '{1}.*' );  // {1} is automatic, not needed
		var regexStr 		= '.*' + regexEnd;

		console.log(regexStr)
		// 'i' means case doesn't matter. RegExp() adds in the start and end '/'
		var patternToTest 	= new RegExp( regexStr, 'i' )

	    return patternToTest.test( wordToTest );
    };  // End doesContainAll()


	function doFilterOptions() {

		var toMatch = input.value;
		if (toMatch === '') {
			return;
		}

		var filterResult = [];

		// removing all child elements the easy way
		output.innerHTML = '';

		for ( var optioni = 0; optioni < options.length; optioni++ ) {
			var thisOption 	= options[ optioni ];

			var containsAll = doesContainAll( thisOption, toMatch  );
			if ( containsAll === true ) {
				filterResult.push( fuzzy( thisOption, toMatch ) );
			}
		} // end for option in options

		filterResult.sort( fuzzy.matchComparator );

		for (var resulti = 0; resulti < filterResult.length && resulti < maxResults; resulti++) {
			var option = filterResult[ resulti ],
				listItem = document.createElement('li');

				listItem.dataset.score 	= option.score;
				listItem.dataset.term 	= option.term;
				listItem.innerHTML 		= option.highlightedTerm;

			if (resulti === 0) {
				listItem.classList.add('selected');
			}

			output.appendChild(listItem);
		}
	};

  function getSelectedNode() {
    return document.querySelector('.selected');
  };

  function useSelectedOption() {
    var selectedNode = getSelectedNode();
    if (selectedNode !== null) {
      input.value = selectedNode.dataset.term;
    }
  };

  function moveSelection(down) {
    var selectedNode = getSelectedNode(),
      newSelectedNode = null;

    if (down) {
      newSelectedNode = selectedNode.nextSibling;
    } else {
      newSelectedNode = selectedNode.previousSibling;
    }

    if (newSelectedNode !== null) {
      selectedNode.classList.remove('selected');
      newSelectedNode.classList.add('selected');
    }
  };

  input.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) { // enter
      useSelectedOption();
      doFilterOptions();
    } else if (e.keyCode === 40) { // down
      moveSelection(true);
    } else if (e.keyCode === 38) { // up
      moveSelection(false);
    } else if (e.keyCode === 27) { // ESC
      output.innerHTML = '';
      input.value = '';
    } else {
      doFilterOptions();
    }
  }, false);

 //  for (var i = 0; i < options.length; i++) {
	// var textNode = document.createTextNode(options[i]),
	// liNode = document.createElement('li');
	// liNode.appendChild(textNode);
	// demoItemOutput.appendChild(liNode);
 //  }
})();
