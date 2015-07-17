/* editor-icon-extras.js
* 
* Hotbar and stuff like that
*/

'use strict'

var HotBar = function ( iconMap, editorInstance, parentNode ) {
/*
* Eventually will create the element and add it to the container
* Currently used in iconocode.js
*/

	var newHotbar 	= {};
	var iconMap 	= iconMap;

	newHotbar.node 		= document.querySelector('.icon-hotbar');
	newHotbar.list		= document.querySelector('.icon-hotbar-icons');
	newHotbar.editor 	= editorInstance;


	newHotbar.addIconToEditor 	= function ( iconObj, editorInstance ) {

		editorInstance.focus();
		editorInstance.replaceSelection( iconObj.varName );

		// editorInstance.getCursor();


	};  // End newHotbar.addIconToEditor()


	// newHotbar.clickHandler 		= function () {};  // End newHotbar.clickHandler()


	newHotbar.makeListItem = function ( contentsNode, iconObj ) {
	/*
	* Make one list item node
	*/
		var listItem = document.createElement('li');
		listItem.appendChild( contentsNode );

		// $(listItem).data( 'iconObj', iconObj );
		listItem.addEventListener( 'click', function () {

			newHotbar.addIconToEditor( iconObj, newHotbar.editor );

		} );

		return listItem;
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

				var iconObj = iconMap[ varName ];

				var iconClone 		= $(iconObj.container).clone()[0];
				var listIcon	= newHotbar.makeListItem( iconClone, iconObj );
				// $clone.appendTo( $hotbarList );
				newHotbar.list.appendChild( listIcon );

			}
		}

	};  // End newHotbar.update()

	return newHotbar;
};  // End HotBar {}

// spaceview of pictures on phone when you point in the right direction

