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

	imgObj should already have its .tags property filled in
	*/
		var tagContainer 		= document.createElement('div');
		parentNode.appendChild( tagContainer );
		tagContainer.className 	= 'image-tag-list-container icd-tag-list-container';

		var tagList 		= document.createElement('ol');
		tagContainer.appendChild( tagList );
		tagList.className 	= 'image-tag-list';
		$(tagList).addClass('choice-tag-list')

		// Add all the search terms in a list
		var tags = imgObj.tags;
		for ( var termi = 0; termi < tags.length; termi++ ) {

			var listItem 	= document.createElement('li');
			tagList.appendChild( listItem );
			listItem.className = 'image-tag';

			var term = document.createTextNode( tags[ termi ] )
			listItem.appendChild( term );

		}


		// Hide them to start with
		// tagContainer.style.display = 'none';

		// // var firstTerm 	= document.createTextNode( imgObj.tags[0] );
		// listItem.appendChild( firstTerm );

		return tagContainer;
	};  // End imgChoice.addImgTagList()


	imgChoice.addImage 		= function ( imgFilePath, parentNode ) {
	/*

	Just create, return, and add an image node with the specified path
	*/
		var choiceNode 	= document.createElement('img');
		parentNode.appendChild( choiceNode );
		choiceNode.src 	= imgFilePath;

		return choiceNode;
	};  // End imgChoice.addImage()


imgChoice.addSVG 		= function ( svgStr, parentNode, imgObj ) {
/* svg string to node */

	// ???: svg into font?

	// --- COLOR STRINGS --- \\
	// First change the color of everything that's colored
	// http://stackoverflow.com/questions/12362270/cant-figure-out-the-color-of-an-svg-element
	var color = 'rgb(153, 153, 153)';
	svgStr = svgStr.replace(/#[0-9]+/g, color );
	svgStr = svgStr.replace(/black/g, color );

	// --- CHECKING AND CHANGING ATTRIBUTES --- \\
	var dummyNode = document.createElement('div');
	dummyNode.innerHTML = svgStr;
	var svg = dummyNode.children[0];

	// --- SIZE --- \\
	// Make sure each svg has a width and height defined
	svg.setAttribute('height', '100%');
	svg.setAttribute('width', '100%');

	// --- COLOR ATTRIBUTES --- \\
	// Last little thing about color has to be done at the end
	// If there is no fill defined, the fill is automatically black
	// http://www.w3.org/TR/SVG/painting.html#FillProperties
	// stroke is no stroke if nothing is specified
	var giveAttr = svgStr.replace(/<svg.*?>/gi, function ( match, original ) {

		var fill 	= match.match(/fill/);
		if ( fill === null ) {
			svg.setAttribute('fill', 'rgb(153, 153, 153)');
		}

	})

	// --- ACTUAL RESULT --- \\
	// Attempt 4 - http://techslides.com/save-svg-as-an-image
	// Turn the html into a string that can be used as a src attribute value
	var newStr 	= dummyNode.innerHTML;
	var imgsrc 		= 'data:image/svg+xml;base64,'+ window.btoa( newStr );

	// Actually the container for realz this time
	var choiceNode 	= document.createElement('img');
	choiceNode.className = imgObj.id;
	parentNode.appendChild( choiceNode );

	choiceNode.src 	= imgsrc;

	return choiceNode;
};  // End imgChoice.addSVG();


	imgChoice.addChoice 	= function ( imgObj, parentNode ) {
	/* ( str, Node ) -> new Node

	Maybe way to do image size to maximize image http://jsfiddle.net/0bmws0me/1/
	(from TheP... something), but maybe we want the images to be their proper size? (??: What did I mean?)
	*/
		// --- CONTAINER --- \\
		var imgContainer 		= document.createElement('div');
		parentNode.appendChild( imgContainer );
		imgChoice.node 			= imgContainer;

		imgContainer.className 	= 'image-choice-container';
		$(imgContainer).addClass( 'icd-choice-container' );

		// --- IMAGE NODE --- \\
		var folderPath 	= imgObj.folderPath// || './images/np/';
		var filePath 	= folderPath + imgObj.filename;

		var choiceNode;
		// np images exist as text svg's, others are actual files
		if ( imgObj.svg !== undefined ) {
			choiceNode = imgChoice.addSVG( imgObj.svg, imgContainer, imgObj )
		} else {
			choiceNode 	= imgChoice.addImage( filePath, imgContainer );
		}

		$(choiceNode).addClass('image-choice');
		$(choiceNode).addClass('icd-adder-choice');
		$(choiceNode).data('terms', imgObj.tags);
		$(choiceNode).data('name', imgObj.fileName);

		// Allows image to recieve focus (not a usual thing for images)
		// Necessarily on this node for keyboard navigation.
		choiceNode.tabIndex = '0';
		// No id?
		// Will use src of clicked image to add correct image
		// No label?

		// For grid keyboard navigation
		choiceNode.addEventListener( 'keydown', function ( evnt ) {
			// adder.imgKeyHandler( evnt );
			adder.modes.images.grid.gridKeyHandler( evnt, adder.modes.images.chooseImage );
		});

		// --- TERM LIST --- \\
		imgChoice.addImgTagList( imgObj, imgContainer );

		// If image is selected, show list of tags
			// In css

		return choiceNode;
	}  // End adder.addChoice()



	imgChoice.addChoice( imgObj, parentNode );

	return imgChoice;
};  // End adder.ImgChoice {}

