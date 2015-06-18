/* ICD-Image.js

Builds an image node correctly for insertion into an icon
*/

'use strict';

adder.ImgChoice2 = function ( imgObj, parentNode ) {

	var imgChoice = {};

	imgChoice.node = null;

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


	imgChoice.addImage 			= function ( imgFilePath, parentNode ) {
	/*

	Just create, return, and add an image node with the specified path
	*/
		var imgNode 	= document.createElement('img');
		parentNode.appendChild( imgNode );
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
		parentNode.appendChild( imgContainer );
		imgContainer.className 	= 'image-choice-container';

		// --- IMAGE NODE --- \\
		var filePath 	= imgObj.folderPath + imgObj.fileName;
		var imgNode 	= imgChoice.addImage( filePath, imgContainer );
		$(imgNode).addClass('image-choice');
		$(imgNode).data('terms', imgObj.searchTerms);

		// Allows image to recieve focus (not a usual thing for images)
		imgNode.tabIndex = '0';
		// No id?
		// Will use src of clicked image to add correct image
		// No label?

		// TODO: add when clicked
		imgNode.addEventListener( 'keydown', function ( evnt ) {
			adder.imgKeyHandler( evnt );
		});

		// --- TERM LIST --- \\
		imgChoice.addImgTagList( imgObj, imgContainer )

		imgChoice.node = imgContainer;
		return imgNode;
	}  // End adder.addChoice()



	imgChoice.addChoice( imgObj, parentNode );

	return imgChoice;
};  // End adder.ImgChoice {}

