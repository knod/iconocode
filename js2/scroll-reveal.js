/* scroll-reveal.js
* 
* Reveals adder choices on scroll
* http://codepen.io/knod/pen/KprvMj?editors=011
* 
* Main logic:
* - Whenever neccessary, find what the top visible row should be.
* - Use that to figure out what rows need to exist.
* - Remove any excess rows and add in any rows that aren't there.
* 
* Resources:
* - (no longer used, good to know anyway)
* 	http://stackoverflow.com/questions/4793604/how-to-do-insert-after-in-javascript-without-using-a-library
* 	(insertBefore handles null by adding to the end of the list)
*/

'use strict'


var ScrollManager = function () {




	
};  // End ScrollManager {}


var ScrollRevealerTest = function ( scrollableNode ) {

	/* 
	* Sometimes, if you move your mouse off while the thing's
	*  still scrolling, blank spaces will stay blank. Not
	* sure how to fix that. Maybe run the function again when
	* scrolling stops? Or when mouse leaves the container?
	*/

	// Also, I think the elements aren't spaced evenly :/ (visual illusion?)
	// ??: Why is there only easing when scrolling isn't done
	// while mouse is over the elements inside the sizer (unless
	// going really fast, in which case there is easing)?
	var scroller = {};

	scroller.container = scrollableNode;
	var container_ = scroller.container;
	scroller.sizer    = document.querySelector('.sizer');
	var sizer_ = scroller.sizer;

	var rowHeight = 40, rowVertMargin = 4;
	var NUM_TOTAL_ROWS = 2000;
	sizer_.style.height  = (NUM_TOTAL_ROWS * (rowHeight + rowVertMargin) + rowVertMargin) + 'px';

	// Includes buffer rows
	var NUM_EXISTING_ROWS = 10;


	// ========================
	// GENERATING CONTENT
	// ========================
	// Should be in Grid
	var colorByNum = function ( num ) {
	/* Make gradations of color based on row position
	(so we can tell we're scrolling) */
	  num = num % Math.ceil(255/35);
	  num = 35 * num;
	  return 'rgb( 0,' + num + ',' + num + ')';
	};  // End colorByNum()


	// Should be in Grid
	var makeRow = function ( rowNum ) {
	  var row = document.createElement('div');
	  row.id = 'row_' + rowNum;
	  row.className = 'row';
	  row.dataset['row'] = rowNum;
	  row.style['backgroundColor'] = colorByNum( rowNum );
	  // Height 40, 44 and 4 to add margins
	  var pos = (rowNum * (rowHeight + rowVertMargin)) + rowVertMargin;
	  row.style.top = pos + 'px';

	  return row;
	};  // End makeRow()


	// ========================
	// SCROLL LOGIC
	// ========================
	scroller.getTopRowNum = function ( rowNum ) {
	/* ( int ) -> int
	* 
	* Figure out which row number is actual top of the current set of rows,
	* including the buffer rows
	* rowNum indicates, I think, the first visible row from the top.
	*/
	  // Get the row above the top visible row, our actual top row
	  // -2 is number of visible rows.
	  // TODO: calculate number of visible rows
	  // Buffer on both the top and the bottom
	  // Stops disappearing on top, but causes jerky movement when going up as well as when going down
	  // Also, with smaller existing row numbers, sometimes not all neccessary elements are drawn. ??: Why?
	  var topRowNum = Math.ceil(rowNum - ((NUM_EXISTING_ROWS/2) - 2));
	  // Don't go below 0
	  topRowNum = Math.max( 0, topRowNum );
	  // or above the max possible indexed top row
	  // Both of these are non-0-indexed, so no -1's needed?
	  var maxTopRow = NUM_TOTAL_ROWS - NUM_EXISTING_ROWS;
	  topRowNum = Math.min( maxTopRow, topRowNum );
	  
	  return topRowNum;
	};  // End scroller.getTopRowNum()


	scroller.getNewRowNums = function ( topRowNum ) {
	/* ( int ) -> [ints]
	*/
	  var rowNums = [];
	  var currentRowNum = topRowNum;
	  // Here we don't use rowCount for anything other than making sure we don't loop too much
	  for ( var rowCount = 0; rowCount < NUM_EXISTING_ROWS; rowCount++ ) {
	    rowNums.push( currentRowNum );
	    currentRowNum += 1;
	  }

	  return rowNums;
	};  // End scroller.getNewRowNums()

	scroller.getCurrentRowNums = function ( rowNodes ) {
	/* ( [Nodes] ) -> [ints]
	Cycle through and get all the number values of the current rows */
	  var numRows = rowNodes.length;
	  var rowNums = [];
	  for ( var rowi = 0; rowi < numRows; rowi++ ) {
	    var rowNode = rowNodes[rowi];
	    rowNums.push( parseInt( rowNode.dataset['row'] ) );
	  }
	  
	  return rowNums;
	};  // End scroller.getCurrentRowNums()


	scroller.removeExcessRows = function ( currRowNums, newRowNums, parentNode ) {
	/* ( [ints], [ints], [Nodes] ) -> same Node
	* Doesn't really need to return anything? It just changes the DOM.
	*/
	  var toRemove = [];
	  for ( var rowi = 0; rowi < currRowNums.length; rowi++ ) {
	    var rowNum = currRowNums[ rowi ];
	    // If that row number isn't in the list of new row numbers
	    if ( newRowNums.indexOf( rowNum ) === -1 ) {
	      // Slate it for removal
	      toRemove.push( rowNum );
	    }
	  }  // End for every row in current row numbers array

	  var numRemove = toRemove.length;
	  for ( var numi = 0; numi < numRemove; numi++ ) {
	    var num = toRemove[ numi ];
	    // Get any element in the parent with that id, if it exists
	    // Can't get element by id from parent, only elements by class name
	    var rowNode = document.getElementById( 'row_' + num );
	    // If the row node does exist, which it should, remove it
	    if ( rowNode !== null ) {
	      parentNode.removeChild( rowNode );
	    }
	  }  // End for every current existing row
	  
	  return parentNode;
	};  // End scroller.removeExcessRows()


	scroller.updateRows = function ( topRowNum, parentNode ) {
	/* ( int, Node ) -> [Nodes] 
	* 
	* For example, if no rowNodes are showing, we have to remove all the old ones and add all new ones, etc., so we do that all the time
	*/
	  console.log('---- UPDATING ----')
	  // Get an array of all the current row numbers
	  var currentRows = document.getElementsByClassName('row');
	  var currRowNums = scroller.getCurrentRowNums( currentRows );
	  // Get all the new row numbers we'll need, starting with the top row
	  var newRowNums  = scroller.getNewRowNums( topRowNum );
	  
	  // Remove all the old rows that won't be needed anymore
	  scroller.removeExcessRows( currRowNums, newRowNums, parentNode );
	  
	  var newRowNum = topRowNum;
	  for ( var rowCount = 0; rowCount < NUM_EXISTING_ROWS; rowCount++ ) {

	    var rowNode = document.getElementById( 'row_' + newRowNum );
	    // If a row of that id isn't there add it. Doesn't matter about prepending or appending, they're all positioned absolutely
	    
	    if ( rowNode === null ) {
	      var rowNode = makeRow( newRowNum );
	      parentNode.appendChild( rowNode );
	    }
	    // Prepare for next iteration
	    newRowNum += 1;
	  }  // End for each new row
	  
	  return currentRows;
	};  // End scroller.updateRows()


	var oldFirstRowNum = 0;
	scroller.gridScrollHandler = function ( evnt, sizer_, force ) {
	  
	  // rowNum indicates, I think, the first visible row from the top?
	  var currRowNum = Math.ceil(container_.scrollTop/(rowHeight + rowVertMargin));     // Row num will never exceed max allowed by total rows
	  // TODO: Add deltaY limit
	  //console.log(evnt.deltaY)
	  // ??: At what delta do they start disappearing anyway?
	  // ??: Why do I sometimes get deltaY = 1/13/30 without any updating message? Asynchronisity?
	  // Note: scrolling stops instantly when mouse leave the element
	  // If a new row is the top row and the scroll is traveling slowly enough
	  if ( force === true || (currRowNum !== oldFirstRowNum && (evnt.deltaY < 100 || evnt.deltaY > -100)) ) {

	    // Update the grid with the right rows
	    var topRowNum = scroller.getTopRowNum( currRowNum );
	    console.log(topRowNum);
	    scroller.updateRows( topRowNum, sizer_ );
	  }

	  oldFirstRowNum = currRowNum;
	}  // End scroller.gridScrollHandler()



	// ========================
	// EVENTS
	// ========================
	// TODO: Somehow account for if mouse leaves element
	// Not showing new elements for some reason
	container_.addEventListener('wheel', function(evnt) {
	  scroller.gridScrollHandler( evnt, sizer_, false );
	});  // End container_ event listener wheel

	// ??: Better on mousemove or mouseout?
	// Note: mousemove not working for scrollbar
	container_.addEventListener('mouseout', function(evnt) {
	  //console.log('===== MOUSEOUT =====')
	  scroller.gridScrollHandler( evnt, sizer_, true );
	});  // End container_ event listener mouseout


	container_.addEventListener('scroll', function(evnt) {
	  //console.log('===== SCROLL =====')
	  // This event's behavior is great: it seems not to cycle through 
	  // all the rows it passes through, just select rows
	  scroller.gridScrollHandler( evnt, sizer_, true );
	});  // End container_ event listener scroll


	// ========================
	// START
	// ========================
	// Make grid for the first time
	scroller.updateRows( null, sizer_, true );

};  // End ScrollRevealerTest {}
