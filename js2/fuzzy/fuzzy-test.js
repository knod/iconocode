/* fuzzy-test.js
*/

'use strict'

window.addEventListener( 'load', function () {

	var fuzzySearcher = new FuzzySearcher();

	var inputNode 	= document.getElementById('search-query'),
		outputNode 	= document.getElementById('fuzzy-matches-container');

	var terms = [
		'Update payment method', 'See payment statistics',
		'Shopping cart', 'Recently bought', 'Check out',
		'Check in', 'ca', 'caa', 'cana', 'crabapple',
		'face', 'pacman', 'black', 'acronym', 'search'
	];


	// var getQuery 	= function () {
	// 	return $(inputNode).val();
	// };  // End getQuery()

	var getSelectedNode = function () {
	/* Incase we want to change the classes used */
		return document.querySelector('.fuzzy-matched-term.selected');
	};  // End getSelectedNode()


	var selectOption = function ( direction ) {
	/* ( str ) -> Node

	Right now, something will always be selected. Is this generally expected behavior?
	*/
		var selectedNode 		= getSelectedNode(),
			newSelectedNode 	= null;

		if ( direction === 'up' ) {
			// If selectedNode is the first element in output, we'll get null
			newSelectedNode = selectedNode.previousSibling;
		} else {  // down
			// If selectedNode is the last element, we'll get null
			newSelectedNode = selectedNode.nextSibling;
		}  // End if direction

		selectedNode.classList.remove('selected');
		// If the user pressed up when at top or down when at bottom
		if ( newSelectedNode === null ) { newSelectedNode = selectedNode; }
		newSelectedNode.classList.add('selected');

		return newSelectedNode;
	};  // End selectOption()


	var useSelectedOption = function () {
	/* ( none ) -> Str
	
	Puts the selected option's text in the search node.
	Returns that text
	*/
		var selectedNode = getSelectedNode();

		if (selectedNode !== null) {
			$(inputNode).val( selectedNode.dataset.term );
		}

		return $(inputNode).val();  // Retern selected node instead?
	};


	var runSearch 	= function ( query ) {
		outputNode.innerHTML 	= ''; // Why doesn't this work?
		// $(outputNode).empty();
		// Make sure there's some text in the search to match with
		if ($(inputNode).val().length > 0) {
			var matchData = fuzzySearcher.toNode( terms, query );
			outputNode.appendChild( matchData.node );
			$(matchData.node).children().first().addClass('selected');
		}

		return outputNode;
	};  // End runSearch()


	inputNode.addEventListener('keydown', function( evnt ) {
	/* Prevent navigating in the text using the up and down keys */
		var key = evnt.keyCode || evnt.which;

		if (key === 40) { // down
			evnt.preventDefault();
		} else if (key === 38) { // up
			evnt.preventDefault();
		}

	}, false);


	inputNode.addEventListener('keyup', function( evnt ) {
		var key = evnt.keyCode || evnt.which;

		if (evnt.keyCode === 13) { // enter
			useSelectedOption();
			runSearch( $(inputNode).val() );  // Otherwise the whole list just stays there
		} else 
		// No left or right because need to be able to navigate search text
		if (key === 40) { // down
			selectOption('down');
		} else if ( key === 38 ) { // up
			selectOption('up');
		} else if (key === 27) { // ESC
			$(outputNode).empty();
			$(inputNode).val('');
		}
		else {
			runSearch( $(inputNode).val() );
		}

	}, false);


});  // End window on load

