/* editor-icon-extras.js
* 
* Hotbar and stuff like that
*/

'use strict'

var HotBar = function ( editorInstance, iconMap, parentNode ) {
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
		editorInstance.replaceSelection( ' ' );

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
	/* ( none ) -> None
	* 
	* Uses iconMap to rebuild contents of hotbar
	* iconMap comes from when the hotbar is first created up top.
	*/
		var $hotbarList = $(newHotbar.list);

		$hotbarList.empty()

		for ( var varName in iconMap ) {
			if ( iconMap.hasOwnProperty( varName ) ) {

				var iconObj = iconMap[ varName ];

				var iconClone 	= $(iconObj.container).clone()[0];
				var listIcon	= newHotbar.makeListItem( iconClone, iconObj );
				// $clone.appendTo( $hotbarList );
				newHotbar.list.appendChild( listIcon );

			}
		}

	};  // End newHotbar.update()

	return newHotbar;
};  // End HotBar {}


var Extras = function ( edInstance, iconMap ) {

	var extras 		= {};
	extras.editor 	= edInstance;
	extras.iconMap 	= iconMap;

	// ============================
	// SHOW AND HIDE ICONS
	// ============================
	var iconToggler  = document.querySelector('.icon-toggle');
	extras.toggler 	 = iconToggler;
	var iconsShowing = true;

	iconToggler.addEventListener( 'click', function ( evnt ) {

		if ( iconsShowing === true ) {
			icd.updater.removeAllMarks( extras.editor );
		} else {
			icd.updater.markAll( edInstance, iconMap );
		}

		iconsShowing = !iconsShowing

	} );

	return extras;
};  // End Extras {}

// spaceview of pictures on phone when you point in the right direction

