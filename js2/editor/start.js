/* start.js
* 
* 
* 
*/

'use strict'

var myCodeMirror = CodeMirror(document.body,
	{
		mode: 		'javascript',
		value: 		"function myScript(){return 100;}\n",
		theme:  	"lesser-dark",
		lineNumbers: true
	}
);

myCodeMirror.on('cursorActivity', function ( instance ) {
/* 
* Happens even when it's just text being typed in
*/
	icd.updater.cursorMovementHandler( instance );
});  // End on cursor activity


myCodeMirror.setOption("extraKeys", {
// http://codemirror.net/doc/manual.html#keymaps
	Tab: function() {
	/* 
	* Need to put in right click somehow, or some more sensical shortcut commands
	*/
		// 
		adder.showAdder( myCodeMirror, icd.map );
	}
});

