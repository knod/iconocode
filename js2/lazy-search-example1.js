/* lazy-search-example1.js

Based on:
http://codepen.io/atwulf/pen/vczhJ
*/

$(document).ready(function() {

	var searchBar 		= document.getElementById( 'search-bar' );
	var searchOutput 	= document.getElementById( 'search-output' );

    var searchTerms = [
        'search',
        'test',
        'css',
        'apple',
        'bear',
        'cat',
        'crabapple',
        'creep',
        'czar',
        'danger',
        'dominant',
        'doppler',
        'everclear',
        'evangelism',
        'frodo'
    ].sort();

    var outputText = [];

    var addNewPrediction = function( matchStr, foundIndex, wordStr, parentNode ) {
    /* ( str, Node ) -> new Node

	Add the prediction list item node to parent and return it
	*/
        var listItem 			= document.createElement('li');
        parentNode.appendChild( listItem ); 
        listItem.className 		= 'prediction-item';

        listItem.addEventListener('click', function() {

            predictionText = $(this).find('span').text();
            $('#search-output').slideUp(function() {
                $(this).html('');
            });
            $('#search-bar').val( predictionText );
	            
        });


        var predictionCont 		= document.createElement('span');
        listItem.appendChild(predictionCont);
        predictionCont.className = 'prediction-text found-letter';

        // Create a text node of everything before the match
        var beginningChars 		= wordStr.slice(0, foundIndex);
        var beginning 			= document.createTextNode( beginningChars );
        predictionCont.appendChild( beginning );

        // Create a bolded text node of the matching letter
    	var bold 				= document.createElement('strong');
    	predictionCont.appendChild( bold );
    	var matchNode 			= document.createTextNode( matchStr );
    	bold.appendChild( matchNode );

        // Create a text node of everything after the match
        // Consolidate the first part of the word
        var firstPart 			= beginningChars + matchStr;
        // Remove that from the word to leave the end of the word
        // (for search values with mutlple letters)
    	var endChars 			= wordStr.replace( firstPart, '' );
    	var end 				= document.createTextNode( endChars );
    	predictionCont.appendChild( end );

        return listItem;
    }; // End addNewPrediction()


	// function strInArray(str, testArray) {
	// 	for (var wordi = 0; wordi < testArray.length; wordi++) {
	// 	  if (testArray[wordi].match(str) && outputText.length < 5) {
	// 	    var prediction = testArray[wordi].replace( str, '<strong>' + str + '</strong>' );
	// 	    outputText.push('<li class="prediction-item"><span class="prediction-text">' + prediction + '</span></li>');
	// 	  }
	// 	}
	// }

    var strInArray = function (str, testArray) {

        for (var wordi = 0; wordi < testArray.length; wordi++) {

            var word 	= testArray[wordi];
            // [ "", index: #, input: "" ]
            var match 	= word.match(str);

            if ( match !== null ) { // && outputText.length < 5) { // Why restrict length?
				
				var matched = match[0],
					indx 	= match.index;

				addNewPrediction( matched, indx, word, searchOutput );

            }
        }  // end for testArray
    };


    function nextItem(kp) {


        if ($('.focus').length > 0) {
            var next = $('.focus').next(),
                prev = $('.focus').prev();
        }

        if (kp == 38) { // Up

            if ($('.focus').is(':first-child')) {
                prev = $('.prediction-item:last-child');
            }

            $('.prediction-item').removeClass('focus');
            prev.addClass('focus');

        } else if (kp == 40) { // Down

            if ($('.focus').is(':last-child')) {
                next = $('.prediction-item:first-child');
            }

            $('.prediction-item').removeClass('focus');
            next.addClass('focus');
        }
    }



    // $(function() {
        $('#search-bar').keydown(function( evnt ) {
            keyPressed = evnt.keyCode;

            if ( keyPressed == 38 || keyPressed == 40 ) {
                nextItem(keyPressed);
                return;
            }

            // On the event, the character isn't yet in the searchbar, so
            // A delay before checking if a letter has been typed
	        setTimeout(function() {

	            var searchInput = $('#search-bar').val();
	            // outputText = [];
	            $('#search-output').empty()

	            if (searchInput == '' || !$('input').val) {
	                $('#search-output').slideUp();
	            } else {
		            strInArray( searchInput, searchTerms );
	                $('#search-output').slideDown();
	            }

	            $('.prediction-item').on('click', function() {

	                predictionText = $(this).find('span').text();
	                $('#search-output').slideUp(function() {
	                    $(this).html('');
	                });
	                $('#search-bar').val( predictionText );
	            
	            });

	            $('.prediction-item:first-child').addClass('focus');

	        }, 50);
        });


    // });

    $('#search-bar').focus(function() {
        if ($('.prediction-item').length > 0) {
            $('#search-output').slideDown();
        }

        $('#searchform').submit(function(e) {
            e.preventDefault();
            $text = $('.focus').find('span').text();
            $('#search-output').slideUp();
            $('#search-bar').val($text);
            $('input').blur();
        });
    });

    $('#search-bar').blur(function() {
        if ($('.prediction-item').length > 0) {
            $('#search-output').slideUp();
        }
    });

});