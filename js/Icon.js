/* Icon.js
Creating and editing an Icon object
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
	// data-id?
	// made up of its image names perhaps? That way we can more easily tell if there's a repeat?
	newIcon.id;
	newIcon.tags;  // data-tags? classes?

	newIcon.path;  // svg path?
	newIcon.width;
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


	newIcon.setImages 	= function ( imgNodes, parentNode ) {

		// How to construct this? Use a 'name' data property in image's node
		var imgNamesStr = '';
		// Always a good idea to use length with node list loops
		var numNodes 	= imgNodes.length;
		for ( var nodei = 0; nodei < numNodes; nodei++ ) {
			var $imgNode = $(imgNodes[nodei]);

			$imgNode.clone().appendTo( $(parentNode) );
			imgNamesStr += $imgNode.data('name');
		}

		newIcon.id 		= imgNamesStr;

		return parentNode;
	};  // End newIcon.setImages()


	// newIcon.setId 		= function ( newID ) {
	// 	var iconPath = newIcon.path;
	// 	iconPath.setAttribute( 'id', newID );

	// 	return newIcon.container;
	// };  // End newIcon.setId()


	newIcon.save 	= function ( parentObj ) {
		parentObj[ newIcon.varName ] = newIcon;
	};  // End newIcon.save()


	newIcon.createSVG 	= function ( typeName, parentNode ) {
	/* ???: Should we even use an svg */

		var NS 				= 'http://www.w3.org/2000/svg';  // Not sure what this is
		var svg 			= document.createElementNS( NS, 'svg');
		var propertyName 	= typeName + 'SVG';
		newIcon.path 		= svg;

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


	newIcon.createVerb 	= function ( parentNode ) {

		var NS 			= 'http://www.w3.org/2000/svg';  // Not sure what this is
		var verbSVG 	= newIcon.createSVG( 'verb', parentNode );
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

// 		var svg = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
// 			'<g>' +
// 		  		'<path id="svg_9" d="m 5 52, l 35 -45, l 120 0, l 35 45, l -35 45, l -120 0, l -35 -45z"' +
// 		  		' stroke-width="5" stroke="#000000" fill="none"/>' +
// 		 	'</g>' +
// 		'</svg>';

		// container.innerHTML = svg;

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

		return container;
	};  // End newIcon.create()

	return newIcon;
};  // End Icon {}



// TESTING
var icon = new Icon( 'test1' );
icon.createNew( document.body );
icon.setType( 'noun', icon.body );
