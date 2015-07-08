/* Adder-Icon.js */

'use strict'

var prefix = 'icd';

var AdderIcon = function () {
/* ( none ) -> AdderIcon
* 
* Weird icon container shape in the background of the
* adder editor instance that tries to adjust the fake icon
* container to match the width of the icon being built.
*/
	var newIcon = {};

	newIcon.type;  // Need to store this here or just in tags? Is everything tags?
	newIcon.container 	= null;

	// newIcon.path;  // svg path?
	// newIcon.width;  // !!!: Don't need this if we're using markers
	newIcon.borderColor;
	// newIcon.borderShape;

	// Contains functions for setting purpose shapes
	var typeShapeFuncts;


	// ======================
	// FUNCTIONS
	// ======================
	newIcon.setParent = function ( parent ) {
		parent.appendChild( newIcon.container );
	};  // End newIcon.setParent()

	newIcon.setType = function ( type ) {
	/* ( str, node ) -> AdderIcon
	* 
	*/
		var iconContainer = newIcon.container;

		iconContainer.classList.remove( 'verb' );
		iconContainer.classList.remove( 'noun' );
		iconContainer.classList.remove( 'message' );
		iconContainer.classList.remove( 'default' );

		iconContainer.classList.add( type );
		typeShapeFuncts[ type ]( iconContainer );

		return newIcon
	};  // End newIcon.setType()

	// newIcon.setSearchBar 	= function ( barNode ) {
	// /* ( [node], node ) -> latter Node
	// * 
	// */
	// 	newIcon.body.appendChild( barNode );
	// 	return parentNode;
	// };  // End newIcon.setSearchBar()

	newIcon.setWidth = function( contentNode ) {
	/* 
	* Width is weird with relation to the content in the adder
	* and the fake icon container and I don't understand it right now
	* so this hack is all I have to get things to look right
	*/

		var $contentNode = $(contentNode);
		var iconCenter 	 = newIcon.container.getElementsByClassName( 'center' )[0];
		var container 	 = newIcon.container;
		var $editorNode	 = $('.icon-adder .CodeMirror');


		var contentWidth = $contentNode.width();
		// Handle weird sizing issues that I'm not sure where they come from
		if ( adder.typeSelected === true ) {
			contentWidth += 8
			container.style['marginLeft'] = '0';
		} else {
			container.style['marginLeft'] = '9px';
		}

		if (adder.result.type === 'message') {
			contentWidth -= 5;
		}

		$(iconCenter).width( contentWidth );

		var contentPosition = $editorNode.position();
		debugger;
		container.style.left = contentPosition.left + 'px';
		container.style.top = contentPosition.top + 'px';
		
		return newIcon;
	};  // End newIcon.setWidth;

	// =================
	// SVG ELEMENTS
	// =================
	newIcon.svgAttributes 	= 
		"xmlns='http://www.w3.org/2000/svg' " +
		"viewBox='0 0 100 100' preserveAspectRatio='none' ";


	 newIcon.addCenterShape = function ( centerNode, htmlStr ) {
	/* */

		var htmlStr = htmlStr ||
			"<svg width='100%' height='100%' " + newIcon.svgAttributes + ">"  +
				"<line x1='0' y1='0' x2='100%' y2='0'/>" +
				"<line x1='0' y1='100%' x2='100%' y2='100%'/>" +
			"</svg>";

		centerNode.innerHTML = htmlStr;

		return centerNode;
	};  // End newIcon.addCenterShape()


	newIcon.toDefaultShape = function( iconContainer ) {
	// Just the css border created by 'default' class name remains

		var leftNode 		= iconContainer.getElementsByClassName('left')[0];
		leftNode.innerHTML 	= '';

		var centerNode 		 = iconContainer.getElementsByClassName('center')[0];
		newIcon.addCenterShape( centerNode, '' );

		var rightNode 		= iconContainer.getElementsByClassName('right')[0];
		rightNode.innerHTML = '';

		return iconContainer;
	}

	newIcon.toVerbShape = function( iconContainer ) {
	/* 
	* 
	* Too much of a pita to build it piece by piece the DOM way atm
	* DOMParser() didn't work right, not properly assigning classes
	* to its first child, so trying this now
	*/
		var svgSideDimensions 	= "width='8px' height='100%' ",
			svgAttributes 		= newIcon.svgAttributes;

		// This would be awesome, but it looks weird at almost any value
		// and the top corners don't get rounded yet.
		// TODO: Make rounded corners
		var rounding 	= 0;

		var leftNode 	= iconContainer.getElementsByClassName('left')[0],
			leftPath 	= 'M 100 0 L0 50 L100 100',
			leftRounded = roundPathCorners( leftPath, rounding, false );

		var leftHTMLStr =
			'<svg ' + svgSideDimensions + svgAttributes + '> ' +
				//'m' xpos ypos, 'l' xdist ydist, ... 'z'
				"<path d='" + leftRounded + "' />" +
			"</svg>";
		leftNode.innerHTML = leftHTMLStr;


		var centerNode 	= iconContainer.getElementsByClassName('center')[0];
		newIcon.addCenterShape( centerNode );


		var rightNode 	 = iconContainer.getElementsByClassName('right')[0],
			rightPath 	 = 'M 0 0 L100 50 L0 100',
			rightRounded = roundPathCorners( rightPath, rounding, false );

		var rightHTMLStr =
			'<svg ' + svgSideDimensions + svgAttributes + '> ' +
				// 'm' xpos ypos, 'l' xdist ydist, ... 'z'
				"<path d='" + rightRounded + "' />" +
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


		var centerNode 	= iconContainer.getElementsByClassName('center')[0];
		newIcon.addCenterShape( centerNode );


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


		var centerNode 	= iconContainer.getElementsByClassName('center')[0];
		newIcon.addCenterShape( centerNode );


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
		'message': newIcon.toMessageShape,
		'default': newIcon.toDefaultShape
	};


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

		// Right side
		var rightSide 		= document.createElement( 'div' );
		container.appendChild( rightSide );
		rightSide.className = 'shape-part right';

		// newIcon.setSearchBar( searchBar );

		return container;
	};  // End newIcon.create()

	return newIcon;
};  // End AdderIcon {}

