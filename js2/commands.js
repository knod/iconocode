/* commands.js
* 
* 
* Exiting, saving/applying, help (not sure about help)
*/

'use strict'

adder.addCommands = function () {

	var commands = {};


	// ================================
	// SAVING AN ICON
	// ================================

	commands.constructIcon = function () {

	};  // End commands.constructIcon


	commands.apply = function ( variableName ) {
	/* 
	* 
	* Set the icon for the given variable.
	* Save the icon in a library somewhere and link the icon
	* element with the variable name's text. Replace any occurances
	* of the text with that icon.
	*/

		commands.constructIcon();
	};  // End commands.apply()


	commands.addApply = function ( parentNode, classes ) {

		var control = document.createElement('i');
		parentNode.appendChild( control )
		// Fontawesome class
		$(control).addClass( 'fa check-square-o fa-lg' );
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
		$(control).addClass( 'fa fa-times-circle fa-lg' );
		$(control).addClass( 'exit' );

		control.addEventListener( 'click', function () {
			

			
		} );


	};  // End commands.addExit()


	return commands;
};  // End adder.addCommands {}
