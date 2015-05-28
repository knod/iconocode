/* mode-types.js

Creates everything to do with the types mode?

TODO:


Affects:
adder.modes.types - { tab: null, section: null, choices: {} }

Makes use of:
// Can't move on until a type is selected
adder.typeSelected 		= false;
adder.sections 	= { tabs: null, viewer: null, pickers: null };
*/

'use strict'

adder.addTypeMode = function () {
/* Enclose and name so it can be called in order */

	// =============
	// PICKER
	// =============
	adder.addTypeChoice 	= function ( typeName, parent, explanation ) {
	/* ( str, Node, Node ) -> new Node

	*/
		var typeContainer 				= document.createElement('div');
		parent.appendChild( typeContainer );
		adder.modes.types.choices[ typeName ] = typeContainer;

		typeContainer.className 		= prefix + ' type-choice';
		typeContainer.id 				= prefix + ' choice-' + typeName;
		// Will use typeToAdd to set the type of the icon to add
		typeContainer.dataset['typeToAdd'] = typeName;

		// The label for the thing
		var typeText 					= document.createTextNode( typeName );
		typeContainer.appendChild( typeText );

		return typeContainer;
	}  // End adder.addTypeChoice()


	adder.addVerbChoice 	= function ( parent, iconPrefix ) {
	/*

	*/
		var verbType = adder.addTypeChoice( 'verb', parent, 'does things' );

		var verbIcon = new Icon( iconPrefix + '-verb');
		verbIcon.createNew( {}, verbType );
		verbIcon.setType( 'verb' );

		return verbType;
	};  // End adder.addVerbChoice()


	adder.addNounChoice 	= function ( parent, iconPrefix ) {
	/*

	*/
		var nounType = adder.addTypeChoice( 'noun', parent, 'is done to' );

		var nounIcon = new Icon( iconPrefix + '-noun');
		nounIcon.createNew( {}, nounType );
		nounIcon.setType( 'noun' );

		return nounType;
	};  // End adder.addNounChoice()


	adder.addMessageChoice 	= function ( parent, iconPrefix ) {
	/*

	*/
		var messageType = adder.addTypeChoice( 'message', parent, 'tells you things' );

		var messageIcon = new Icon( iconPrefix + '-message');
		messageIcon.createNew( {}, messageType );
		messageIcon.setType( 'message' );

		return messageType;
	};  // End adder.addMessageChoice()


	adder.addTypePicker 	= function ( parent ) {
	/*

	Offers a selection of types for new icons
	*/
		// --- PICKER --- \\
		var typePicker 				= adder.createPicker( 'types' );  // In adder.js atm
		adder.modes.types.section 	= typePicker;
		parent.appendChild( typePicker );

		// Temporary so other functionality is testable
		typePicker.addEventListener( 'click', function () {adder.typeSelected = true;} );

		var iconPrefix 				= 'adder-type-choice';
		adder.addVerbChoice( typePicker, iconPrefix );
		adder.addNounChoice( typePicker, iconPrefix );
		adder.addMessageChoice( typePicker, iconPrefix );


		// Now that they're all in DOM, fetch them easily to do stuff to them
		var allChoices	 	= document.getElementsByClassName( 'type-choice' );
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
	adder.addTypeTab 	= function ( parent ) {

		// For my own clarity
		var args = {
			group: 'mode', type: 'types', label: 'Variable Type',
			toShow: adder.modes.types.section, parentObj: adder.modes.types
		};

		var typeTab 		 = adder.createTabInGroup(
			args.group, args.type, args.label, args.toShow, args.parentObj
		);
		parent.appendChild( typeTab );

		return typeTab;
	};  // End adder.addTypeTab()



	// ==================
	// START STUFF
	// ==================
	adder.addTypePicker( adder.sections.pickers );
	adder.addTypeTab( adder.sections.tabs );
};  // End adder.addTypeMode()
