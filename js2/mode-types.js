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

	var iconObj_;
	var typeMode_ = adder.modes.types;

	// --- Grid and grid navigation --- \\
	typeMode_.name = 'types';
	typeMode_.typeHeight = 100;

	typeMode_.grid;

	typeMode_.choices = {
		verb: {name: 'verb', text:'changes data', tags: ['verb', 'process', 'transitive']},
		noun: {name: 'noun', text:'is data, does not change it - is accessed or changed',
					tags: ['noun', 'data', 'intransitive']},
		message: {name: 'message', text:'helps the developer develop (debugging, etc.)', tags: ['message', 'meta', 'dev', 'development', 'developer']}
	};

	typeMode_.choiceNodes = {};

	// ===============
	// ACTIVATING TYPE
	// ================
	typeMode_.chooseType = function ( chosenNode ) {
	/*
	* Called by Grid
	*/

		var $textContainer = $(adder.searchBarContainer);  // created in viewer.js

		var adderIcon = adder.icon;

		// var purpose = $(chosenNode).data('terms')[0];  // data name?
		var purpose = chosenNode.dataset['name'];
		adderIcon.setType( purpose );

		// If it's the first time, switch modes automatically
		if ( adder.typeSelected === false ) {
			adder.activateMode( adder.modes.images.tab );
			// Only erase contents when it's the placeholder text
			adder.viewer.setValue('');

			// Don't do this again
			adder.typeSelected = true;
		}

		// Re-set result type (images won't work the same as this)
		adder.result.type = purpose;

		// Bring everything back to where it last was in the search bar
		adder.backToSearchbar( adder.viewer );

		return $textContainer[0];
	};  // End typeMode_.chooseType()

	// =============
	// PICKER
	// =============
	// typeMode_.addTypeChoiceContainer = function ( typeName, parentNode, explanation ) {
	typeMode_.addTypeChoiceContainer = function ( choiceObj, parentNode ) {
	/* ( str, Node, str ) -> new Node

	*/
		var typeName = choiceObj.name;

		var typeContainer 		= document.createElement('div');
		parentNode.appendChild( typeContainer );
		adder.modes.types.choiceNodes[ typeName ] = typeContainer;  // ??: not needed

		typeContainer.className = 'icd-choice-container type-choice-container';
		// typeContainer.id 		= prefix + '_choice_' + typeName;
		// Will use typeToAdd to set the type of the icon to add
		// $(typeContainer).data('typeToAdd', typeName);

		return typeContainer;
	}  // End typeMode_.addTypeChoiceContainer()


	typeMode_.addIcon = function ( typeName, parentNode ) {

		// ??: Don't know if I want hover text for this, but not sure how to handle that
			// Would rather have tags as the hover text tbh
		var typeIcon = new Icon( typeName );
		typeIcon.createNew( parentNode );
		typeIcon.setType( typeName, typeIcon.container );

		return typeIcon;
	};  // End typeMode_.addIcon()


	typeMode_.addTypeContents = function ( choiceObj, parentNode ) {

		var typeName = choiceObj.name;

		// Actual choice, which will contain everything else
		// Only needed because images need to have a choice container and a choice
		var choice = document.createElement( 'div' );
		parentNode.appendChild( choice );
		
		choice.className = 'icd-adder-choice purpose-choice'
		choice.dataset['name'] = typeName;

		// Make focusable (on icon instead?). Necessarily on this node for keyboard navigation.
		choice.tabIndex = 0;
		// Event listener for keyboard navigation
		$(choice).on( 'keydown', function ( evnt ) {
			typeMode_.grid.gridKeyHandler( evnt, typeMode_.chooseType );
		});

		// Add label of type above shape
		var typeText = document.createTextNode( typeName );
		parentNode.appendChild( typeText );

		// Add icon shape
		typeMode_.addIcon( typeName, parentNode );

		// Add explanitory text below shape
		var typeDescription = document.createTextNode( choiceObj.text );
		parentNode.appendChild( typeDescription );

	};  // End typeMode_.addTypeContents()


	// typeMode_.addTypeChoice = function ( typeName, description, parentNode ) {
	typeMode_.addTypeChoice = function ( objKey, parentRow ) {
	/* ( {JS}, Node ) -> new Node
	* 
	* Called by Grid
	* choicObj looks like {name: str, text: str, tags: []}
	*/
		var choiceObj 		= typeMode_.choices[ objKey ];
		var typeContainer 	= typeMode_.addTypeChoiceContainer( choiceObj, parentRow);
		typeMode_.addTypeContents( choiceObj, typeContainer );

		return typeContainer;
	};  // End typeMode_.addTypeChoice()


	typeMode_.addGrid = function ( choiceObjs ) {

		var choiceKeys = Object.keys( choiceObjs );

		var rowBlueprint = {
			height: typeMode_.typeHeight,
			vertMargin: 16,
			numCols: choiceKeys.length,
			numExisting: 1  // Number of rows built at one time inside the sizer (including buffer rows)
		}

		var modeName 		= typeMode_.name;
		var makeChoiceNode 	= typeMode_.addTypeChoice;
		var chooseImage 	= typeMode_.chooseType;

		typeMode_.grid = new adder.Grid2( choiceKeys, rowBlueprint, modeName, makeChoiceNode, chooseImage );

		return typeMode_.grid;
	};  // End typeMode_.addGrid()


	adder.addTypePicker 	= function ( parentNode ) {
	/* ( Node ) -> new Node

	Offers a selection of types for new icons
	*/
		// --- PICKER --- \\
		var typePicker 				= adder.createPicker( 'types' );  // In adder.js atm
		adder.modes.types.section 	= typePicker;
		parentNode.appendChild( typePicker );

		var numCols = 3;
		// var typeGrid = new adder.Grid( 'types', numCols, typeChoicesNodes );
		typeMode_.addGrid( typeMode_.choices );  // Adds rows of choices


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

	// return typeMode_;
};  // End adder.addTypeMode()
