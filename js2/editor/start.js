/* start.js
* 
* 
* 
*/

'use strict'

var myCodeMirror = CodeMirror(document.body,
	{
		mode: 'javascript',
		value: 		"function myScript(){return 100;}\n",
		theme:  		"lesser-dark",
		lineNumbers: 	true
	}
);

myCodeMirror.on('cursorActivity', function ( instance ) {
/* 
* Happens even when it's just text being typed in
*/
	icd.updater.cursorMovementHandler( instance );
});  // End on cursor activity
