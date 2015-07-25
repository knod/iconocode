/* fuzzy-test.js
*/

'use strict'

window.addEventListener( 'load', function () {

	var fuzzySearcher = new FuzzySearcher();
	// var getQuery 	= function () {
	// 	return $(inputNode).val();
	// };  // End getQuery()


	// ========================
	// ELEMENTS
	// ========================
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

	// ========================
	// DATA
	// ========================
	// var filterUnique = function ( unfiltereArray ) {

	// };  // End filterUnique()


	var getUniqueObjIds = function ( tagNames, tagIdsDict ) {
	/* ( [""], { tagName: 'id#s'} )
	* 
	* Get all the unique object ids associated with all the tag names
	*/
		var objIds = [];
		
		for ( var tagi = 0; tagi < tagNames.length; tagi++ ) {

			var tag = tagNames[ tagi ];
			// Maybe check unique right in here
			// http://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array
			var tagIds = tagIdsDict[ tag ];

			// Add this tag's id's to the main list
			for ( var idi = 0; idi < tagIds.length; idi++ ) {
				var id = tagIds[ idi ];

				// but only if it's unique
				// if this is too slow, look at http://stackoverflow.com/questions/237104/array-containsobj-in-javascript
				if ( objIds.indexOf( id ) === -1 ) {
					objIds.push( id );
				}

			}

		}
console.log(objIds.sort())
		// for ( var tag in tagO)

		return objIds;
	};  // End getUniqueObjIds()


	// Always searching through the same terms?
	var terms = tagsArray;  // tags-array.js
	// tagIdsDict  from tag-dict.js, we'll work out how to do it better later

	var runSearch 	= function ( query ) {
		outputNode.innerHTML 	= ''; // Why doesn't this work?
		// $(outputNode).empty();
		// Make sure there's some text in the search to match with
		// If I use length > 0 and type in 'a', I get 4707 unique ids, 'ac' gets 812
		if ( $(inputNode).val().length > 1 ) {
			var matchData 	= fuzzySearcher.runSearch( terms, query );
			
			// tagIdsDict  from tag-dict.js
			var objIds 		= getUniqueObjIds( matchData.matches, tagIdsDict );
			var objs 		= getObjects( objIds );


			// outputNode.appendChild( matchData.node );
			// $(matchData.node).children().first().addClass('selected');
		}

		return outputNode;
	};  // End runSearch()


	// ====================
	// INPUT
	// ====================
	var inputNode 	= document.getElementById('search-query'),
		outputNode 	= document.getElementById('fuzzy-matches-container');

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

