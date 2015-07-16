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
	updater.oldCursorPos 	= { line: null, ch: null };

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


	updater.markUnmarked = function ( token, lineNum, iconMap, editor ) {
	/* 
	* 
	*/
		var tokenStart 	= { line: lineNum, ch: token.start  };

		var markArray 	= editor.findMarksAt( tokenStart ),
			mark 		= null;

		// Need a better test in case there are other marks there
		if ( markArray.length === 0 ) {
			// Check if there's a mark for that text

			var tokenStart 	= { line: lineNum, ch: token.start  },
				tokenEnd 	= { line: lineNum, ch: token.end };

			var iconObj 	= utils.getVarIcon( token.string, iconMap );

			if ( iconObj !== null ) {
				// Actually mark the variable's token
				mark = utils.markVar( token, lineNum, iconObj, editor );
			}
		}

		return mark;
	};  // End updater.markUnmarked()


	updater.cursorMovementHandler = function ( edInstance ) {
	/* ( CodeMirror ) -> ??
	* 
	* If the user moves their cursor away from a non-marked token,
	* check if it matches any mapped var names, then replace if needed.
	* 
	* ??: How to handle if user wants to add an icon, but hasn't moved the
	* 	cursor, as when they've first opened the editor
	*/
		// console.log('cursor moved')
		var currCursorPos 	= edInstance.getCursor();
		// The old token needs to be a variable type
		var oldToken_ 	= updater.oldToken,
			oldType 	= oldToken_.type;

		// Get type of token and text of token
		var currToken 	= edInstance.getTokenAt( currCursorPos ),
			currType 	= currToken.type;

		// If the user's just moved out of a variable token
		if ( (currType !== oldType) && (oldType === 'variable') ) {
			// Mark the text with an icon, hiding the visible text (if not already)
			updater.markUnmarked( oldToken_, updater.oldCursorPos.line, iconMap, edInstance )

		}

		updater.oldToken 		= currToken;
		updater.oldCursorPos 	= currCursorPos;

		return true;
	};  // End updater.cursorMovementHandler()


	return updater;
};  // End IcdUpdater {}
