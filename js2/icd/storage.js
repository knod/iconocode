/* Storage.js
* 
* 
* TODO:
* - Loading (in order):
* 	- Use any pre-existing icdMap
* 	- Populate hotbar with any pre-existing icdMap objects
* 	- Add editor
* 	- Insert any pre-existing code (replacing the placehoder)
* 	- Replace any pre-existing code with the pre-existing mapped variable names
* - Saving:
*  	- Button for saving? Replace cmd+s default action too?
* 	- Automatically save when new icon is added?
* - Clearing cache:
* 	- Button for deleting/clearing saved data? Can save multiple instances?
* 
* This needs decoupling, but I'm not sure how
*/


var IcdStorage = function ( saveNode, clearNode ) {
// `localStorage`, seen later, is a pre-existing global variable in any document

	var storage = {};
	

	storage.keys = [ 'icdMap', 'icdScripts', 'icd' ];


	storage.saveValToKey = function ( value, keyName ) {
	/* ( any, str ) -> ? */
		var data = JSON.stringify( value );
		localStorage.setItem( keyName, data );

		localStorage.setItem('hasSavedData', 'true');

		return storage;
	};  // End storage.saveKeyToVar()

	storage.save = function () {
		console.log('Saving. Check "icdMap" and "icdScripts"')
		// ??: Maybe it should just save icd completely?
		// storage.saveValToKey( icd, 'icd' );
		// Store the icon/variable relationships

		storage.saveValToKey( icd.map, 'icdMap' );
		// Save the code of all the scripts
		storage.saveValToKey( icd.editors[0].getValue(), 'icdScripts')

		return storage;
	};  // End storage.save()

	
	storage.clearKeys = function ( keysToClear ) {
	/* ( [str] ) -> ? */
		for ( var keyi = 0; keyi < keysToClear.length; keyi++ ) {
			localStorage.removeItem( keysToClear[ keyi ] );
		}
	};  // End storage.clearKeys()


	storage.clearAll = function () {
	// For dev use, though maybe I could just clear cache
		// Get rid of the saved data
		storage.clearKeys( storage.keys );
		localStorage.setItem('hasSavedData', 'false');
	}


	storage.clearIcons = function () {
	/* 
	* Just deletes icons and icon data, not the code in the editor.
	* I figure if they want to do that, they can do it by hand
	*/
		console.log('Clearing. Check "icdMap" and "icdScripts"')

		// Give the user one last chance to not delete their icons
		var response = confirm('Are you sure you want to delete all your saved icons/hieroglyphs? They will be removed completely.')
		console.log(response);
		if ( response ) {

			// Empty all icon records
			icd.map = {};
			storage.saveValToKey( 'icdMap', icd.map );
			// Empty the hotbar
			icd.hotbar.update( icd.map );
			// Reset the icons back to text on screen
			icd.updater.removeAllMarks( icd.editors[0] );
		    
		} else {
		    // alert('Whew, that was a close one');
		}

		return storage;
	};  // End storage.clearIcons()


	storage.toOriginal = function () {
	// Bleh, I'd have to rerun the original icon map. I guess I need to save that somewhere.
		// Start a new editor with the original placeholder text I guess.
	};  // End storage.toOriginal()


	storage.loadKeyToVar = function ( keyName, variable ) {
	/* ( str, var ) -> same var
	* 
	* If a value for keyName has been stored locally
	* Return either the variable again, or, if there is data, the data that was there
	*/
		var stored = localStorage.getItem( keyName );
		var jsData;
		if ( stored !== null ) {
			jsData = JSON.parse( stored );
			variable = jsData
		}

		return variable;
	};  // End storage.loadKey()


	storage.load = function () {

		// If there is previously saved data, update everything with that data
		var hasSavedData = localStorage.getItem('hasSavedData');  // This will be "true" or "false" ("false" when data has been cleared?)
		console.log('Loading. "hasSavedData":', hasSavedData);

		if ( hasSavedData === 'true' ) {
			console.log('Loading saved data! Check "icdMap" and "icdScripts"');
			// --- GET ICON DATA --- \\
			storage.loadKeyToVar( 'icdMap', icd.map );  // Load saved map
			
			// --- UPDATE APP --- \\
			icd.hotbar.update( icd.map );  // Update hotbar

			// -- Editor(s)
			// TODO: Make way to add an editor to have multiple scripts
			var currEditor = icd.editors[0]
			var code = currEditor.getValue();
			code = storage.loadKeyToVar( 'icdScripts', code );  // Will come back as itself or as saved code

			// Replace current blank editor, and add any needed editors/scripts
			// (Right now, just replace the current editor)
			currEditor.setValue( code );

			// Mark all appropriate text with appropriate icons
			icd.updater.markAll( currEditor, icd.map );

		}  // end if hasSavedData

		return storage;
	};  // End storage.load()


	$(saveNode).on( 'click', storage.save );
	$(clearNode).on( 'click', storage.clearIcons );


	return storage;
};  // End IcdStorage {}


