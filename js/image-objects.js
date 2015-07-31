/* image-objects.js

A list of all the names of image files and
the path to them?)
*/

'use strict'


adder.setupImageObjects = function ( arrayOfTags, idsInTags, imgObjsByIds ) {
/* Change the names in future when I'm actually passing the values in */
	// objsByIds is the current name of the thing containing all the image objects

	var imgs = [
		{ name: 'pacman', filename: '542px-Pacman.svg.png', tags: ['pacman', 'player', 'yellow', 'circle'] },
		{ name: 'book', filename: 'book-icon-yellow.png', tags: [ 'book', 'reading', 'open', 'yellow' ] },
		{ name: 'js', filename: 'js-yellow.png', tags: [ 'js', 'javascript', 'acronym', 'text', 'letters', 'yellow' ] },
		{ name: 'mouse', filename: 'mouse.png', tags: [ 'mouse', 'pointer', 'cursor', 'computer', 'black' ] },
		{ name: 'plus', filename: 'plus.png', tags: [ 'plus', 'math', 'add', 'yellow' ] },
		{ name: 'search', filename: 'search-white.png', tags: [ 'search', 'magnifying', 'glass', 'white', 'gray' ] },
		{ name: 'tongue', filename: 'tongue-face.png', tags: [ 'tongue-face', 'face', 'emoticon', 'funny', 'tongue', 'smiley', 'yellow', 'red', 'pink' ] },
		{ name: 'mobs', filename: 'mobs-neutral-clear.svg', tags: [ 'mobs', 'ai', 'neutral', 'many', 'group' ] },
		{ name: 'columns', filename: 'columns.svg', tags: [ 'columns' ] },
		{ name: 'hammer', filename: 'noun_1306_cc_no-attr.svg', tags: [ 'hammer', 'build', 'construct', 'fix' ] },
		{ name: 'grid', filename: 'noun_37982_cc_no-attr.svg', tags: [ 'grid', 'cells' ] },
		{ name: 'rows', filename: 'rows.svg', tags: [ 'rows' ] },
		{ name: 'push2', filename: 'push2.svg', tags: [ 'push', 'append', 'add', 'list', 'array', 'add to', 'new', 'item' ] },
		{ name: 'push3', filename: 'push3.svg', tags: [ 'push', 'append', 'add', 'list', 'array', 'add to', 'new', 'item' ] },
		{ name: 'push', filename: 'push.svg', tags: [ 'push', 'append', 'add', 'list', 'array', 'add to', 'new', 'item' ] }
	];  // End adder.imgs[]


	var folderPath 	= './images/';

	for ( var imgi = 0; imgi < imgs.length; imgi++ ) {
		var obj = imgs[ imgi ];
		obj.folderPath = folderPath;
		// TODO: Move to icd.map so that we can have a last id# variable to make more dynamically
		obj.id = 'icd_' + imgi;
		
		// Need to update [tags] and tag: [] and id:{}
		// tagsArray, idsByTag, objsByIds

		var imgObjsByIds = objsByIds || objsByIdsSample || new Object;

		// --- objsByIds (objs-by-ids.js) --- \\
		imgObjsByIds[ imgi ] = obj;

		// --- tagsArray (tags-array.js) --- \\  
		// Add all unique tags to master tag array
		for ( var tagi = 0; tagi < obj.tags.length; tagi++ ) {
			var tag = obj.tags[ tagi ];
			if ( tagsArray.indexOf( tag ) === -1 ) {
				tagsArray.push( tag );
				tagsArray[ tag ] = [];  // So it can be added to later
			}
		}

	}  // end for every image object


	// --- idsByTag (ids-by-tag.js) --- \\
	
		
	var numTags = tagsArray.length;

	// Get each tag, including the new ones
	for ( var tagi = 0; tagi < numTags; tagi++ ) {

		var tag 	= tagsArray[ tagi ];
		var tagIds = [];

		// Get each new object
		for ( var obji = 0; obji < imgs.length; obji++ ) {
			
			var obj = imgs[ obji ];

			// If the new object contains that tag
			var doesContain = obj.tags.indexOf( tag ) > -1;
				// add that object's id to the idsByTag dict
			if ( doesContain === true ) {
				// But first, if it's a new tag and not in the idsByTag dict
				// Add the tag as a key to the idsByTag dict
				if ( !idsByTag.hasOwnProperty( tag ) ) {
					idsByTag[ tag ] = [];
				}

				idsByTag[ tag ].push( obj.id );
			}
		}  // end for new objects

	}  // end for tags

	// ???: Not sure what to return, there are 3 major things here
	return imgObjsByIds;
};  // End setupImgObj()

// adder.setupImageObjects
