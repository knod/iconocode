/* Updater.js
* 
* TODO:
* - Add fuzzy search using image objects instead of
* image elements and only populating the grid with a
* certain number of those
*/

'use strict'

var IcdUpdater = function ( utils ) {
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


	updater.markUnmarked = function ( token, lineNum, iconMap, edInstance ) {
	/* 
	* 
	*/
		var tokenStart 	= { line: lineNum, ch: token.start  };

		var markArray 	= edInstance.findMarksAt( tokenStart ),  // Don't conflict with other marks
			mark 		= null;

		// Need a better way to make sure not to conflict with other marks
		if ( markArray.length === 0 ) {
			// Check if there's a mark for that text

			var tokenStart 	= { line: lineNum, ch: token.start  },
				tokenEnd 	= { line: lineNum, ch: token.end };

			var iconObj 	= utils.getVarIcon( token.string, iconMap );

			if ( iconObj !== null ) {
				// Actually mark the variable's token
				mark = utils.markVar( token, lineNum, iconObj, edInstance );
			}
		}

		return mark;
	};  // End updater.markUnmarked()


	updater.markIf = function ( token, lineNum, edInstance, iconMap ) {
	/* ( {JS}, int )
	* 
	* Marks certain types of tokens if they're unmarked
	*/
		var type = token.type;
		// In future: if ( Icon.type === token.type ) {}
		// Change current Icon.type to Icon.purpose
		var varb = 'variable', ky = 'keyword', prop = 'property';
		var isValid = type === varb || type === ky || type === prop;
		// if ( isValid ) {	
			updater.markUnmarked(token, lineNum, iconMap, edInstance);
		// }

		return isValid
	};  // End updater.markIf()


	updater.cursorActivityHandler = function ( edInstance ) {
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

		// If the user's just moved out of a token
		if ( currType !== oldType ) {
			// Mark certain tokens with an icon (if not already)
			updater.markIf( oldToken_, updater.oldCursorPos.line, edInstance, icd.map );

			// Center everything vertically based on size
			// Not in markUnmarked() in the hope of making toggling and loading faster
			resizeIcons();  // Global in icon-styles.js atm
		}

		updater.oldToken 		= currToken;
		updater.oldCursorPos 	= currCursorPos;

		return true;
	};  // End updater.cursorMovementHandler()


	updater.getAllTokens = function ( edInstance ) {
	/* ( CodeMirror ) -> [];
	* 
	* Return an array of all the tokens in the editor instance
	*/
		var numLines 	= edInstance.lineCount();
		var allTokens 	= [];

		for ( var lineNum = 0; lineNum < numLines; lineNum++ ) {
			// cm.getLineTokens(line: integer, ?precise: boolean) → array<{start, end, string, type, state}>
			var lineTokens = edInstance.getLineTokens( lineNum );
			allTokens = allTokens.concat( lineTokens );

		}

		return allTokens;
	};  // End updater.getAllTokens()


	updater.markAll = function ( edInstance, iconMap, iconKey ) {
	/* ( CodeMirror, IconMap, str(optional) ) -> same CodeMirror
	* 
	* If there's in iconKey, it marks all tokens that have a string
	* matching the iconKey, otherwise it just marks all tokens.
	*/
		var numLines = edInstance.lineCount();

		for ( var lineNum = 0; lineNum < numLines; lineNum++ ) {
			// cm.getLineTokens(line: integer, ?precise: boolean) → array<{start, end, string, type, state}>
			var lineTokens = edInstance.getLineTokens( lineNum );
			for ( var tokeni = 0; tokeni < lineTokens.length; tokeni++ ) {

				var token = lineTokens[ tokeni ]

				// undefined iconKey will match all token string values
				var matchesKey = true;
				if ( iconKey !== undefined ) { matchesKey = token.string === iconKey }

				if ( matchesKey ) {
					updater.markIf( token, lineNum, edInstance, iconMap );
				}

			}  // End for all line tokens

		}  // end for all lines

		// Center everything vertically based on size
		// Putting it here in the hope of making toggling and loading faster
		resizeIcons();  // Global in icon-styles.js atm

		return edInstance;
	};  // End updater.markAll()


	updater.removeAllMarks = function ( edInstance ) {
	/**/
		var allMarks = edInstance.getAllMarks();
		var numMarks = allMarks.length;

		for ( var marki = 0; marki < allMarks.length; marki++ ) {
			allMarks[ marki ].clear()
		}

		return edInstance;
	};  // End updater.removeAllMarks()


	return updater;
};  // End IcdUpdater {}
