/* commands.js
* 
* 
* Exiting, saving/applying, help (not sure about help)
*/

'use strict'

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

		iconObj.save( icd.map );

		return iconObj;
	};  // End commands.constructIcon()


	commands.apply = function ( variableName ) {
	/* 
	* 
	* Set the icon for the given variable.
	* Save the icon in a library somewhere and link the icon
	* element with the variable name's text. Replace any occurances
	* of the text with that icon.
	*/

		commands.constructIcon( 'testX', 'verb', [] );
	};  // End commands.apply()


	commands.addApply = function ( parentNode, classes ) {

		var control = document.createElement('i');
		parentNode.appendChild( control )
		// Fontawesome class
		$(control).addClass( 'fa fa-check-square command' );
		$(control).addClass( 'apply' );

		control.addEventListener( 'click', function () {



		} );

		return control;
	};  // End commands.addApply()


	// ================================
	// EXITING ADDER
	// ================================
	commands.exit = function () {
	/* 
	* 
	* Exits adder interface. Resets it?
	* TODO: Warn if icon is there but hasn't been saved
	*/


	};  // End commands.exit()


	commands.addExit = function ( parentNode ) {

		var control = document.createElement('i');
		parentNode.appendChild( control )
		// Fontawesome class
		$(control).addClass( 'fa fa-times-circle command' );
		$(control).addClass( 'exit' );

		control.addEventListener( 'click', function () {
			

			
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


	var container = commands.addCommands( parentNode )

	return container;
};  // End adder.addCommands()
