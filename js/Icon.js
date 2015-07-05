/* Icon.js
* Creating and editing an Icon object
* 
* TODO:
* - Consider making images icon fonts so their color is easy to change.
* - Make icon parts able to be any type of node
*/

'use strict'

var prefix = 'icd';

var Icon = function ( varName ) {
/*

*/
	var newIcon = {};

	newIcon.varName = varName;  // Or just in tags? Or just varName? Or what?
	newIcon.type;  // Need to store this here or just in tags? Is everything tags?
	newIcon.images 	= [];  // [] or {}? 

	newIcon.container 	= null;
	newIcon.body 		= null;
	newIcon.mouseoverNode = null;
	// data-id?
	// made up of its image names perhaps? That way we can more easily tell if there's a repeat?
	newIcon.id;
	newIcon.tags = [];  // data-tags? classes?

	newIcon.path;  // svg path?
	newIcon.width;  // !!!: Don't need this if we're using markers
	newIcon.borderColor;
	newIcon.borderShape;

	// Text - visibility: hidden, width = icon.width, setWidth

	// ======================
	// FUNCTIONS
	// ======================
	newIcon.setParent = function ( parent ) {
		parent.appendChild( newIcon.container );
	};  // End newIcon.setParent()

	newIcon.setType = function ( type, iconContainer ) {
	/*

	Sets border shape based on type
	Type suggestions:
		transative, intransitive
		data, logic (process?), message
		data, state (special kind of data), process, message
		keyword (types of keywords?)
			control
			logic
	*/
		// newIcon.container.style.border = '1px solid gray';
		// var borderRadius = '0'

		// Change class of before and after body nodes

		iconContainer.classList.remove( 'verb' );
		iconContainer.classList.remove( 'data' );
		iconContainer.classList.remove( 'noun' );
		iconContainer.classList.remove( 'square' );
		iconContainer.classList.remove( 'message' );

		iconContainer.classList.add( type );

		// if ( type === 'data' ) {
		// 	// Makes sure border right and left look round
		// 	borderRadius = '50px';
		// } else if ( type === 'message' ) {
		// 	newIcon.container
		// }
		// // control
		// // logic? process?

		// newIcon.container.style.borderRadius = borderRadius;

	};  // End newIcon.setType()


	newIcon.addTerms 	= function ( partNode ) {
	/* 
	* 
	* Get the search terms on the node and add them to the icon
	* TODO: Just do newIcon.tags = someList; List will be
	* 	constructed elsewhere
	*/
		newIcon.tags.push( $(partNode).data('terms') );

		return partNode;
	};  // End newIcon.addTerms()


	newIcon.setId 		= function ( idStr ) {
	/* ( str ) ->  Icon
	* 
	* Want to have this separate somewhere
	*/
		newIcon.id = idStr;
		return newIcon;
	};  // End newIcon.setId()


	newIcon.setImages 	= function ( partNodes, parentNode ) {
	/* 
	* 
	* Gets all the parts of the icon and, using the $data 'terms',
	* builds the icon with its search terms. Also sets the id
	* of the icon using the image names.
	* !!!: That's a lot for one function to do
	*/
		// TODO: Add way to add in the text nodes as well

		// How to construct this? Use a 'name' data property in image's node
		var imgNamesStr = '';
		// Always a good idea to use length with node list loops
		var numNodes 	= partNodes.length;
		for ( var nodei = 0; nodei < numNodes; nodei++ ) {
			var $imgNode = $(partNodes[nodei]);

			// Deeply copy the image and add it to the icon
			$imgNode.clone().appendTo( $(parentNode) );
			imgNamesStr += $imgNode.data('name');
		}

		newIcon.setId( imgNamesStr )

		return parentNode;
	};  // End newIcon.setImages()


	// newIcon.setId 		= function ( newID ) {
	// 	var iconPath = newIcon.path;
	// 	iconPath.setAttribute( 'id', newID );

	// 	return newIcon.container;
	// };  // End newIcon.setId()


	newIcon.save 		= function ( parentObj ) {
		parentObj[ newIcon.varName ] = newIcon;
	};  // End newIcon.save()


	newIcon.addVerbShape = function ( parentNode ) {
	/* 
	* 
	* Too much of a pita to build it piece by piece the DOM way atm
	* DOMParser() didn't work right, not properly assigning classes
	* to its first child, so trying this now
	*/
		// Remove this later, this will be the parent passed in
		var container = document.createElement('div');
		container.className = 'icd icon-container verb';

		var svgSideDimensions 	= "width='8px' height='100%' ",
			svgCenterDimensions = "width='100%' height='100%' ";

		var svgAttributes =
			 "xmlns='http://www.w3.org/2000/svg' " +
			 "viewBox='0 0 100 100' preserveAspectRatio='none' ";

		var htmlStr =
			"<div class='shape-part left'>" +
				'<svg ' + svgSideDimensions + svgAttributes + '> ' +
					//'m' xpos ypos, 'l' xdist ydist, ... 'z'
					"<path d='M 100 0, L0 50, L100 100' />" +
				"</svg>" +
			"</div>" +

			"<div class='shape-part center'>" +
				'<svg ' + svgCenterDimensions + svgAttributes + '> ' +
					"<line x1='0' y1='0' x2='100%' y2='0'/>" +
					"<line x1='0' y1='100%' x2='100%' y2='100%'/>" +
				"</svg>" +
				// Where the contents will go (images, text, etc)
				"<div class='icon-body'></div>" +
			"</div>" +

			"<div class='shape-part right'>" +
				'<svg ' + svgSideDimensions + svgAttributes + '> ' +
					// 'm' xpos ypos, 'l' xdist ydist, ... 'z'
					"<path d='M 0 0, L100 50, L0 100' />" +
				"</svg>" +
			"</div>";
		
		container.innerHTML = htmlStr;

		parentNode.appendChild( container );

		return htmlStr;
	};  // End newIcon.addVerbShape()


	// newIcon.addVerbShape = function ( parentNode ) {
	// /* 
	// * 
	// * Too much of a pita to build it piece by piece the DOM way atm
	// * Strings to DOM nodes: http://stackoverflow.com/questions/3103962/converting-html-string-into-dom-elements
	// * Note: any attributes able to be defined with css are in purposes.css
	// */
	// 	// Remove this later, this will be the parent passed in
	// 	var container = document.createElement('div');
	// 	container.className = 'icd icon-container verb';

	// 	var svgSideDimensions 	= "width='8px' height='100%' ",
	// 		svgCenterDimensions = "width='100%' height='100%' ";

	// 	var svgAttributes =
	// 		 "xmlns='http://www.w3.org/2000/svg' " +
	// 		 "viewBox='0 0 100 100' preserveAspectRatio='none' ";

	// 	var xmlLeft 	=
	// 		"<div class='shape-part left'>" +
	// 			'<svg ' + svgSideDimensions + svgAttributes + '> ' +
	// 				//'m' xpos ypos, 'l' xdist ydist, ... 'z'
	// 				"<path d='M 100 0, L0 50, L100 100' />" +
	// 			"</svg>" +
	// 		"</div>";
	// 		console.log(xmlLeft)
	// 	// See the link referenced in the function definition
	// 	var parser 		= new DOMParser(),
	// 		aDocument 	= parser.parseFromString(xmlLeft, "text/xml"),
	// 		leftNode 	= aDocument.firstChild;
	// 	container.appendChild( leftNode );

	// 	var xmlCenter 	=
	// 		"<div class='shape-part center'>" +
	// 			'<svg ' + svgCenterDimensions + svgAttributes + '> ' +
	// 				"<line x1='0' y1='0' x2='100%' y2='0'/>" +
	// 				"<line x1='0' y1='100%' x2='100%' y2='100%'/>" +
	// 			"</svg>" +
	// 			// Where the contents will go (images, text, etc)
	// 			"<div class='icon-body'></div>" +
	// 		"</div>";
	// 	// See the link referenced in the function definition
	// 	parser 			= new DOMParser(),
	// 		aDocument 	= parser.parseFromString(xmlCenter, "text/xml");
	// 	var centerNode 	= aDocument.firstChild;
	// 	container.appendChild( centerNode );

	// 	var xmlRight	=
	// 		"<div class='shape-part right'>" +
	// 			'<svg ' + svgSideDimensions + svgAttributes + '> ' +
	// 				// 'm' xpos ypos, 'l' xdist ydist, ... 'z'
	// 				"<path d='M 0 0, L100 50, L0 100' />" +
	// 			"</svg>" +
	// 		"</div>";
	// 	// See the link referenced in the function definition
	// 	parser 			= new DOMParser(),
	// 		aDocument 	= parser.parseFromString(xmlRight, "text/xml");
	// 	var rightNode 	= aDocument.firstChild;
	// 	container.appendChild( rightNode );

	// 	// // See the link referenced in the function definition
	// 	// var parser 		= new DOMParser(),
	// 	// 	aDocument 	= parser.parseFromString(xmlString, "text/xml"),
	// 	// 	shapeNode 	= aDocument.firstChild;

	// 	// fragment.appendChild( shapeNode );
	// 	// container.appendChild(fragment);
	// 	parentNode.appendChild( container );

	// 	return container;
	// };

	newIcon.addNounShape = function ( parentNode ) {
	/* 
	* 
	* Too much of a pita to build it piece by piece the DOM way atm
	* Strings to DOM nodes: http://stackoverflow.com/questions/3103962/converting-html-string-into-dom-elements
	*/
		// Remove this later, this will be the parent passed in
		var container = document.createElement('div');
		container.className = 'icd icon-container verb';

		var svgAttributes =
			// Apparently these svg properties can't be done with css
			 "<svg width='8px' height='100%' " +
			 "xmlns='http://www.w3.org/2000/svg' " +
			 "viewBox='0 0 100 100' preserveAspectRatio='none'>";

		var xmlLeft 	=
			"<div class='shape-part left'>" +
				svgAttributes +
					//'m' xpos ypos, 'l' xdist ydist, ... 'z'
					"<path d='M 100 0, L0 50, L100 100' />" +
				"</svg>" +
			"</div>";
		// See the link referenced in the function definition
		var parser 		= new DOMParser(),
			aDocument 	= parser.parseFromString(xmlLeft, "text/xml"),
			leftNode 	= aDocument.firstChild;
		container.appendChild( leftNode );

		var xmlCenter 	=
			"<div class='shape-part center'>" +
				svgAttributes +
					"<line x1='0' y1='0' x2='100%' y2='0'/>" +
					"<line x1='0' y1='100%' x2='100%' y2='100%'/>" +
				"</svg>" +
				// Where the contents will go (images, text, etc)
				"<div class='icon-body'></div>" +
			"</div>";
		// See the link referenced in the function definition
		parser 		= new DOMParser(),
			aDocument 	= parser.parseFromString(xmlCenter, "text/xml"),
			centerNode 	= aDocument.firstChild;
		container.appendChild( centerNode );

		var xmlRight	=
			"<div class='shape-part right'>" +
				svgAttributes +
					// 'm' xpos ypos, 'l' xdist ydist, ... 'z'
					"<path d='M 0 0, L100 50, L0 100' />" +
				"</svg>" +
			"</div>";
		// See the link referenced in the function definition
		parser 		= new DOMParser(),
			aDocument 	= parser.parseFromString(xmlRight, "text/xml"),
			rightNode 	= aDocument.firstChild;
		container.appendChild( rightNode );

		// // See the link referenced in the function definition
		// var parser 		= new DOMParser(),
		// 	aDocument 	= parser.parseFromString(xmlString, "text/xml"),
		// 	shapeNode 	= aDocument.firstChild;

		// fragment.appendChild( shapeNode );
		// container.appendChild(fragment);
		parentNode.appendChild( container );

		return shapeNode;
	};


// 	newIcon.createSVG 	= function ( typeName, parentNode ) {
// 	/* ???: Should we even use an svg */

// 		var NS 				= 'http://www.w3.org/2000/svg';  // Not sure what this is
// 		var svg 			= document.createElementNS( NS, 'svg');
// 		var propertyName 	= typeName + 'SVG';
// 		newIcon.path 		= svg;

// 		svg.setAttribute( 'width', '100%'); svg.setAttribute( 'height', '100%');

// 		parentNode.appendChild( svg );

// 		// svg's don't have classes :P
// 		// maybe check out http://toddmotto.com/hacking-svg-traversing-with-ease-addclass-removeclass-toggleclass-functions/

// 		var group 			= document.createElementNS( NS, 'g');
// 		svg.appendChild( group );

// 		var path 			= document.createElementNS( NS, 'path');
// 		// I don't think this is ideal. Not sure what to do about it yet though.
// 		newIcon.path 		= path;
// 		group.appendChild( path );

// 		path.setAttribute( 'stroke-width', '1' );
// 		path.setAttribute( 'stroke', '#000000' );
// 		path.setAttribute( 'fill', 'none' );
// 		// http://codepen.io/gionkunz/pen/KDvLj
// 		svg.setAttribute( 'vector-effect', 'non-scaling-stroke' );

// 		return svg;
// 	};  // End adder.createSVG()


// 	newIcon.createVerb 	= function ( parentNode ) {

// 		var NS 			= 'http://www.w3.org/2000/svg';  // Not sure what this is
// 		var verbSVG 	= newIcon.createSVG( 'verb', parentNode );
// 		parentNode.appendChild( verbSVG );

// 		var boundingBox = parentNode.getBoundingClientRect();
// 		var svgHeight 	= boundingBox.height;
// 		var svgWidth 	= boundingBox.width;
// 		// console.log(svgHeight)
// 		// debugger;

// 		var lineAngle 	= 35;

// 		var vertCenter 	= svgHeight/2;
// 		var angledLineLength = Math.cos( lineAngle ) * svgHeight;


// 		var verbPath 	= newIcon.path;
// 		var start 		= 'M 1 ' + vertCenter;
// 		var topLeft 	= ', l ' + lineAngle + ' ' + angledLineLength;

// 		verbPath.setAttribute( 'd', start + topLeft );


// // var svg = '<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">' +
// // 			'<g>' +
// // 		  		'<path id="svg_9" d="m5 52, l35 -45, l120 0, l35 45, l-35 45, l-120 0, l-35 -45z"' +
// // 		  		' stroke-width="5" stroke="#000000" fill="none"/>' +
// // 		 	'</g>' +
// // 		'</svg>';

// // 		var svg = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
// // 			'<g>' +
// // 		  		'<path id="svg_9" d="m 5 52, l 35 -45, l 120 0, l 35 45, l -35 45, l -120 0, l -35 -45z"' +
// // 		  		' stroke-width="5" stroke="#000000" fill="none"/>' +
// // 		 	'</g>' +
// // 		'</svg>';

// 		// container.innerHTML = svg;

// 	};


	newIcon.addNameText = function ( varName, parentNode ) {
	/*
	* 
	* Add text that will show when the icon is moused over
	*/
		var nameContainer 	= document.createElement( 'div' );
		parentNode.appendChild( nameContainer );
		newIcon.mouseoverNode = nameContainer;

		$(nameContainer).addClass( 'variable-name' );

		var nameText 		= document.createTextNode( varName );
		nameContainer.appendChild( nameText );

		return nameContainer;
	};  // End newIcon.addNameText()


	newIcon.createNew 	= function ( parentNode ) {
	/* 
	* 
	* Create the container and the three base elements for the icon
	* No id because there will be many of this icon
	*/
		var container 	 	= document.createElement( 'div' );
		parentNode.appendChild( container );
		newIcon.container 	= container;
		container.className = prefix + ' icon-container';

		// Left side
		var hider1 		 = document.createElement( 'div' );
		container.appendChild( hider1 );
		hider1.className = prefix + ' icon-side-hider'

		var before 		 = document.createElement( 'div' );
		hider1.appendChild(before);
		before.className = prefix + ' before-icon-body';


		// Body
		var body 		= document.createElement( 'div' );
		container.appendChild( body );
		newIcon.body 	= body;
		body.className 	= prefix + ' icon-body';

		// Right side
		var hider2 		 = document.createElement( 'div' );
		container.appendChild( hider2 );
		hider2.className = prefix + ' icon-side-hider';

		var after 		 = document.createElement( 'div' );
		hider2.appendChild(after);
		after.className  = prefix + ' after-icon-body';


		// --- Mouseover text --- \\		
		newIcon.addNameText( varName, container );

		return container;
	};  // End newIcon.create()

	return newIcon;
};  // End Icon {}


// --- MOUSEOVER ICON --- \\
// TODO: put this somewhere sensical
var iconMouseoverHandler = function ( mouseoverNode ) {
/* 
* 
*/
	mouseoverNode.style.display = 'block';
};  // End iconMouseoverHandler()

var iconMouseoutHandler  = function ( mouseoverNode ) {
/* 
* 
*/
	mouseoverNode.style.display = 'none';
};  // End iconMouseoutHandler()

document.addEventListener( 'mouseover', function (evnt) {

	var $closestCont = $(evnt.target).closest( '.icon-container' )

	if ( $closestCont[0] !== undefined ) {
		var nameCont = $closestCont.find( '.variable-name' )[0]
		iconMouseoverHandler( nameCont );
	}
} );

document.addEventListener( 'mouseout', function (evnt) {

	var $closestCont = $(evnt.target).closest( '.icon-container' )

	if ( $closestCont[0] !== undefined ) {
		var nameCont = $closestCont.find( '.variable-name' )[0]
		iconMouseoutHandler( nameCont );
	}
} );


// TESTING
var icon = new Icon( 'test1' );
icon.createNew( document.body );
icon.setType( 'noun', icon.body );
