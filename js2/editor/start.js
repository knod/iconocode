/* start.js
* 
* 
* 
*/

'use strict'

var myCodeMirror = CodeMirror(document.body,
	{
		mode: 		'javascript',
		value: 		"function myScript(){return 100;}\ntoken1 = 5;\ntoken2 = 12;",
		theme:  	"lesser-dark",
		lineNumbers: true
	}
);

var myEditorElement = myCodeMirror.getWrapperElement();
$( myEditorElement ).addClass('test-editor');

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

// ===========================
// TEST
// ===========================
window.addEventListener('load', function () {
	var myCM = myCodeMirror;

	var constructIcon = function ( variableName, purpose, imageNodes ) {
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
	};  // End constructIcon()

	// MAKE ICONS
	var img1a 	= $(adder.modes.images.grid.choiceContainers[0]).find('img')[0],
		img1b 	= $(adder.modes.images.grid.choiceContainers[1]).find('img')[0],
		img2a 	= $(adder.modes.images.grid.choiceContainers[2]).find('img')[0],
		img2b 	= $(adder.modes.images.grid.choiceContainers[3]).find('img')[0];
	img1a.className = 'icon-part';
	img1b.className = 'icon-part';
	img2a.className = 'icon-part';
	img2b.className = 'icon-part';

	var icon1 	= constructIcon( 'token1', 'verb', [img1a, img1b] ),
		icon2 	= constructIcon( 'token2', 'verb', [img2a, img2b] );

	// INSERT AS MARKERS
	setTimeout( function () {
		// Wait so there's time for codemirror to tokenize things properly
		var token1 	= myCM.getTokenAt( {line: 1, ch: 1} ),
			token2 	= myCM.getTokenAt( {line: 2, ch: 1} );
		icd.utils.markVar( token1, 1, icd.map, myCM );
		icd.utils.markVar( token2, 2, icd.map, myCM );
	} , 50);

});


