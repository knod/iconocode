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

var iconSize = 1;
var centerVertically = function () {

	// Line is just a little bigger to give space around icons
	// var lineHeight 	= (parseFloat(iconSize) + lineDiff);
	var lineHeight 	= ( parseFloat(iconSize) * 1.175 );
	// Don't let line get smaller than 1 rem
	if ( lineHeight < 1 ) { lineHeight = 1 };

	// var lineDiff 	= lineHeight - iconSize;

	// --- VERTICALLY CENTER --- \\
	var elem 	 = $('.CodeMirror.test-editor .CodeMirror-lines')[0];
	var style 	 = window.getComputedStyle( elem, null ).getPropertyValue('font-size');
	var fontSize = parseFloat(style);

	// devisor arrived at by the left hand side divided by the margin-bottom value
	// gotten from manually centering stuff for both line height 2.35 and line-height 1.175
	// They're not the same, so then getting the average of those calculations
	// 1 should = 1, 2 should = 2.35
	// In Math: 
	// larger 	= ((2.35 * 13) - (13/2))/0.65
	// smaller 	= ((1.175 * 13) - (13/2))/0.25
	// average 	= (larger + smaller)/2
	var divisor = 36.05;
	var baselineChange = -1 * ( ((lineHeight * fontSize) - (fontSize/2)) / divisor )

	// --- EDITOR --- \\
	$('.CodeMirror.test-editor .CodeMirror-lines').css( 'line-height', lineHeight + 'rem' );

	$('.CodeMirror.test-editor .icd.icon-container').css( 'height', iconSize + 'rem' );
	$('.CodeMirror.test-editor .icd.icon-container').css( 'margin-bottom', baselineChange + 'rem' );

	// --- HOTBAR --- \\
	$('.icon-hotbar li').css( 'height', lineHeight + 'rem' );

	$('.icon-hotbar .icd.icon-container').css( 'height', iconSize + 'rem' );
	$('.icon-hotbar .icd.icon-container').css( 'margin-bottom', baselineChange + 'rem' );

	// --- ALL (doesn't take affect unless I do this) --- \\
	$('.icd.icon-container .icon-part').hide().show(0);

};  // End centerVertically()


window.addEventListener( 'load', function () {

	// Resize icons and lines based on slider value
	var iconSizeSlider = document.getElementById('icon_size_input');
	
	iconSizeSlider.addEventListener( 'input', function (evnt) {

		iconSize = evnt.target.value;
		$('#icon_size_output').val( iconSize + 'rem' );

		centerVertically();

	});
});

