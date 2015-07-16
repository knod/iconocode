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


	newHotbar.update = function () {
	/* 
	* iconMap comes from when the thing is first created up top.
	*/
		console.log('--- update hotbar ---')
		var $hotbarList = $(newHotbar.list);

		$hotbarList.empty()

		for ( var varName in iconMap ) {
			if ( iconMap.hasOwnProperty( varName ) ) {

				var $clone = $(iconMap[ varName ].node).clone();
				console.log(varName ,':', clone);
			}
		}

	};  // End newHotbar.update()

	return newHotbar;
};  // End HotBar {}

// spaceview of pictures on phone when you point in the right direction

