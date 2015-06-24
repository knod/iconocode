/* Updater.js
* 
* 
*/

'use strict'

var IcdUpdater = function ( utils, iconMap ) {
/* 
* 
* Maybe what I need to do is keep track of the previous token and
* the current token. If the old token was a variable name and the
* current one isn't, then try to replace the previous token with
* an icon...?
*/	
	var updater = {};

	// Values for the first test
	updater.oldToken 		= { type: null };

	// Needs varName, mapObj
	var getVarIcon = utils.getVarIcon;

	// updater.changeHandler = function ( evnt ) {
		// /* 
		// * 
		// * Use the specific instance of editor used in order to
		// * replace the right variable names. Not sure how to handle
		// * different instances yet.
		// */

		// 	/* 
		// 	* Actually, what I need to do is wait until after the person is done
		// 	* typing a token... I'm not sure how to do that...
		// 	*/

		// 	// Check whether the current token is a variable name
		// 	// Check whether the text of the current token matches anything in the icon map
		// 		// How to make sure someone is done writing?
		// 		// It needs to be followed by a non-variable token, but what
		// 		// if the thing following it is a new line? Or if they
		// 		// simply move their curosor away from it?
	// };  // End updater.changeHandler()


	updater.cursorMovementHandler = function ( edInstance ) {
	/* ( CodeMirror ) -> ??
	* 
	* If the user moves their cursor away from a non-marked token,
	* check if it matches any mapped var names, then replace if needed.
	* 
	* ??: How to handle if user wants to add an icon, but hasn't moved the
	* 	cursor, as when they've first opened the editor
	*/
		console.log('cursor moved')
		var cursorPos 	= edInstance.getCursor();
		// The old token needs to be a variable type
		var oldToken_ 	= updater.oldToken,
			oldType_ 	= oldToken_.type;

		// Get type of token and text of token
		var currToken 	= edInstance.getTokenAt( cursorPos ),
			currType 	= currToken.type;

		// If the user's just moved out of a variable token
		if ( (currType !== oldType_) && (oldType_ === 'variable') ) {
			
			var markArray = edInstance.findMarksAt( {line: 0, ch: oldToken_.start  } )
			// console.log(markArray)
			// Need a better test in case there are other marks there
			if ( markArray.length === 0 ) {

				var iconObj = getVarIcon( oldToken_.string, iconMap );
				console.log(iconObj);
			}

		}

		updater.oldToken = currToken;

		return true;
	};  // End updater.cursorMovementHandler()


	return updater;
};  // End IcdUpdater {}
