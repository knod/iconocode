/* fuzzy-search.js

Based on:
https://github.com/bripkens/fuzzy.js/blob/master/demo/js/main.js

References:
http://stackoverflow.com/questions/9255840/regex-match-two-or-more-same-character-non-consecutive

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


    var doesContainAll = function ( wordToTest, toMatch ) {
    /* ( str, str ) -> bool

	Returns whether wordToTest contains all letters in toMatch
	in the order in which they are given.
    */

    	var containsAllLetters  = true;
    	// .* 0 or more of any character
    	// a{1} one a
    	// Pattern: .* then a{1}.* (where 'a' represents any character)

    	var regexPattern = '.*'

		var toMatchArray 		= toMatch.split('');
		for ( var chari = 0; chari < toMatchArray.length; chari ++  ) {
			regexPattern = regexPattern + toMatchArray[ chari ] + '{1}.*';
		}

		// 'i' means case doesn't matter
		var toTestWith = new RegExp( regexPattern, 'i' )
		containsAllLetters = toTestWith.test( wordToTest );

	    return containsAllLetters;
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

		filterResult.sort(fuzzy.matchComparator);

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

  for (var i = 0; i < options.length; i++) {
    var textNode = document.createTextNode(options[i]),
      liNode = document.createElement('li');
    liNode.appendChild(textNode);
    demoItemOutput.appendChild(liNode);
  }
})();
