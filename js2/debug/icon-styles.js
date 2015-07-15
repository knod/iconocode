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
		$('#icon_size_output').val( iconSize + 'rem' );
		// Line is just a little bigger to give space around icons
		// var lineHeight 	= (parseFloat(iconSize) + lineDiff);
		var lineHeight 	= ( parseFloat(iconSize) * 1.175 );
		// Don't let line get smaller than 1 rem
		if ( lineHeight < 1 ) { lineHeight = 1 };

		// var lineDiff 	= lineHeight - iconSize;

		// This assumes a font size of 16
		var fontSize = $('.CodeMirror.test-editor .CodeMirror-lines').css('fontSize');
		console.log(fontSize)
		// devisor = 44.35 arrived at by the left hand side divided by the margin-bottom value gotten from
		// manually centering stuff for both line height 2.35 and line-height 1.175
		// They're not the same, so then getting the difference of those calculations and dividing by 2
		// then adding that to the smaller result (the one for 1.175)
		// In Math: 
		// larger 	= ((2.35 * 16) - (16/2))/0.65
		// smaller 	= ((1.175 * 16) - (16/2))/0.25
		// average 	= (larger + smaller)/2
		var divisor = 44.37
		var baselineChange = -1 * ( ((lineHeight * 16) - (16/2)) / divisor )

		console.log( iconSize * 1.175)

		// 1 should = 1, 2 should = 2.35
		$('.CodeMirror.test-editor .CodeMirror-lines').css( 'line-height', lineHeight + 'rem' );

		$('.CodeMirror.test-editor .icd.icon-container').css( 'height', iconSize + 'rem' );
		$('.CodeMirror.test-editor .icd.icon-container').css( 'margin-bottom', baselineChange + 'rem' );

		$('.icd.icon-container .icon-part').hide().show(0);


// Answer's description from http://stackoverflow.com/questions/12950479/why-does-inline-block-element-having-content-not-vertically-aligned
// overflow = inherit
// With margin-top removed
// 2.35, 2, margin-bottom = 0.65
// 1.175, 1, margin-bottom = 0.25
	});
});

