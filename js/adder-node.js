// adder-node.js

'use strict'

var adder = {};

adder.node 	 	= null;
adder.viewer 	= { section: null, textArea: null };  // images too? what other nodes?
adder.modeTabs 	= { section: null, types: null, images: null, colors: null };
adder.pickers 	= {
	section: null, 
	types: { div: null, verb: null, noun: null, message: null },
	images: { div: null, imageObjs: icdDefaultImages },
	colors: { 
		div: null, 
		tabs: { section: null, inDocument: null, custom: null },
		pickers: {
			inDocument: { section: null, choices: [] },
			custom: { section: null, choices: [] }
		}
	}  // end pickers.colors {}
};  // end adder.pickers {}

adder.typeSelected = false;

/*
This way instead? (This doesn't make as much sense to me, but
if I'm trying to organize the code, I think I should make all the
mode stuff together - tab and pickers and their functionality)

adder.modes = {};
adder.modes.types = { modeTab: null, picker: null };
adder.modes.images = { modeTab: null, picker: null };
adder.modes.colors = { modeTab: null, picker: null };

adder.sections = { viewer: null, modeTabs: null, pickers: null };

adder.viewerText = null;

adder.node = null;
*/

// ====================
// VIEWER
// ====================
adder.addIconViewer 	= function ( parent ) {
/*

Adds element that will show the icon as it's being built
??: Should I start out with the code editor being there?
I don't want the user to be able to edit in the code editor when
not in image editing mode.
https://codemirror.net/doc/manual.html (check out readOnly and nocursor
and cm.getWrapperElement() )
*/
	// Container is for having "section"?
	var viewerContainer 		= document.createElement('section');
	adder.viewer.section 		= viewerContainer;
	viewerContainer.className 	= prefix + ' adder-icon-viewer-container';

	var viewer 					= document.createElement('div');
	adder.viewer.textArea = viewer;
	viewer.className 			= prefix + ' adder-icon-viewer';
	var starterText 			= document.createTextNode('What does this variable do?');
	viewer.appendChild( starterText );

	viewerContainer.appendChild( viewer );
	parent.appendChild( viewerContainer );

	return viewer;
};  // End adder.addIconViewer()


// // ====================
// // MODE TABS
// // ====================
// // --- Event for tabs --- \\
// adder.activateTab = function ( selectedTab ) {
// /*

// Show a tab as being active, do it's action
// */
// 		console.log('--------------')
// 	// Deactivate all
// 	var allTabs = selectedTab.parentNode.children;

// 	for ( var tabi = 0; tabi < allTabs.length; tabi++ ) {
// 		var currTab = allTabs[ tabi ]
// 		// Remove 'active' styles
// 		currTab.classList.remove( 'active' );

// 		// Hide associated elements
// 		var toShow = document.getElementById( currTab.dataset['toShow'] )
// 		toShow.style.display = 'none';
// 	console.log(document.getElementById( currTab.dataset['toShow'] ))

// 	}  // end for each tab

// 	// Activate this tab
// 	selectedTab.classList.add( 'active' );

// 	// Reveal the element that's in the data-toShow
// 	var toShow = document.getElementById( selectedTab.dataset['toShow'] )
// 	console.log(document.getElementById( selectedTab.dataset['toShow'] ))
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
// adder.addTabInGroup = function ( group, tabType ) {
// /* ( str ) -> Node

// Returns div with a 'tab' class, a 'adder-'group'-tab' class,
// and an id ( the last based on the unique function of the tab).
// The data value indicates what should be shown when the tab
// is clicked.
// */
// 	var tab 		= document.createElement('div');
// 	tab.id 			= prefix + '-' + tabType + '-tab';
// 	tab.className 	= prefix + ' tab adder-' + group + '-tab';

// 	// Can't use adder.activateTab because an argument can't be passed here
// 	tab.addEventListener( 'click', adder.tabClicked );

// 	return tab;
// };  // End adder.addTabInGroup()


// adder.addModeTabs 		= function ( parent ) {
// /*

// Adds tabs that will allow the selection of what to edit
// */
// 	var tabContainer 		= document.createElement('section');
// 	adder.modeTabs.section 	= tabContainer;
// 	parent.appendChild( tabContainer );

// 	tabContainer.className 	= prefix + ' adder-mode-tabs tabs';

// 	// --- Types Tab --- \\
// 	var typeTab 		 = adder.addTabInGroup( 'mode', 'types' );
// 	adder.modeTabs.types = typeTab;
// 	tabContainer.appendChild( typeTab );

// 	typeTab.dataset[ 'toShow' ] = prefix + '-types-picker';
// 	var typeText 		 = document.createTextNode('Variable Type');
// 	typeTab.appendChild( typeText );

// 	// --- Image Tab --- \\
// 	var imgTab 			  = adder.addTabInGroup( 'mode', 'images' );
// 	adder.modeTabs.images = imgTab;
// 	tabContainer.appendChild( imgTab );

// 	imgTab.dataset[ 'toShow' ] = prefix + '-images-picker';
// 	var imgText 		  = document.createTextNode('Images');
// 	imgTab.appendChild( imgText );

// 	// --- Color Tab --- \\
// 	var colorTab 		  = adder.addTabInGroup( 'mode', 'colors' );
// 	adder.modeTabs.colors = colorTab;
// 	tabContainer.appendChild( colorTab );

// 	colorTab.dataset[ 'toShow' ] = prefix + '-colors-picker';
// 	var colorText 		  = document.createTextNode('Color');
// 	colorTab.appendChild( colorText );

// 	// Now that they're all in DOM, fetch them easily to do stuff to them
// 	var allModeTabs 	= document.getElementsByClassName( 'adder-mode-tab' );
// 	var numTabs 		= allModeTabs.length;

// 	// --- Last Styling --- \\
// 	var lastTab 		= allModeTabs[ (numTabs - 1) ];
// 	lastTab.className 	= lastTab.className + ' last-tab';

// 	// --- Sizing --- \\
// 	var tabWidth = 100/numTabs
// 	for ( var tabi = 0; tabi < numTabs; tabi++ ) {
// 		allModeTabs[ tabi ].style.width = tabWidth + '%';
// 	}

// 	return parent;
// };  // End adder.addModeTabs()


// ==================
// Pickers
// ==================
adder.createPicker 		= function ( pickerType ) {
/* ( str ) -> Node

Creates and reterns a generic Picker node...?
*/
	var picker 		 = document.createElement('div');
	picker.id 		 = prefix + '-' + pickerType + '-picker';
	picker.className = prefix + ' adder-picker';

	// Hide all pickers on start
	picker.style.display = 'none';

	return picker;
};  // End adder.createPicker()


adder.onChoiceClick 	= function (evnt) {

	var target = evnt.target;

};  // End adder.onChoiceClick()

adder.addType 			= function ( typeName, parent, toAdd ) {
/* ( str, Node, Node ) -> new Node

*/
	var typeContainer 				= document.createElement('div');
	parent.appendChild( typeContainer );
	adder.pickers.types[ typeName ] = typeContainer;

	typeContainer.className 		= prefix + ' type-choice';
	typeContainer.id 				= prefix + ' choice-' + typeName;
	typeContainer.dataset['toAdd'] 	= 'icon-' + toAdd;

	// The label for the thing
	var typeText 					= document.createTextNode( typeName );
	typeContainer.appendChild( typeText );

	return typeContainer;
}  // End adder.addType()


adder.addTypePicker 	= function ( parent ) {
/*

Offers a selection of types for new icons
*/
	// --- PICKER --- \\
	var typePicker 			= adder.createPicker( 'types' );
	adder.pickers.types.div = typePicker;
	parent.appendChild( typePicker );

	// Temporary so other functionality is testable
	typePicker.addEventListener( 'click', function () {adder.typeSelected = true;} );

	var iconSuffix 			= '-adder-choice';

	// --- Verb --- \\
	var verbType 			 = adder.addType( 'verb', typePicker, ('verb' + iconSuffix) )
	var verbIcon 			 = Icon('someVar')
	verbIcon.createNew( adder.pickers.types, verbType, ('verb' + iconSuffix) );
	verbIcon.setType( 'verb', verbIcon.node );

	// --- Noun --- \\
	var nounType 			 = adder.addType( 'noun', typePicker, ('noun' + iconSuffix) )
	var nounIcon 			 = Icon('someVar')
	nounIcon.createNew( adder.pickers.types, nounType, ('noun' + iconSuffix) );
	nounIcon.setType( 'noun', nounIcon.node );

	// --- Message --- \\
	var messageType 		 = adder.addType( 'message', typePicker, ('message' + iconSuffix) )
	var messageIcon 		 = Icon('someVar')
	messageIcon.createNew( adder.pickers.types, messageType, ('message' + iconSuffix) );
	messageIcon.setType( 'message', messageIcon.node );


	// Now that they're all in DOM, fetch them easily to do stuff to them
	var allPickers	 	= document.getElementsByClassName( 'type-choice' );
	var numPickers 		= allPickers.length;

	// --- Last Styling --- \\
	var lastPicker 		= allPickers[ (numPickers - 1) ];
	lastPicker.className 	= lastPicker.className + ' last-tab';

	// --- Sizing --- \\
	var pickerWidth 	= 100/numPickers
	for ( var pickeri = 0; pickeri < numPickers; pickeri++ ) {
		allPickers[ pickeri ].style.width = pickerWidth + '%';
	}

	// --- VIEWER --- \\
	// Add hidden icon to viewer. It's type will change.
	// Maybe show a square shaped one for 'unspecified'

	return typePicker;
};  // End adder.addTypePicker()


adder.addImagePicker 	= function ( parent ) {

	var imgPicker 				 = adder.createPicker( 'images' );
	adder.pickers.images.section = imgPicker;
	parent.appendChild( imgPicker );

	return imgPicker;
};  // End adder.addImagePicker()


adder.addColorPicker 	= function ( parent ) {

	var colorPicker 	 		 = adder.createPicker( 'colors' );
	adder.pickers.colors.section = colorPicker;
	parent.appendChild( colorPicker );

	return colorPicker;
};  // End adder.addColorPicker()


adder.addPickers 		= function ( parent ) {

	var picker 				= document.createElement( 'section' );
	parent.appendChild( picker );
	adder.pickers.section 	= picker;

	picker.className 		= prefix + ' adder-pickers-container';

	// --- Individual Pickers --- \\
	adder.addTypePicker( picker );
	adder.addImagePicker( picker );
	adder.addColorPicker( picker );

	return picker;
};  // End adder.addPickers()


adder.addSearcher 		= function () {};  // End adder.addSearcher()


adder.addAdder 			= function () {
/*

The elements that have to do with the adder. Starts out hidden.
*/

	var adderNode 		= document.createElement('div');
	adder.node = adderNode;
	adderNode.className = prefix + ' icon-adder';

	document.body.appendChild( adderNode );

	// adder.addModeTabs( adderNode );
	// adder.addIconViewer( adderNode );
	// adder.addPickers( adderNode );

	// Hide adder until needed
	// adder.node.style.display = 'none';

	return adderNode;
};  // End adder.addAdder()

adder.addAdder();


adder.showAdder 		= function () {
/*

Right now, no previous state is saved. Should probably add that.
Whenever adder is shown again, it starts the process of making
a creating a new icon.
*/
	// Prevent moving on to other tabs till type is selected
	adder.typeSelected = false;
	// Testing
	// adder.typeSelected = true;

	// Make adder visible
	// adder.node.style.display = 'auto';

	// Make "Type" tab active
	adder.activateTab( adder.modeTabs.types );

	return adder.node;
};  // End adder.showAdder()

// document.addEventListener( 'keypress', adder.showAdder );  // End show adder event listener




adder.afterTypeIsSelected = function () {
/*

Placeholder for now, but this needs to happen at some point
http://stackoverflow.com/questions/13026285/codemirror-for-just-one-line-textfield
*/

	var cmEditor = CodeMirror(parent,
		{
		  value: 		"What does this variable do?",
		  theme:  		"monokai",
		  lineNumbers: 	false
		}
	);

	cmEditor.setSize(200, cmEditor.defaultTextHeight() + 2 * 4);
	// 200 is the preferable width of text field in pixels,
	// 4 is default CM padding (which depends on the theme you're using)

	// now disallow adding newlines in the following simple way
	cmEditor.on("beforeChange", function(instance, change) {
	    var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
	    change.update(change.from, change.to, [newtext]);
	    return true;
	});

	// and then hide ugly horizontal scrollbar
	cmEditor.on("change", function(instance, change) {
	    $(".CodeMirror-hscrollbar").css('display', 'none');
	    // (!) this code is using jQuery and the selector is quite imperfect if
	    // you're using more than one CodeMirror on your page. you're free to
	    // change it appealing to your page structure.
	});

	// the following line fixes a bug I've encountered in CodeMirror 3.1
	$(".CodeMirror-scroll").css('overflow', 'hidden');
	// jQuery again! be careful with selector or move this to .css file

};  // End adder.afterTypeIsSelected()


