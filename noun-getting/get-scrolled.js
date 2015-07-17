/* get-scrolled.js
* 
* RESOURCES:
* http://stackoverflow.com/questions/29017726/scraping-an-infinite-scroll-page-stops-without-scrolling
* 
*/

var casper 	= require('casper').create();
var fs 		= require('fs');

'use strict';

var nounUrls = [];

var getScrolledHrefs = function () {

	function getNumberOfItems(casper) {
	    return casper.getElementsInfo("#list-view").length;
	}

	function tryAndScroll(casper) {
	  casper.page.scrollPosition = { top: casper.page.scrollPosition["top"] + 4000, left: 0 };
	  var info = casper.getElementInfo('#list-view');
	  if (info.visible) {
	    var curItems = getNumberOfItems(casper);
	    casper.waitFor(function check(){
	      return curItems != getNumberOfItems(casper);
	    }, function then(){
	      tryAndScroll(this);
	    }, function onTimeout(){
	      this.echo("Timout reached");
	    }, 20000);
	  } else {
	    casper.echo("no more items");
	  }
	}


	casper.on('results.loaded', function () {
	  tryAndScroll(this);
	});

	casper.start('https://thenounproject.com/', function() {
	    this.waitUntilVisible('li.icon.container a', function() {
	        tryAndScroll(this);
	      });
	});

	casper.then(function() {
	  casper.each(this.getElementsInfo('li.icon.container a'), function(casper, element, j) {
	    var url = element["attributes"]["href"];
	    nounUrls.push(url);
	  });
	});

	// casper.run(function() {
	//     this.echo(nounUrls.length + ' links found:');
	//     this.echo(nounUrls.join('\n')).exit();
	// });

	// Write all these hrefs to a file

	fs.writeFile("./hrefs.json", '[' + nounUrls.join(',\n') + ']' , function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 

};  // End getScrolledHrefs


// Get all the hrefs from the main page
getScrolledHrefs();



// Get images with their href's for tags

// Get all hrefs

// Scrape those tags and download the file


// Get 
