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

	var startingCode = "'use strict'\n\n" +
"\n" +
"var player = {};\n" +
"player.node;\n" +
"player.speed = 15;// px's per step\n" +
"\n" +
"var addPlayer = function ( parentNode ) {\n" +
"	var node = document.createElement('div');\n" +
"  	parentNode.appendChild( node );\n" +
"  	node.style.width = '50px';\n" +
"  	node.style.height = '50px';\n" +
"  	node.style['backgroundColor'] = 'teal';\n" +
"    node.style.border = '1px solid black';\n" +
"    node.style.position = 'absolute';\n" +
"  \n" +
"  	return node;\n" +
"};\n" +
"\n" +
"var move = function ( node, direction ) {\n" +
"// ( {x: int, y: int} ) -> None\n" +
"\n" +
"  var top = node.offsetTop;\n" +
"  var left = node.offsetLeft;\n" +
"  top = top + (direction.y * player.speed);\n" +
"  left = left + (direction.x * player.speed);\n" +
"  \n" +
"  node.style.left = left + 'px';\n" +
"  node.style.top = top + 'px';\n" +
"};\n" +
"\n" +
"\n" +
"// START\n" +
"player.node = addPlayer( document.body );\n" +
"\n" +
"// ##post\n" +
"// Has to be 'keydown' or evnt.preventDefault() won't work. Events effects will have already happened\n" +
"//$('.output').on( 'keydown', function keyup(evnt) {\n" +
"document.addEventListener( 'keydown', function keyup(evnt) {\n" +
"  	var x = 0, y = 0;\n" +
"  	var key = evnt.keyCode;\n" +
"  	if 		( key === 40 ) { y = 1; }\n" +
"  	else if ( key === 38 ) { y = -1; }\n" +
"  	else if ( key === 39 ) { x = 1; }\n" +
"  	else if ( key === 37 ) { x = -1; }\n" +
"  \n" +
"	var direction = {x: x, y: y};\n" +
"  	evnt.preventDefault();\n" +
"  	move( player.node, direction );\n" +
"  // up: 38, down: 40, left: 37, right: 39console.log(event.keyCode);\n" +
"});";

	myCM = CodeMirror( editorContainer,
		{
			mode: 		'javascript',
			value: 		startingCode,
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


	var output = document.querySelector(".output");


	var rerunOutput = function ( jsText ) {

		// Remove iframe
		$(output).remove();

		// Recreate iframe
		output = document.createElement('iframe');
		output.className = 'output';
		$('.app').append( output );

		// Evaluate the code into the iframe
		var outputWindow = output.contentWindow;  // the iframe's window

		try {
			outputWindow.eval( jsText );
		} catch ( error ) {
			console.log( 'CM Error:', error );
		}
		
		return output;
	};  // End rerunOutput()


	myCM.setOption("extraKeys", {
	// http://codemirror.net/doc/manual.html#keymaps
		'Cmd-I': function() {
		// Need to put in right click somehow, or some more sensical shortcut commands
			adder.showAdder( myCM, icd.map );
		},

		'Ctrl-I': function() {
		// Need to put in right click somehow, or some more sensical shortcut commands
			adder.showAdder( myCM, icd.map );
		},

		'Shift-Enter': function() {
			// Run the code written in the editor unless there's an error
			var contents = myCM.getValue();
			rerunOutput( contents );
		}
	});


	// // ====================================================
	// // --- TESTING ICONS --- \\
	// // ====================================================
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
	// var parent 	= document.createDocumentFragment();

	// var img1a 	= adder.ImgChoice2( objsByIds['icd_0'], parent ).node,
	// 	img1b 	= adder.ImgChoice2( objsByIds['icd_1'], parent ).node,
	// 	img2a 	= adder.ImgChoice2( objsByIds['icd_2'], parent ).node,
	// 	img2b 	= adder.ImgChoice2( objsByIds['icd_3'], parent ).node;

	// img1a 	= $(img1a).find('.image-choice')[0];
	// img1b 	= $(img1b).find('.image-choice')[0];
	// img2a 	= $(img2a).find('.image-choice')[0];
	// img2b 	= $(img2b).find('.image-choice')[0];

	// var icon1 	= constructIcon( 'token1', 'verb', [img1a, img1b] ),
	// 	icon2 	= constructIcon( 'token2', 'verb', [img2a, img2b] );

	// // INSERT AS MARKERS
	// setTimeout( function () {
	// 	// Wait so there's time for codemirror to tokenize things properly
	// 	var token1 	= myCM.getTokenAt( {line: 1, ch: 1} ),
	// 		token2 	= myCM.getTokenAt( {line: 2, ch: 1} );
		icd.updater.markAll( myCM, icd.map );

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
console.log(xy)

TEST 4? 5?
'use strict'

var player = {};
player.node;
player.speed = 15;// px's per step

var addPlayer = function ( parentNode ) {
	var node = document.createElement('div');
  	parentNode.appendChild( node );
  	node.style.width = '50px';
  	node.style.height = '50px';
  	node.style['backgroundColor'] = 'teal';
    node.style.border = '1px solid black';
    node.style.position = 'absolute';
  
  	return node;
};

var move = function ( node, direction ) {
// ( {x: int, y: int} ) -> None

  var top = node.offsetTop;
  var left = node.offsetLeft;
  top = top + (direction.y * player.speed);
  left = left + (direction.x * player.speed);
  
  node.style.left = left + 'px';
  node.style.top = top + 'px';
};


// START
player.node = addPlayer( document.body );

// ##post
// Has to be 'keydown' or evnt.preventDefault() won't work. Events effects will have already happened
//$('.output').on( 'keydown', function keyup(evnt) {
document.addEventListener( 'keydown', function keyup(evnt) {
  	var x = 0, y = 0;
  	var key = evnt.keyCode;
  	if 		( key === 40 ) { y = 1; }
  	else if ( key === 38 ) { y = -1; }
  	else if ( key === 39 ) { x = 1; }
  	else if ( key === 37 ) { x = -1; }
  
	var direction = {x: x, y: y};
  	evnt.preventDefault();
  	move( player.node, direction );
  // up: 38, down: 40, left: 37, right: 39console.log(event.keyCode);
});





*/

