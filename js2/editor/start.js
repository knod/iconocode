/* start.js
* 
* 
* 
*/

'use strict'

var myCM

// ===========================
// TEST
// ===========================
window.addEventListener('load', function () {

	var editorContainer = document.querySelector('.editor-container')

	myCM = CodeMirror( editorContainer,
		{
			mode: 		'javascript',
			value: 		"function myScript(){return 100;}\ntoken1 = 5;\ntoken2 = 12;",
			theme:  	"lesser-dark",
			lineNumbers: true
		}
	);

	icd.addEditor( myCM );

	// ----------------------------------------------
	var myEditorElement = myCM.getWrapperElement();
	$( myEditorElement ).addClass('test-editor');

	myCM.on('cursorActivity', function ( instance ) {
	/* 
	* Happens even when it's just text being typed in
	*/
		icd.updater.cursorActivityHandler( instance );
	});  // End on cursor activity


	myCM.setOption("extraKeys", {
	// http://codemirror.net/doc/manual.html#keymaps
		'Cmd-I': function() {
		/* 
		* Need to put in right click somehow, or some more sensical shortcut commands
		*/
			// 
			adder.showAdder( myCM, icd.map );
		},
		'Shift-Enter': function() {
			// Run the code written in the editor unless there's an error
			var contents = myCM.getValue();
			contents = contents.replace(/document\.body/, 'document.querySelector(".output")');

			try {
				eval( contents );
			} catch ( error ) {
				console.log( 'CM Error:', error );
			}
		}
	});


	// --- TESTING ICONS --- \\
	// var constructIcon = function ( variableName, purpose, imageNodes ) {
	// 	/* ( str, str, [Nodes] ) -> {}
	// 	* 
	// 	* Creates, sets, and saves an icon with the given values.
	// 	*/
	// 		var iconObj = new Icon( variableName );

	// 		// Placeholder... Not sure this works this way anymore
	// 		// Need to create marker
	// 		iconObj.createNew( document.createDocumentFragment() );
	// 		iconObj.setType( purpose , iconObj.container );
	// 		iconObj.setImages( imageNodes, iconObj.body );

	// 		iconObj.save( icd.map, icd.hotbar );

	// 		return iconObj;
	// };  // End constructIcon()

	// // MAKE ICONS
	// var img1a 	= $(adder.modes.images.grid.choiceContainers[0]).find('img').clone()[0],
	// 	img1b 	= $(adder.modes.images.grid.choiceContainers[1]).find('img').clone()[0],
	// 	img2a 	= $(adder.modes.images.grid.choiceContainers[2]).find('img').clone()[0],
	// 	img2b 	= $(adder.modes.images.grid.choiceContainers[3]).find('img').clone()[0];
	// // Change here so they'll be saved with the right class
	// img1a.className = 'icon-part';
	// img1b.className = 'icon-part';
	// img2a.className = 'icon-part';
	// img2b.className = 'icon-part';

	// var icon1 	= constructIcon( 'token1', 'verb', [img1a, img1b] ),
	// 	icon2 	= constructIcon( 'token2', 'verb', [img2a, img2b] );

	// // INSERT AS MARKERS
	// setTimeout( function () {
	// 	// Wait so there's time for codemirror to tokenize things properly
	// 	var token1 	= myCM.getTokenAt( {line: 1, ch: 1} ),
	// 		token2 	= myCM.getTokenAt( {line: 2, ch: 1} );
	// 	icd.utils.markVar( token1, 1, icon1, myCM );
	// 	icd.utils.markVar( token2, 2, icon2, myCM );

	// } , 50);

});


/* TEST CODE
var x = document.createElement('div');
x.style.width 	= '80px';
x.style.height 	= '30px';
x.style.border 	= '1px solid black';
x.style['backgroundColor'] = 'teal';
document.body.appendChild( x );

TEST updater.markAll()
function myScript(){return 100;}
token1 = 5;
token2 = 12;

var xy = 5;
xy = xy * 2;
console.log(xy
*/

