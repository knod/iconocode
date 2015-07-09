/* iconocode-image-list.js

A list of all the names of image files and
the path to them?)
*/

'use strict'


adder.defaultImages = null;
adder.imgFolder 	= './images/';


adder.addImgList 	= function () {

	adder.defaultImages = [
		{ fileName: '542px-Pacman.svg.png', searchTerms: ['pacman', 'player', 'yellow', 'circle'] },
		{ fileName: 'book-icon-yellow.png', searchTerms: [ 'book', 'reading', 'open', 'yellow' ] },
		{ fileName: 'js-yellow.png', searchTerms: [ 'js', 'javascript', 'acronym', 'text', 'letters', 'yellow' ] },
		{ fileName: 'mouse.png', searchTerms: [ 'mouse', 'pointer', 'cursor', 'computer', 'black' ] },
		{ fileName: 'plus.png', searchTerms: [ 'plus', 'math', 'add', 'yellow' ] },
		{ fileName: 'search-white.png', searchTerms: [ 'search', 'magnifying', 'glass', 'white', 'gray' ] },
		{ fileName: 'tongue-face.png', searchTerms: [ 'tongue-face', 'face', 'emoticon', 'funny', 'tongue', 'smiley', 'yellow', 'red', 'pink' ] },
		{ fileName: 'mobs-neutral-clear.svg', searchTerms: [ 'mobs', 'ai', 'neutral', 'many', 'group' ] },
		{ fileName: 'columns.svg', searchTerms: [ 'columns' ] },
		{ fileName: 'noun_1306_cc_no-attr.svg', searchTerms: [ 'hammer', 'build', 'construct', 'fix' ] },
		{ fileName: 'noun_37982_cc_no-attr.svg', searchTerms: [ 'grid', 'cells' ] }
	];  // End adder.defaultImages[]


	var imgs = adder.defaultImages;
	var folderPath = adder.imgFolder

	for ( var imgi = 0; imgi < imgs.length; imgi++ ) {
		imgs[ imgi ].folderPath = folderPath;
	}

};  // End adder.addImgList()

adder.addImgList();
