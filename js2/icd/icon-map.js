/* icon-map.js
* 
* 
* 
*/

'use strict'

// =====================
// TEST
// =====================
var IcdMap = function () {

	var icdMap = {}

	var iconTest1  	= new Icon( 'test2' );
	iconTest1.createNew( document.body );
	iconTest1.setType('verb', iconTest1.container );
	// Now we need a bunch of image nodes...
	// Also sets id, but that's unclear. ???: How to make id setting clear?
	var iconTestImages = document.getElementsByClassName('Icon-test');
	for ( var nodei = 0; nodei < iconTestImages.length; nodei++ ) {

		var fakeImgName = 'test-img' + nodei + '.png';
		$( iconTestImages[nodei] ).data('name', fakeImgName );

	}

	iconTest1.setImages( iconTestImages, iconTest1.body );

	iconTest1.save( icdMap );

	return icdMap;
};  // End IcdMap {}
