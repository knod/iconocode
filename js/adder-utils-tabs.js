/* adder-utils-tabs.js
*/

'use strict'

// --- Event for tabs --- \\
adder.activateMode 		= function ( selectedTab ) {
/*

Show a tab as being active, do it's action
*/
	// Stop if user clicks on the currently active tab
	if ( selectedTab === adder.activeTab ) { return; }

	// =================
	// DEACTIVATE CURRENT (TODO: but only in same tab level)
	// =================
	// Focus on the search bar (TODO: focusing on the searchbar should unselect any selections)
	adder.viewer.focus()
	// Unselect anything that's currently selected
	$('.selected').removeClass('selected');

	var $activeTab = $('.active-tab');
	// First time around, there is nothing with .active-tab. Maybe change that?
	if ( $activeTab[0] !== undefined ) {
		// Hide associated element
		$($activeTab.data('toShow')).hide();
		// Remove styling
		$activeTab.removeClass('active-tab');
	}

	// ==================
	// ACTIVATE NEW
	// ==================
	$(selectedTab).addClass( 'active-tab' );
	// Reveal the related element
	$(selectedTab).data('toShow').style.display = 'initial';

	// Set active
	adder.activeTab = selectedTab
	adder.activeMode = $(selectedTab).data('mode');


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
adder.createTabInGroup 	= function ( group, modeName, tabLabel, toShow, parentObj ) {
/* ( str ) -> Node

Returns div with a 'tab' class, a 'adder-'group'-tab' class,
and an id ( the last based on the unique function of the tab).
The data value indicates what should be shown when the tab
is clicked.
*/
	var tab 		= document.createElement('div');
	parentObj.tab 	= tab;

	// Identification
	tab.id 			= prefix + '_' + modeName + '_tab';
	tab.className 	= prefix + ' tab adder-' + group + '-tab';

	// !!! Make this better !!!
	// Element that will be revealed
	// Can't store it in regular dataset as that just stores a string
	$(tab).data('toShow', toShow);
	$(tab).data('mode', modeName );

	// Text in the tab
	var tabLabelNode = document.createTextNode( tabLabel );
	tab.appendChild( tabLabelNode );

	// Can't use adder.activateMode directly because an argument can't be passed here
	tab.addEventListener( 'click', adder.tabClicked );

	return tab;
};  // End adder.createTabInGroup()
