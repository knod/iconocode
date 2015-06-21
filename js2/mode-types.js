/* mode-types.js
* 
* Creates everything to do with the types mode?
* 
* Affects:
* adder.modes.types - { tab: null, section: null, choices: {} }
* Makes use of:
* // Can't move on until a type is selected
* adder.typeSelected 		= false;
* adder.sections 	= { tabs: null, viewer: null, pickers: null };
* 
* TODO:
* - Add proper id as last argument in new Icon() creation
* 
*/

'use strict'

adder.addTypeMode = function () {
/* Enclose and name so it can be called in order */

	// =============
	// PICKER
	// =============
	adder.addTypeChoiceContainer = function ( typeName, parentNode, explanation ) {
	/* ( str, Node, Node ) -> new Node

	*/
		var typeContainer 		= document.createElement('div');
		parentNode.appendChild( typeContainer );
		adder.modes.types.choices[ typeName ] = typeContainer;

		typeContainer.className = 'icd-choice-container type-choice-container';
		typeContainer.id 		= prefix + '_choice_' + typeName;
		// Will use typeToAdd to set the type of the icon to add
		typeContainer.dataset['typeToAdd'] = typeName;

		typeContainer.addEventListener( 'click', function ( evnt ) {
			adder.typeSelected = true;
			// Use this to add type to viewer
			typeContainer.dataset['typeToAdd'];
			// adder.viewer.

			// If it's the first time, go to image mode
		} );  // end on click


		// The label for the thing
		var typeText 			= document.createTextNode( typeName );
		typeContainer.appendChild( typeText );

		return typeContainer;
	}  // End adder.addTypeChoiceContainer()



	adder.addTypeChoice = function ( typeName, description, parentNode ) {
	/*
	*/

		var typeContainer = adder.addTypeChoiceContainer( typeName, parentNode, description );

		var typeIcon = new Icon( 'adder-type-choice-' + typeName );
		typeIcon.createNew( {}, typeContainer );
		typeIcon.setType( typeName );

		$(typeContainer).data('choice', typeIcon.node );
		$(typeIcon.node).data('terms', [typeName]);

		return typeContainer;
	};  // End adder.addTypeChoice()


	adder.addTypePicker 	= function ( parentNode ) {
	/* ( Node ) -> new Node

	Offers a selection of types for new icons
	*/
		// --- PICKER --- \\
		var typePicker 				= adder.createPicker( 'types' );  // In adder.js atm
		adder.modes.types.section 	= typePicker;
		parentNode.appendChild( typePicker );

		var iconPrefix 				= 'adder-type-choice';

		var verbContainer  	 = adder.addTypeChoice( 'verb', 'changes data', document.createDocumentFragment() ),
			nounContainer 	 = adder.addTypeChoice( 'noun', 'is accessed and changed', document.createDocumentFragment() ),
			messageContainer = adder.addTypeChoice( 'message', 'tells you things', document.createDocumentFragment() );

		var typeChoicesNodes = [ verbContainer, nounContainer, messageContainer ];


		var numCols = 3;
		var typeGrid = new adder.Grid( 'types', numCols, typeChoicesNodes );


		// Now that they're all in DOM, fetch them easily to do stuff to them
		var allChoices	 	= document.getElementsByClassName( 'type-choice-container' );
		var numChoices 		= allChoices.length;

		// --- Last Styling --- \\
		var lastChoice 		= allChoices[ (numChoices - 1) ];
		lastChoice.className = lastChoice.className + ' last';

		// --- Sizing --- \\
		var chioceWidth 	= 100/numChoices
		for ( var choicei = 0; choicei < numChoices; choicei++ ) {
			allChoices[ choicei ].style.width = chioceWidth + '%';
		}

		// // --- VIEWER --- \\
		// // Add hidden icon to viewer. It's type will change.
		// // Maybe show a square shaped one for 'unspecified'

		return typePicker;
	};  // End adder.addTypePicker()


	// =============
	// TAB
	// =============
	adder.addTypeTab 	= function ( parentNode ) {

		// For my own clarity
		var args = {
			group: 'mode', type: 'types', label: 'Purpose',
			toShow: adder.modes.types.section, parentObj: adder.modes.types
		};

		var typeTab 		 = adder.createTabInGroup(
			args.group, args.type, args.label, args.toShow, args.parentObj
		);
		parentNode.appendChild( typeTab );

		return typeTab;
	};  // End adder.addTypeTab()



	// ==================
	// START STUFF
	// ==================
	adder.addTypePicker( adder.sections.pickers );
	adder.addTypeTab( adder.sections.tabs );
};  // End adder.addTypeMode()
