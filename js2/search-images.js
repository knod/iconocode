/* search-images.js

Trying to implement fuzzy search functionality with
multiple lists for images.
*/

'use strict'


// Take the form of [{ fileName: '', searchTerms: [], folderPath: '' }, ...]
var imageObjArray = adder.defaultImages;


var replaceWith = function ( imageObj ) {
// From iconocode1, iconocode.js
// Insert an image or replace  selected text with an image. I think.
// At least the first one
	var editor = adder.viewer;
	var wordRange 	= editor.findWordAt( editor.getCursor() );
	var word 		= editor.getRange(wordRange.anchor, wordRange.head);
	// console.log(word);

	var imageDOM = document.createElement( "img" );

	var imgPath = imageObj.folderPath + imageObj.fileName;
	imageDOM.src = imgPath;
	imageDOM.className = "inline";

	// Actually, have to make text invisible, but width of
	// icon, put icon in not in the middle of the text
	// so that code will still be read correctly?
	var identifierElem = editor.markText( wordRange.anchor, wordRange.head,
		{className: "teal", replacedWith: imageDOM}
	 );

	return identifierElem;
};  // End replaceWith()


var makeImage = function( imageObj ) {
/*
*/
	var container = document.createElement();


};  // End makeImage()



document.addEventListener( 'keydown', function (evnt) {
	var key = evnt.keyCode || evnt.which;

	if (evnt.keyCode === 13) {
		var icon;

		// replaceWith(adder.defaultImages[0]);
	}

} );


/*
TODO: Make sure that when the images are added, their object is added to them too?
	Maybe not necessary. It already has the image name in it's src and such...

Probably don't start matching stuff until there are two letters or more?

For each image in the list
	Look for matches in its search terms
	Find the best match? Find all the matches?
	If a match is found, put it (and it's element?) on the list of possible completions
		??: Show the matching text in bold? I think it's important to show the text
		that's being matched, I'm just not sure how


*/

