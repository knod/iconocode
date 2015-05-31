/* fuzzy-test.js
*/

'use strict'

window.addEventListener( 'load', function () {

	var fuzzySearcher = new FuzzySearcher();

	var inputNode 	= document.getElementById('search-query'),
		outputNode 	= document.getElementById('fuzzy-matches-container');

	var terms = [
		'Update paymdent method', 'See payment statistics',
		'Shopping cart', 'Recently bought', 'Check out',
		'Check in', 'ca', 'caa', 'cana', 'crabapple'
	];


	// var getQuery 	= function () {
	// 	return $(inputNode).val();
	// };  // End getQuery()
	var selectOption = function () {};  // End selectOption()


	var useSelectedOption = function () {
		// This should return a list item with plain old text in it
		var selectedNode 	= document.querySelector('.matcher-matched-word.selected');
		if (selectedNode !== null) {
			inputNode.value = selectedNode.dataset.term;
		}

		return inputNode.value;  // Retern selected node instead?
	};


	var runSearch 	= function ( query ) {
		outputNode.innerHTML 	= ''; // Why doesn't this work?
		// $(outputNode).empty();
		// Make sure there's some text in the search to match with
		if ($(inputNode).val().length > 0) {
			var matchData = fuzzySearcher.toNode( terms, query, 'ol' );
			outputNode.appendChild( matchData.node );
		}

		return outputNode;
	};  // End runSearch()


	inputNode.addEventListener('keyup', function( evnt ) {
		// if (e.keyCode === 13) { // enter
			// useSelectedOption();
		// } else if (e.keyCode === 40) { // down
		// 	moveSelection(true);
		// } else if (e.keyCode === 38) { // up
		// 	moveSelection(false);
		// } else if (e.keyCode === 27) { // ESC
		// 	outputNode.innerHTML = '';
		// 	inputNode.value = '';
		// } else {
		// 	runSearch();
		// }
			runSearch( $(inputNode).val() );
	}, false);


});  // End window on load

