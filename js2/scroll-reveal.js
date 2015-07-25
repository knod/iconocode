/* scroll-reveal.js
* 
* Reveals adder choices on scroll
*/

'use strict'

// e.originalEvent.wheelDeltaX

var ScrollReveal = function ( scrollableNode ) {

	/*
	In js, set the heights of all the choices. Use that value
	to calculate the height the picker would be if it had every
	element in it.

	If the row is 0, you can't scroll up.
	Not sure what to do about down. Check for the last object?

	Load up 5 rows (or whatever)
	When the user scrolls
		If the second-from-top row's screen position goes above the container,
			Remove the top row
			Use the data value row number of the bottom row to add another row
			to the bottom (maybe here is where to check for hitting bottom)
		If the second from bottom row goes below the bottom of the container...

	Somewhere:
		If search is changed, scroll back to top or something
	*/


	// $(scrollableNode).scroll( function ( evnt ) {
	// 	console.log(evnt)
	// 	console.log(evnt.originalEvent.wheelDeltay);
	// });

	// scrollableNode.onscroll = function ( evnt ) {
	// 	console.log(evnt)
	// 	console.log(evnt.originalEvent.wheelDeltay);
	// };

	// $(scrollableNode).bind('mousewheel DOMMouseScroll', function( evnt ){
	// 	console.log('delta:', evnt.originalEvent.wheelDelta);
	// 	console.log('detail:', evnt.originalEvent.detail);
	//     if (evnt.originalEvent.wheelDelta > 0 || evnt.originalEvent.detail < 0) {
	//         // scroll up
	//     }
	//     else {
	//         // scroll down
	//     }
	// });

	var accY = 0;

	scrollableNode.addEventListener('wheel', function ( evnt ) {
		// console.log(evnt)
		// console.log(evnt.deltaY);

		var deltaY = evnt.deltaY;
		accY += deltaY;
		console.log(accY)

		if ( (accY % 30) === 0 ) {
			// var hr = document.createElement('hr');
			// hr.style.position = 'absolute';
			// hr.style.top = accY + 'px';
			// hr.style.left = '0';
			// hr.style.color = 'lightgray';
			// hr.style.width = '100%';

			// scrollableNode.appendChild( hr );
		}

	});

};  // End ScrollReveal
