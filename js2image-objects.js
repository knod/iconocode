/* image-objects.js

A list of all the names of image files and
the path to them?)
*/

'use strict'


adder.setupImageObjects = function () {

	var imgs = [
		{ filename: '542px-Pacman.svg.png', tags: ['pacman', 'player', 'yellow', 'circle'] },
		{ filename: 'book-icon-yellow.png', tags: [ 'book', 'reading', 'open', 'yellow' ] },
		{ filename: 'js-yellow.png', tags: [ 'js', 'javascript', 'acronym', 'text', 'letters', 'yellow' ] },
		{ filename: 'mouse.png', tags: [ 'mouse', 'pointer', 'cursor', 'computer', 'black' ] },
		{ filename: 'plus.png', tags: [ 'plus', 'math', 'add', 'yellow' ] },
		{ filename: 'search-white.png', tags: [ 'search', 'magnifying', 'glass', 'white', 'gray' ] },
		{ filename: 'tongue-face.png', tags: [ 'tongue-face', 'face', 'emoticon', 'funny', 'tongue', 'smiley', 'yellow', 'red', 'pink' ] },
		{ filename: 'mobs-neutral-clear.svg', tags: [ 'mobs', 'ai', 'neutral', 'many', 'group' ] },
		{ filename: 'columns.svg', tags: [ 'columns' ] },
		{ filename: 'noun_1306_cc_no-attr.svg', tags: [ 'hammer', 'build', 'construct', 'fix' ] },
		{ filename: 'noun_37982_cc_no-attr.svg', tags: [ 'grid', 'cells' ] },
		{ filename: 'rows.svg', tags: [ 'rows' ] },
		{ filename: 'push2.svg', tags: [ 'push', 'append', 'add', 'list', 'array', 'add to', 'new', 'item' ] },
		{ filename: 'push3.svg', tags: [ 'push', 'append', 'add', 'list', 'array', 'add to', 'new', 'item' ] },
		{ filename: 'push.svg', tags: [ 'push', 'append', 'add', 'list', 'array', 'add to', 'new', 'item' ] }
	];  // End adder.imgs[]


	var folderPath 	= './images/';

	for ( var imgi = 0; imgi < imgs.length; imgi++ ) {
		imgs[ imgi ].folderPath = folderPath;
	}

	// Add the compile np image objects
	if ( npImages !== undefined ) {
		imgs = imgs.concat( npImages );
	}
	console.log('imgs[0]:', imgs[0])

	return imgs;
};  // End setupImgObj()

// adder.setupImageObjects
