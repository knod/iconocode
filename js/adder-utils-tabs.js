/* adder-utils-tabs.js
*/

'use strict'

// --- Event for tabs --- \\
adder.activateMode 		= function ( selectedTab ) {
/*

Show a tab as being active, do it's action
*/
	// Set active
	adder.activeTab = selectedTab

	// Deactivate all
	var allTabs = selectedTab.parentNode.children;

	for ( var tabi = 0; tabi < allTabs.length; tabi++ ) {
		var currTab = allTabs[ tabi ]
		// Remove 'active' styles
		currTab.classList.remove( 'active' );

		// Hide associated elements
		// console.log(currTab.toShow)
		currTab.toShow.style.display = 'none';
		// console.log(currTab.dataset['toShow'])
		// currTab.dataset['toShow'].style.display = 'none';
		// var toShow = document.getElementById( currTab.dataset['toShow'] )
		// toShow.style.display = 'none';

	}  // end for each tab

	// Activate this tab
	selectedTab.classList.add( 'active' );

	// Reveal the element that's in the data-toShow
	selectedTab.toShow.style.display = 'flex';
	// var toShow = document.getElementById( selectedTab.dataset['toShow'] )
	// toShow.style.display = 'inline-block';

	return selectedTab;
};  // End adder.activateMode()


adder.tabClicked 		= function ( evnt ) {
/*

Handles tab clicking
*/
	var target 	= evnt.target
	// Only allow switching modes if a type has been selected
	if ( adder.typeSelected ) {
		adder.activateMode( target );
	}

	return evnt.target;
}  // End adder.tabClicked()


// --- Tabs themselves --- \\
adder.createTabInGroup 	= function ( group, tabType, tabText, toShow, parentObj ) {
/* ( str ) -> Node

Returns div with a 'tab' class, a 'adder-'group'-tab' class,
and an id ( the last based on the unique function of the tab).
The data value indicates what should be shown when the tab
is clicked.
*/
	var tab 		= document.createElement('div');
	parentObj.tab 	= tab;

	// Identification
	tab.id 			= prefix + '-' + tabType + '-tab';
	tab.className 	= prefix + ' tab adder-' + group + '-tab';

	// !!! Make this better !!!
	// Element that will be revealed
	// Can't store it in regular dataset as that just stores a string
	tab.toShow = toShow;
	// console.log(tab.toShow)
	// Seems weird to use jquery randomly in here all of a sudden
	// $(tab).data( 'toShow', toShow );
	// console.log( $(tab).data('toShow') )
	// 	tab.dataset[ 'toShow' ] = toShow;  // Doesn't work, stored as a string
	// // console.log(tab.dataset[ 'toShow' ])
	// tab.dataset['toShow'].style.display = 'none';
	// tab.dataset[ 'toShow' ] = prefix + '-' + tabType + '-picker';

	// Text in the tab
	var tabTextNode = document.createTextNode( tabText );
	tab.appendChild( tabTextNode );

	// Can't use adder.activateMode directly because an argument can't be passed here
	tab.addEventListener( 'click', adder.tabClicked );

	return tab;
};  // End adder.createTabInGroup()
