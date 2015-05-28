/* adder-mode-tabs.js
*/

'use strict'

adder.modeTabs 	= { section: null, types: null, images: null, colors: null };

// // --- Event for tabs --- \\
// adder.activateTab = function ( selectedTab ) {
// /*

// Show a tab as being active, do it's action
// */

// 	// Deactivate all
// 	var allTabs = selectedTab.parentNode.children;

// 	for ( var tabi = 0; tabi < allTabs.length; tabi++ ) {
// 		var currTab = allTabs[ tabi ]
// 		// Remove 'active' styles
// 		currTab.classList.remove( 'active' );

// 		// Hide associated elements
// 		var toShow = document.getElementById( currTab.dataset['toShow'] )
// 		toShow.style.display = 'none';

// 	}  // end for each tab

// 	// Activate this tab
// 	selectedTab.classList.add( 'active' );

// 	// Reveal the element that's in the data-toShow
// 	var toShow = document.getElementById( selectedTab.dataset['toShow'] )
// 	toShow.style.display = 'inline-block';

// 	return selectedTab;
// };  // End adder.activateTab()


// adder.tabClicked 		= function ( evnt ) {
// /*

// Handles tab clicking
// */

// 	var target 	= evnt.target

// 	adder.activateTab( target );

// 	return evnt.target;
// }  // End adder.tabClicked()


// // --- Tabs themselves --- \\
// adder.createTabInGroup = function ( group, tabType, tabText ) {
// /* ( str ) -> Node

// Returns div with a 'tab' class, a 'adder-'group'-tab' class,
// and an id ( the last based on the unique function of the tab).
// The data value indicates what should be shown when the tab
// is clicked.
// */
// 	var tab 		= document.createElement('div');
// 	adder.modeTabs[tabType] = tab;

// 	// Identification
// 	tab.id 			= prefix + '-' + tabType + '-tab';
// 	tab.className 	= prefix + ' tab adder-' + group + '-tab';

// 	// id of element that will be revealed
// 	tab.dataset[ 'toShow' ] = prefix + '-' + tabType + '-picker';

// 	// Text in the tab
// 	var tabTextNode = document.createTextNode( tabText );
// 	tab.appendChild( tabTextNode );

// 	// Can't use adder.activateTab directly because an argument can't be passed here
// 	tab.addEventListener( 'click', adder.tabClicked );

// 	return tab;
// };  // End adder.createTabInGroup()


adder.addModeTabs 		= function ( parent ) {
/*

Adds tabs that will allow the selection of what to edit
*/
	var tabContainer 		= document.createElement('section');
	adder.modeTabs.section 	= tabContainer;
	parent.appendChild( tabContainer );

	tabContainer.className 	= prefix + ' adder-mode-tabs tabs';

	// --- Types Tab --- \\
	var typeTab 		 = adder.createTabInGroup( 'mode', 'types', 'Variable Type' );
	// adder.modeTabs.types = typeTab;
	tabContainer.appendChild( typeTab );

	// --- Image Tab --- \\
	var imgTab 			  = adder.createTabInGroup( 'mode', 'images', 'Images' );
	// adder.modeTabs.images = imgTab;
	tabContainer.appendChild( imgTab );

	// --- Color Tab --- \\
	var colorTab 		  = adder.createTabInGroup( 'mode', 'colors', 'Color' );
	// adder.modeTabs.colors = colorTab;
	tabContainer.appendChild( colorTab );

	// Now that they're all in DOM, fetch them easily to do stuff to them
	var allModeTabs 	= document.getElementsByClassName( 'adder-mode-tab' );
	var numTabs 		= allModeTabs.length;

	// --- Last Styling --- \\
	var lastTab 		= allModeTabs[ (numTabs - 1) ];
	lastTab.className 	= lastTab.className + ' last';

	// --- Sizing --- \\
	var tabWidth = 100/numTabs
	for ( var tabi = 0; tabi < numTabs; tabi++ ) {
		allModeTabs[ tabi ].style.width = tabWidth + '%';
	}

	return parent;
};  // End adder.addModeTabs()

adder.addModeTabs( adder.node );
adder.addIconViewer( adder.node );
adder.addPickers( adder.node );

// Testing
adder.showAdder();
