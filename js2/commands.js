/* commands.js
* 
* 
* Exiting, saving/applying, help (not sure about help)
*/

'use strict'

// This'll get an error at start because it's not instantiated in the right
// order, but everything will actually work when stuff is run.
adder.addCommands = function ( parentNode ) {

	var commands = {};

	// ================================
	// SAVING AN ICON
	// ================================
	commands.constructIcon = function ( variableName, purpose, imageNodes ) {
	/* ( str, str, [Nodes] ) -> {}
	* 
	* Creates, sets, and saves an icon with the given values.
	*/
		var iconObj = new Icon( variableName );

		// Placeholder... Not sure this works this way anymore
		// Need to create marker
		iconObj.createNew( document.createDocumentFragment() );
		iconObj.setType( purpose , iconObj.container );
		iconObj.setImages( imageNodes, iconObj.body );

		iconObj.save( icd.map, icd.hotbar );

		return iconObj;
	};  // End commands.constructIcon()


	commands.getParts = function () {
	/*
	* 
	* This should be able to include text as well as images
	*/
		var $textContainer 	= $(adder.searchBarContainer);  // created in viewer.js
		// Gives Node array, looping is dangerous

		return $textContainer.contents();
	};  // End commands.getParts()


	commands.applyIcon = function () {
	/* 
	* 
	* Set the icon for the given variable.
	* Save the icon in a library somewhere and link the icon
	* element with the variable name's text. Replace any occurances
	* of the text with that icon.
	*/
		var result_ = adder.result;

		// Get parts of the icon to feed to the Icon object function
		var partNodes 	= commands.getParts();
		var purpose 	= result_.type;
		var varName 	= result_.token.string;

		// Create the icon
		var iconObj 	= commands.constructIcon( varName, purpose, partNodes );

		// Replace all occurances of the variable name in the text with a clone
		// of the iconNode (CodeMirror TextMarker). For now just add it to the doc.
				// console.log( iconObj )
				// document.body.appendChild( iconObj.container );
		// Regex for finding just words in js? Use codemirror tokens instead?


		// Set something to continue looking for any times it's added in the text?
		// Set autocomplete stuff?

		// Maybe also check if there's a conflict? What kind of conflicts can there be?
			/* 
			* - That variable name already has an icon (but they're changing
			* 	it, so just a confirmation that they want to change it?)
			* - That set of images and text is already being used for an icon
			* 	(no two variable names should be able to have the same exact icon?)
			*/

		// !!!: currently using global, need local
		// Takes: token, lineNum, iconMap, editor
		// icd.utils.markVar( result_.token, result_.lineNum, iconObj, result_.editor  );
		icd.updater.markAll( result_.editor, icd.map, result_.token.string );

		// Get rid of adder
		commands.exit( adder );

		return iconObj;
	};  // End commands.applyIcon()


	commands.preserveText = function () {
	/* 
	* 
	* Give each text node in the viewer a class that will allow it to
	* be retrieved for insertion into the final icon. Give the
	* text node a $data of 'terms' as well, made up of its contents
	* ???: is this the only other node we need to account for?
	*/

	};  // End commands.labelText()


	commands.addApply = function ( parentNode, classes ) {
		/**/

		var control = document.createElement('i');
		parentNode.appendChild( control )
		// Fontawesome class
		$(control).addClass( 'fa fa-check-square command' );
		$(control).addClass( 'apply' );

		control.addEventListener( 'click', function ( evnt ) {
			// comands.preserveText()
			commands.applyIcon();
		} );

		return control;
	};  // End commands.addApply()


	// ================================
	// EXITING ADDER
	// ================================
	commands.exit = function ( obj ) {
	/* 
	* 
	* Exits adder interface. Resets it?
	* TODO: Warn if icon is there but hasn't been saved
	*/
		// Get rid of adder
		$(obj.node).hide();
		obj.result.editor.focus();

		return obj;
	};  // End commands.exit()


	commands.addExit = function ( parentNode ) {

		var control = document.createElement('i');
		parentNode.appendChild( control )
		// Fontawesome class
		$(control).addClass( 'fa fa-times-circle command' );
		$(control).addClass( 'exit' );

		control.addEventListener( 'click', function () {
			
			commands.exit( adder );
			
		} );


	};  // End commands.addExit()


	commands.addCommands = function ( parentNode ) {
		var commandsContainer 		= document.createElement('section');
		parentNode.appendChild( commandsContainer );
		commandsContainer.className = 'adder-commands-container';

		// On left
		var exitNode = commands.addExit( commandsContainer );
		// On right
		var applyContainer = commands.addApply( commandsContainer );

		return commandsContainer;
	};  // End commands.addCommands()


	var container = commands.addCommands( parentNode );

	return container;
};  // End adder.addCommands()
