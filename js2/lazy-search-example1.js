/* lazy-search-example1.js

Based on:
http://codepen.io/atwulf/pen/vczhJ

TODO:
- Search with multiple words to refine search? Will that happen anyway as
 long as I ignore spaces?
- Reduce the number of matches to test as more letters are added

Resources:
https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment

Notes:
str.match() = [ "", index: #, input: "" ]
*/

$(document).ready(function() {

    var searchBar       = document.getElementById( 'search-bar' );
    var searchOutput    = document.getElementById( 'search-output' );
    // To store the list in order to add it to the actual list container
    // all at once (https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)
    var listHolder      = document.createDocumentFragment();

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

    // var stylePrediction = function () {

        
    // }

    // var addNewPrediction = function( matchStr, foundIndex, wordStr, parentNode ) {
    // /* ( str, Node ) -> new Node

    // Add the prediction list item node to parent and return it
    // */
    //     var listItem            = document.createElement('li');
    //     parentNode.appendChild( listItem ); 
    //     listItem.className      = 'prediction-item';

    //     listItem.addEventListener('click', function() {

    //         predictionText = $(this).find('span').text();
    //         $('#search-output').slideUp(function() {
    //             $(this).html('');
    //         });
    //         $('#search-bar').val( predictionText );
                
    //     });


    //     var predictionCont      = document.createElement('span');
    //     listItem.appendChild(predictionCont);
    //     predictionCont.className = 'prediction-text';

    //     // Create a text node of everything before the match
    //     var beginningChars      = wordStr.slice(0, foundIndex);
    //     var beginning           = document.createTextNode( beginningChars );
    //     predictionCont.appendChild( beginning );

    //     // Create a bolded text node of the matching letter
    //     var bold                = document.createElement('strong');
    //     predictionCont.appendChild( bold );
    //     var matchNode           = document.createTextNode( matchStr );
    //     bold.appendChild( matchNode );

    //     // Create a text node of everything after the match
    //     // Consolidate the first part of the word
    //     var firstPart           = beginningChars + matchStr;
    //     // Remove that from the word to leave the end of the word
    //     // (for search values with mutlple letters)
    //     var endChars            = wordStr.replace( firstPart, '' );
    //     var end                 = document.createTextNode( endChars );
    //     predictionCont.appendChild( end );

    //     return listItem;
    // }; // End addNewPrediction()


    // function strInArray(str, testArray) {
    //  for (var wordi = 0; wordi < testArray.length; wordi++) {
    //    if (testArray[wordi].match(str) && outputText.length < 5) {
    //      var prediction = testArray[wordi].replace( str, '<strong>' + str + '</strong>' );
    //      outputText.push('<li class="prediction-item"><span class="prediction-text">' + prediction + '</span></li>');
    //    }
    //  }
    // }

    /* Sublime lazy search
    For every letter in the input:
    If a letter is in the word.
        flip a boolean to indicate there was a match? (hold off till we need it)
        store the index of that letter in the word in a list
        remove that letter from that location in the word
    When done:
        If the number of letters in the input and the number of
        letters in the list are the same (or check this while looping:
        if letter isn't found, make boolean false):
            XFor every letter in the list:
                XReplace the existing letter with a node...
                    no, that will mean text is mixed up with nodes
            For every letter in the word:
                If its index number isn't in the letter list:
                    make a text node of it and add to parent
                otherwise:
                    make a bold node out of it and add to parent

    https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment?
    */

    var toExclude           = [ " ", "," ];
    var shouldExcludeChar   = function ( charToTest ) {
    /* ( str ) -> bool

    Tests whether a character is in the toExclude list.
    */
        // Look for character in list
        var indx = toExclude.indexOf( charToTest );
        // console.log( 'should exclude? "' + charToTest + '": ' + indx );
        // If char was found in list, it should be excluded
        if ( indx >= 0 ) { return true; }
        else { return false; }
    };  // End shouldExcludeChar()

    var addPredListItem   = function ( parentNode ) {
    /*

    How to integrate this into everything else? We want two things out
    of this - the list item and the span it contains...
    */
        var listItem            = document.createElement('li');
        parentNode.appendChild( listItem );
        listItem.className      = 'prediction-item';

        // Event listener to put the word in the search bar
        listItem.addEventListener('click', function() {

            predictionText = $(this).find('span').text();

            $('#search-output').slideUp(function() {
                $(this).empty();  // Needed?
            });

            $('#search-bar').val( predictionText );
                
        });

        return listItem;
    };  // End addPredListItem()


    var addPredContainerTo  = function ( parentNode ) {
    /* ( Node ) -> new Node

    Adds the prediction container to its parent and returns
    the container
    */
        var predictionCont      = document.createElement('span');
        parentNode.appendChild(predictionCont);
        predictionCont.className = 'prediction-text';

        return predictionCont;
    };  // End addPredContainerTo()


    var addBoldStr          = function ( str, parentNode ) {
    /* ( str ) -> Node

    Adds a bolded text node of the give String to the parentNode
    and returns it
    */
        var bold    = document.createElement('strong');
        parentNode.appendChild( bold );

        var strNode = document.createTextNode( str );
        bold.appendChild( strNode );
        console.log('bold node: ', bold);
        return bold;
    };  // End addBoldStr()


    var addTextNode         = function ( str, parentNode ) {
    /* ( str ) -> Node

    Adds a text node of the give String to the parentNode
    and returns it
    */
        var strNode = document.createTextNode( str );
        parentNode.appendChild( strNode );

        return strNode;
    };  // End addTextNode()


    var addNewPrediction  = function ( prediction, indxsOfMatches, parentNode ) {
    /*  ( str, [], Node ) -> new Node

    Appends a list item node with the prediction in it (to the parentNode)
    where the prediction's matching letters have been replaced by bold letters
    */
        var listItem = addPredListItem( parentNode );
        var predCont = addPredContainerTo( listItem );

        // Why are we making a copy?
        var wordCopy = prediction;  // Creates a new string

        for ( var chari = 0; chari < prediction.length; chari ++  ) {
            var thisChar    = prediction[ chari ];

            // Is the current index number contained in the list of indexes?
            var indxIndx    = indxsOfMatches.indexOf( chari );
            // If so
            if ( indxIndx >= 0 ) {

                addBoldStr( thisChar, predCont );

            } else {

                addTextNode( thisChar, predCont );
            }  // end if indx number is a matcher's indx

        }  // End for char in prediction

        // console.log(listItem);
        return listItem;
    };  // End addNewPrediction()


    var addIfPrediction   = function ( input, wordToTest, parentNode ) {
    /* ( str, str ) -> ?

    Finds out whether a word is a prediction. If so, adds it to the
    document fragment?
    */
        var inputArray          = input.split(''),
            // To store indexes of matching values
            indxsOfMatches        = [],
            // Copy we can destroy for testing
            wordCopy            = wordToTest,
            // Does the word contain all the letters
            containsAllLetters  = true;

        var predictionNode      = null;

        // For every letter in the input
        for ( var chari = 0; chari < inputArray.length; chari ++  ) {

            var thisChar    = inputArray[ chari ],
                // Test the remaining letters
                matchInfo   = copyWord.match( thisChar ),  // If not there, will be null
                doExclude   = shouldExcludeChar( thisChar );

            // If there's no match, letters are missing
            if ( matchInfo === null ) {
                containsAllLetters = false;
                // break;  // I don't like break :/

            // If there's a match and it shouldn't be excluded
            } else if ( doExclude !== true ) {
                // Store the index of that letter in the word
                // ?? How do I find this new index without just getting the old index?
                indxsOfMatches.push( matchInfo.index );
                // Make sure that specific character isn't found again
                // For example, if input is 'ss', we don't want to find the first 's' twice
                // This method only works because both .match and .replace are finding the
                // first appearance of the letter.
                wordCopy = wordCopy.replace( thisChar, '' );
            };  // End test matches
            caa
            // if ( containsAllLetters === false ) { break; }  // still dont' like break :/
        }  // End for char in inputArray

        // Did the word have all the letters?
        if ( containsAllLetters === true ) {
            // console.log('----------')
            // console.log( indxsOfMatches )
            addNewPrediction( wordToTest, indxsOfMatches, parentNode );
        }

        // console.log(predictionNode);
        return predictionNode;
    };  // End addIfPrediction()


    var replaceContents     = function ( container, replacementNode ) {
    /* ( Node, Node ) -> first Node

    Replace the contents of container with replacementNode
    */
        $( container ).empty();
        $( container ).append( replacementNode );
        return container;
    };  // End replaceContents()


    var replacePredictions  = function ( toMatch, wordsToSearch, predictionListNode ) {
    /* ( str, [], Node ) -> same Node

    
    */
        // Start with an empty dummy node
        $( listHolder ).empty();

        // Add list items to the dummy node
        for ( var wordi = 0; wordi < wordsToSearch.length; wordi++ ) {
            addIfPrediction( toMatch, wordsToSearch[ wordi ], listHolder );
        }

        // Put everything at once to the actual list node
        replaceContents( predictionListNode, listHolder );

        return predictionListNode;
    };  // End replacePredictions()



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
                    // strInArray( searchInput, searchTerms );
                    replacePredictions( searchInput, searchTerms, searchOutput );
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
