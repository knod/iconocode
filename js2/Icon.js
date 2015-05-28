/* Icon.js
Creating and editing an Icon object
*/

'use strict'

var prefix = 'icd';

var Icon = function ( varName ) {
/*

*/
	var newIcon = {};

	newIcon.node;
	newIcon.path;

	newIcon.width;
	newIcon.images;  // [] or {}? 
	// data-id?
	newIcon.id;  // made up of its image names perhaps? That way we can more easily tell if there's a repeat?
	newIcon.borderColor;
	newIcon.tags;  // data-tags? classes?
	newIcon.varName;  // Or just in tags? Or just varName? Or what?
	newIcon.type;  // Need to store this here or just in tags? Is everything tags?
	newIcon.borderShape;

	// Text - visibility: hidden, width = icon.width, setWidth

	// ======================
	// FUNCTIONS
	// ======================
	newIcon.setParent = function ( parent ) {
		parent.appendChild( newIcon.node );
	};  // End newIcon.setParent()

	newIcon.setType = function ( type ) {
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
		// newIcon.node.style.border = '1px solid gray';
		// var borderRadius = '0'

		// Change class of before and after body nodes
		var container = newIcon.node;

		container.classList.remove( 'verb' );
		container.classList.remove( 'data' );
		container.classList.remove( 'square' );
		container.classList.remove( 'message' );

		container.classList.add( type );

		// if ( type === 'data' ) {
		// 	// Makes sure border right and left look round
		// 	borderRadius = '50px';
		// } else if ( type === 'message' ) {
		// 	newIcon.node
		// }
		// // control
		// // logic? process?

		// newIcon.node.style.borderRadius = borderRadius;

	};  // End newIcon.setType()


	newIcon.setImages 	= function () {};  // End newIcon.setImages()


	newIcon.setID 		= function ( newID ) {
		var iconPath = newIcon.path;
		iconPath.setAttribute( 'id', newID );

		return newIcon.node;
	};  // End newIcon.setID()


	newIcon.saveIcon 	= function () {};  // End newIcon.saveIcon()


	newIcon.createSVG 	= function ( typeName, parentObj, parentNode ) {

		var NS 				= 'http://www.w3.org/2000/svg';  // Not sure what this is
		var svg 			= document.createElementNS( NS, 'svg');
		var propertyName 	= typeName + 'SVG';
		parentObj[ propertyName ] = svg;

		svg.setAttribute( 'width', '100%'); svg.setAttribute( 'height', '100%');

		parentNode.appendChild( svg );

		// svg's don't have classes :P
		// maybe check out http://toddmotto.com/hacking-svg-traversing-with-ease-addclass-removeclass-toggleclass-functions/

		var group 			= document.createElementNS( NS, 'g');
		svg.appendChild( group );

		var path 			= document.createElementNS( NS, 'path');
		// I don't think this is ideal. Not sure what to do about it yet though.
		newIcon.path 		= path;
		group.appendChild( path );

		path.setAttribute( 'stroke-width', '1' );
		path.setAttribute( 'stroke', '#000000' );
		path.setAttribute( 'fill', 'none' );
		// http://codepen.io/gionkunz/pen/KDvLj
		svg.setAttribute( 'vector-effect', 'non-scaling-stroke' );

		return svg;
	};  // End adder.createSVG()


	newIcon.createVerb 	= function ( parentObj, parentNode ) {

		var NS 			= 'http://www.w3.org/2000/svg';  // Not sure what this is
		var verbSVG 	= newIcon.createSVG( 'verb', parentObj, parentNode );
		parentNode.appendChild( verbSVG );

		var boundingBox = parentNode.getBoundingClientRect();
		var svgHeight 	= boundingBox.height;
		var svgWidth 	= boundingBox.width;
		// console.log(svgHeight)
		// debugger;

		var lineAngle 	= 35;

		var vertCenter 	= svgHeight/2;
		var angledLineLength = Math.cos( lineAngle ) * svgHeight;


		var verbPath 	= newIcon.path;
		var start 		= 'M 1 ' + vertCenter;
		var topLeft 	= ', l ' + lineAngle + ' ' + angledLineLength;

		verbPath.setAttribute( 'd', start + topLeft );


// var svg = '<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">' +
// 			'<g>' +
// 		  		'<path id="svg_9" d="m5 52, l35 -45, l120 0, l35 45, l-35 45, l-120 0, l-35 -45z"' +
// 		  		' stroke-width="5" stroke="#000000" fill="none"/>' +
// 		 	'</g>' +
// 		'</svg>';

	};


	newIcon.createNew 	= function ( parentObj, parentNode, id ) {
	/*

	Create the container and the three base elements for the icon
	*/
		var node	 	 = document.createElement( 'div' );
		parentNode.appendChild( node );
		newIcon.node = node;
		node.className 	 = prefix + ' icon-container';
		node.id 		 = prefix + ' icon-' + id;
		newIcon.id 		 = id;

		// Left side
		var hider1 		 = document.createElement( 'div' );
		hider1.className = prefix + ' icon-side-hider'

		var before 		 = document.createElement( 'div' );
		before.className = prefix + ' before-icon-body';

		hider1.appendChild(before);

		// Body
		var body 		 = document.createElement( 'div' );
		body.className 	 = prefix + ' icon-body';

		// Right side
		var hider2 		 = document.createElement( 'div' );
		hider2.className = prefix + ' icon-side-hider';

		var after 		 = document.createElement( 'div' );
		after.className  = prefix + ' after-icon-body';

		hider2.appendChild(after);


		node.appendChild( hider1 );
		node.appendChild( body );
		node.appendChild( hider2 );


// 		var node	 	 = document.createElement( 'div' );
// 		document.body.appendChild( node );
// 		node.className 	 = prefix + ' icon-container';

// var obj = {};
// newIcon.createVerb( obj, node );
// 		var svg = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
// 			'<g>' +
// 		  		'<path id="svg_9" d="m 5 52, l 35 -45, l 120 0, l 35 45, l -35 45, l -120 0, l -35 -45z"' +
// 		  		' stroke-width="5" stroke="#000000" fill="none"/>' +
// 		 	'</g>' +
// 		'</svg>';

		// node.innerHTML = svg;

		// document.body.appendChild( node );

	};  // End newIcon.create()

	// newIcon.createNew( 'x', {}, document.body );

	return newIcon;
};  // End Icon {}



// TESTING
var icon = new Icon();
icon.createNew( {}, document.body, 1 );
icon.setType( 'noun', icon.node );
