/* image-objects.js

A list of all the names of image files and
the path to them?)
*/

'use strict'


adder.setupImageObjects = function ( arrayOfTags, idsInTags, imgObjsByIds ) {
/* Change the names in future when I'm actually passing the values in */
	// objsByIds is the current name of the thing containing all the image objects

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
		var obj = imgs[ imgi ];
		obj.folderPath = folderPath;
		// TODO: Move to icd.map so that we can have a last id# variable to make more dynamically
		obj.id = 'icd_' + imgi;
		
		// Need to update [tags] and tag: [] and id:{}
		// tagsArray, idsByTag, objsByIds

		// --- objsByIds (objs-by-ids.js) --- \\
		objsByIds[ imgi ] = obj;

		// --- tagsArray (tags-array.js) --- \\  
		// Add all unique tags to master tag array
		for ( var tagi = 0; tagi < obj.tags.length; tagi++ ) {
			var tag = obj.tags[ tagi ];
			if ( tagsArray.indexOf( tag ) === -1 ) {
				tagsArray.push( tag );
			}
		}

	}  // end for every image object


	// --- idsByTag (ids-by-tag.js) --- \\
	var numTags = tagsArray.length;
	var numObjs = imgs.length;

	for ( var tagi = 0; tagi < numTags; tagi++ ) {

		var tag 	= tagsArray[ tagi ];
		var tagIds = [];

		for ( var obji = 0; obji < numObjs; obji++ ) {
			
			var obj = imgs[ obji ];

			// If the tag is in the object's list of tags
			var doesContain = obj.tags.indexOf(tag) > -1;
			if ( doesContain === true ) {
				// Add it to what will be the key's list
				tagIds.push( obj.id );
			}
		}  // end for objects

		idsByTag[ tag ] = tagIds;

	}  // end for tags


	return imgs;
};  // End setupImgObj()

// adder.setupImageObjects
