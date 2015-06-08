/* ICD-Image.js

Builds an image node correctly for insertion into an icon

TODO:
- Convert everything in every script to use .searchTerms
	instead of the whole imgObject
*/

'use strict';

adder.ImgChoice = function ( imgObj, parentNode ) {
/*

!!! WARNING: This is the only node that has to be attached outside its instantiation.
Yeah, that isn't great.
*/

	var imgChoice = {};

	imgChoice.container = null;
	imgChoice.image 	= null;

	imgChoice.addImgTagList 	= function ( imgObj, parentNode ) {
	/* ( {}, Node ) -> other Node

	Adds the list that all the search terms will be added to
	It's a list because later we'll show query matches there and
	they'll be a list too.
	*/
		var tagContainer 		= document.createElement('div');
		parentNode.appendChild( tagContainer );
		tagContainer.className 	= 'image-tag-list-container';

		var list 		= document.createElement('ol');
		tagContainer.appendChild( list );
		list.className 	= 'image-tag-list';
		list.style.position = 'absolute';

		var listItem 	= document.createElement('li');
		list.appendChild( listItem );
		listItem.className = 'image-tag';

		var firstTerm 	= document.createTextNode( imgObj.searchTerms[0] );
		listItem.appendChild( firstTerm );

		return list;
	};  // End imgChoice.addImgTagList()


	imgChoice.addImage 			= function ( imgFilePath, parentNode, parentObj ) {
	/*

	Just create, return, and add an image node with the specified path
	*/
		var imgNode 	= document.createElement('img');
		parentNode.appendChild( imgNode );
		parentObj.image = imgNode;
		imgNode.src 	= imgFilePath;

		return imgNode;
	};  // End imgChoice.addImage()


	imgChoice.addChoice 	= function ( imgObj, parentNode ) {
	/* ( str, Node ) -> new Node

	Maybe way to do image size to maximize image http://jsfiddle.net/0bmws0me/1/
	(from TheP... something), but maybe we want the images to be their proper size?
	*/
		// --- CONTAINER --- \\
		var imgContainer 		= document.createElement('div');
		// parentNode.appendChild( imgContainer );
		imgContainer.className 	= 'image-choice-container';
		imgChoice.container = imgContainer

		// --- IMAGE NODE --- \\
		var filePath 	= imgObj.folderPath + imgObj.fileName;
		var imgNode 	= imgChoice.addImage( filePath, imgContainer, imgChoice );
		$(imgNode).addClass('image-choice');
		// TODO: ??: I don't really need the whole imgObj, but if I don't pass that
		// around, how do I keep hold of terms. This is getting really convoluted
		$(imgNode).data('searchTerms', imgObj.searchTerms);
		// Will later also have .data('matchData') and .data('score')

		// Allows image to recieve focus (not a usual thing for images)
		imgNode.tabIndex = '0';
		// No id?
		// Will use src of clicked image to add correct image
		// No label?

		// TODO: add when clicked and hovered over
		imgNode.addEventListener( 'keydown', function ( evnt ) {
			adder.imgKeyHandler( evnt );
		});

		// --- TERM LIST --- \\
		imgChoice.addImgTagList( imgObj, imgContainer )

		imgChoice.imgNode = imgNode;
		return imgNode;
	}  // End adder.addChoice()



	// imgChoice.addChoice( imgObj, parentNode );
	imgChoice.addChoice( imgObj );

	return imgChoice;
};  // End adder.ImgChoice {}

