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

	imgObj should already have its .searchTerms property filled in
	*/
		var tagContainer 		= document.createElement('div');
		parentNode.appendChild( tagContainer );
		tagContainer.className 	= 'image-tag-list-container icd-tag-list-container';

		var tagList 		= document.createElement('ol');
		tagContainer.appendChild( tagList );
		tagList.className 	= 'image-tag-list';
		$(tagList).addClass('icd-choice-tag-list')
		tagList.style.position = 'absolute';

		// Add all the search terms in a list
		var searchTerms = imgObj.searchTerms;
		for ( var termi = 0; termi < searchTerms.length; termi++ ) {

			var listItem 	= document.createElement('li');
			tagList.appendChild( listItem );
			listItem.className = 'image-tag';

			var term = document.createTextNode( searchTerms[ termi ] )
			listItem.appendChild( term );

		}


		// Hide them to start with
		// tagContainer.style.display = 'none';

		// // var firstTerm 	= document.createTextNode( imgObj.searchTerms[0] );
		// listItem.appendChild( firstTerm );

		return tagContainer;
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
		imgChoice.node = imgContainer;

		imgContainer.className 	= 'image-choice-container';
		$(imgContainer).addClass( 'icd-choice-container' );

		// --- IMAGE NODE --- \\
		var filePath 	= imgObj.folderPath + imgObj.fileName;
		var imgNode 	= imgChoice.addImage( filePath, imgContainer );
		$(imgNode).addClass('image-choice');
		$(imgNode).addClass('icd-adder-choice');
		$(imgNode).data('terms', imgObj.searchTerms);
		$(imgNode).data('name', imgObj.fileName);

		// Allows image to recieve focus (not a usual thing for images)
		imgNode.tabIndex = '0';
		// No id?
		// Will use src of clicked image to add correct image
		// No label?

		// TODO: add when clicked
		imgNode.addEventListener( 'keydown', function ( evnt ) {
			// adder.imgKeyHandler( evnt );
			adder.modes.images.grid.gridKeyHandler( evnt, adder.chooseImage );
		});

		// --- TERM LIST --- \\
		imgChoice.addImgTagList( imgObj, imgContainer );

		// If image is selected, show list of tags
			// In css

		return imgNode;
	}  // End adder.addChoice()



	imgChoice.addChoice( imgObj, parentNode );

	return imgChoice;
};  // End adder.ImgChoice {}

