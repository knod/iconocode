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

	// Contains functions for setting purpose shapes
	var typeShapeFuncts;

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
		iconContainer.classList.remove( 'noun' );
		iconContainer.classList.remove( 'message' );

		iconContainer.classList.add( type );
		console.log(type); console.log(typeShapeFuncts[ type ])
		typeShapeFuncts[ type ]( iconContainer );

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
	* Want to have this separate somewhere just so it can be found
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


	newIcon.save 		= function ( parentObj ) {
		parentObj[ newIcon.varName ] = newIcon;
	};  // End newIcon.save()


	// =================
	// SVG ELEMENTS
	// =================
	newIcon.svgAttributes 	= 
		"xmlns='http://www.w3.org/2000/svg' " +
		"viewBox='0 0 100 100' preserveAspectRatio='none' ";

	newIcon.toVerbShape = function ( iconContainer ) {
	/* 
	* 
	* Too much of a pita to build it piece by piece the DOM way atm
	* DOMParser() didn't work right, not properly assigning classes
	* to its first child, so trying this now
	*/
		var svgSideDimensions 	= "width='8px' height='100%' ",
			svgAttributes 		= newIcon.svgAttributes;

		var leftNode 	= iconContainer.getElementsByClassName('left')[0];
		var leftHTMLStr =
			'<svg ' + svgSideDimensions + svgAttributes + '> ' +
				//'m' xpos ypos, 'l' xdist ydist, ... 'z'
				"<path d='M 100 0, L0 50, L100 100' />" +
			"</svg>";
		leftNode.innerHTML = leftHTMLStr;

		var rightNode 	= iconContainer.getElementsByClassName('right')[0];
		var rightHTMLStr =
			'<svg ' + svgSideDimensions + svgAttributes + '> ' +
				// 'm' xpos ypos, 'l' xdist ydist, ... 'z'
				"<path d='M 0 0, L100 50, L0 100' />" +
			"</svg>";
		rightNode.innerHTML = rightHTMLStr;

		return iconContainer;
	};  // End newIcon.toVerbShape()


	newIcon.toNounShape = function ( iconContainer ) {
	/* 
	* 
	* Too much of a pita to build it piece by piece the DOM way atm
	* DOMParser() didn't work right, not properly assigning classes
	* to its first child, so trying this now
	*/
		var svgSideDimensions 	= "width='7.5px' height='100%' ",
			svgAttributes 		= newIcon.svgAttributes;

		var leftNode 	= iconContainer.getElementsByClassName('left')[0];
		var leftHTMLStr =
			'<svg ' + svgSideDimensions + svgAttributes + '> ' +
				// arc: 'm' xpos ypos, 'A' x-radius, y-radius rotation ? ? x-end, y-end
				"<path d='m 100 0, A -100, 50, 0 0 0 100, 100' />" +
			"</svg>";
		leftNode.innerHTML = leftHTMLStr;

		var rightNode 	= iconContainer.getElementsByClassName('right')[0];
		var rightHTMLStr =
			'<svg ' + svgSideDimensions + svgAttributes + '> ' +
				// arc: 'm' xpos ypos, 'A' x-radius, y-radius rotation ? ? x-end, y-end
				"<path d='m 0 0, A 100, 50, 0 0 1 0, 100' />" +
			"</svg>";
		rightNode.innerHTML = rightHTMLStr;

		return iconContainer;
	};  // End newIcon.toNounShape()


	newIcon.toMessageShape = function ( iconContainer ) {
	/* 
	* 
	* Too much of a pita to build it piece by piece the DOM way atm
	* DOMParser() didn't work right, not properly assigning classes
	* to its first child, so trying this now
	*/
		var svgSideDimensions 	= "width='10px' height='100%' ",
			svgAttributes 		= newIcon.svgAttributes;

		var leftNode 	= iconContainer.getElementsByClassName('left')[0];
		var leftHTMLStr =
			'<svg ' + svgSideDimensions + svgAttributes + '> ' +
				//'m' xpos ypos, 'l' xdist ydist, ... 'z'
				"<path d='m 100 0 L 0 100, L 100 100' />" +
			"</svg>";
		leftNode.innerHTML = leftHTMLStr;

		var rightNode 	= iconContainer.getElementsByClassName('right')[0];
		var rightHTMLStr =
			'<svg ' + svgSideDimensions + svgAttributes + '> ' +
				// 'm' xpos ypos, 'l' xdist ydist, ... 'z'
				"<path d='m 0 0, L 100 100, L 0 100' />" +
			"</svg>";
		rightNode.innerHTML = rightHTMLStr;

		return iconContainer;
	};  // End newIcon.toMessageShape()


	typeShapeFuncts = {
		'verb': newIcon.toVerbShape,
		'noun': newIcon.toNounShape,
		'message': newIcon.toMessageShape
	};


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


	 newIcon.addCenterShape = function ( centerNode ) {
	/* */
		var htmlStr =
			"<svg width='100%' height='100%' " + newIcon.svgAttributes + ">"  +
				"<line x1='0' y1='0' x2='100%' y2='0'/>" +
				"<line x1='0' y1='100%' x2='100%' y2='100%'/>" +
			"</svg>";

		centerNode.innerHTML = htmlStr;

		return centerNode;
	};  // End newIcon.addCenterShape()


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
		var leftSide 		= document.createElement( 'div' );
		container.appendChild( leftSide );
		leftSide.className 	= 'shape-part left';

		// Center
		var center = document.createElement( 'div' );
		container.appendChild( center );
		center.className = 'shape-part center';
		newIcon.addCenterShape( center );
		// --- Mouseover text --- \\		
		newIcon.addNameText( varName, center );

		// Body in Center
		var body 		= document.createElement( 'div' );
		center.appendChild( body );
		newIcon.body 	= body;
		body.className 	= 'icon-body';

		// Right side
		var rightSide 		= document.createElement( 'div' );
		container.appendChild( rightSide );
		rightSide.className = 'shape-part right';

		return container;
	};  // End newIcon.create()

	return newIcon;
};  // End Icon {}


// --- MOUSEOVER ICON --- \\
// Now in purpose.css
// // TODO: put this somewhere sensical
// var iconMouseoverHandler = function ( mouseoverNode ) {
// /* 
// * 
// */
// 	mouseoverNode.style.display = 'block';
// };  // End iconMouseoverHandler()

// var iconMouseoutHandler  = function ( mouseoverNode ) {
// /* 
// * 
// */
// 	mouseoverNode.style.display = 'none';
// };  // End iconMouseoutHandler()

// document.addEventListener( 'mouseover', function (evnt) {

// 	// var $closestCont = $(evnt.target).closest( '.icon-container' )

// 	// if ( $closestCont[0] !== undefined ) {
// 	// 	var nameCont = $closestCont.find( '.variable-name' )[0]
// 	// 	iconMouseoverHandler( nameCont );
// 	// }
// } );

// document.addEventListener( 'mouseout', function (evnt) {

// 	// var $closestCont = $(evnt.target).closest( '.icon-container' )

// 	// if ( $closestCont[0] !== undefined ) {
// 	// 	var nameCont = $closestCont.find( '.variable-name' )[0]
// 	// 	iconMouseoutHandler( nameCont );
// 	// }
// } );


// TESTING
var icon = new Icon( 'test1' );
icon.createNew( document.body );
icon.setType( 'noun', icon.container );
