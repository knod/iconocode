/* editor-icon-extras.js
* 
* Hotbar and stuff like that
*/

'use strict'

var HotBar = function ( iconMap, parentNode ) {
/*
* Eventually will create the element and add it to the container
* Currently used in iconocode.js
*/

	var newHotbar 	= {};
	var iconMap 	= iconMap;

	newHotbar.node 	= document.querySelector('.icon-hotbar');
	newHotbar.list	= document.querySelector('.icon-hotbar-icons');


	newHotbar.makeListItem = function ( contentsNode ) {
	/*
	* Make one list item node
	*/
		var listItem = document.createElement('li');
		listItem.appendChild( contentsNode );

		return contentsNode;
	};  // End newHotbar.makeListItem()


	newHotbar.update = function () {
	/* 
	* iconMap comes from when the thing is first created up top.
	*/
		console.log('--- update hotbar ---')
		var $hotbarList = $(newHotbar.list);

		$hotbarList.empty()

		for ( var varName in iconMap ) {
			if ( iconMap.hasOwnProperty( varName ) ) {

				var iconClone 		= $(iconMap[ varName ].container).clone()[0];
				console.log(iconClone)
				var listIcon	= newHotbar.makeListItem( iconClone );
				// $clone.appendTo( $hotbarList );
				newHotbar.list.appendChild( listIcon );


		console.log( newHotbar.list )
			}
		}

	};  // End newHotbar.update()

	return newHotbar;
};  // End HotBar {}

// spaceview of pictures on phone when you point in the right direction

