/* search-images.js

Trying to implement fuzzy search functionality with
multiple lists for images.
*/

'use strict'


// Take the form of [{ fileName: '', searchTerms: [], folderPath: '' }, ...]
var imageObjArray = adder.defaultImages;

var fuzzySearcher = new FuzzySearcher();


adder.runSearch = function () {};


// document.addEventListener( 'keyup', function (evnt) {

// 	var target = evnt.target;

// 	if ( target.tagName === 'TEXTAREA' ) {
		


// 	}
// 	var key = evnt.keyCode || evnt.which;

// 	if (evnt.keyCode === 13) {
// 		var icon;

// 		// replaceWith(adder.defaultImages[0]);
// 	}

// } );


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

