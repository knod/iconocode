// icon-styles.js

'use strict'

// var iconStyleToggler;
// var iconSizeClass 		= 'large';

// window.addEventListener( 'load', function () {
// 	iconStyleToggler 	= document.getElementById('toggle-icon-size');
// 	$('.icon-container').addClass( iconSizeClass );

// 	iconStyleToggler.addEventListener( 'click', function () {

// 		$('.icon-container').removeClass( iconSizeClass );

// 		if ( iconSizeClass === 'small' ) {
// 			iconSizeClass = 'large';
// 			$('.CodeMirror .CodeMirror-lines').css( 'line-height', '1.3rem' );

// 		} else {
// 			iconSizeClass = 'small'
// 			$('.CodeMirror .CodeMirror-lines').css( 'line-height', '1.3em' );
// 		}

// 		$('.icon-container').addClass( iconSizeClass );
// 	} );

// });


window.addEventListener( 'load', function () {

	// Resize icons and lines based on slider value
	var iconSizeSlider = document.getElementById('icon_size_input');
	
	iconSizeSlider.addEventListener( 'input', function (evnt) {

		var iconSize 	= evnt.target.value;

		// Line is just a little bigger to give space around icons
		var lineHeight 	= (parseFloat(iconSize) - 0.2);
		// Don't let line get smaller than 1 rem
		if ( lineHeight < 1 ) ( lineHeight = 1 );

		$('.CodeMirror.test-editor .CodeMirror-lines').css( 'line-height', lineHeight + 'rem' );
		$('.icd.icon-container').css( 'height', iconSize + 'rem' );
		$('.icd.icon-container .icon-part').hide().show(0);

	});
});

