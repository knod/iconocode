/* icon-map.js
* 
* TODO:
* - Make icons deletable
* - Make icons editable
* 
*/

'use strict'

// =====================
// TEST
// =====================
var IcdMap = function () {

	var icdMap = {};



	return icdMap;
};  // End IcdMap {}

var addIconDefaults = function () {
	var constructIcon = function ( variableName, purpose, imageNodes ) {
	/* ( str, str, [Nodes] ) -> {}
	* 
	* Creates, sets, and saves an icon with the given values.
	*/
		var iconObj = new Icon( variableName );

		// Placeholder... Not sure this works this way anymore
		// Need to create marker
		iconObj.createNew( document.createDocumentFragment() );
		iconObj.setType( purpose , iconObj.container );
		iconObj.setImages( imageNodes, iconObj.body );

		icd.map[ variableName ] = iconObj;

		return iconObj;
	};  // End commands.constructIcon()

	var playerObj = {"varName":"player","parts":["<img src=\"./images/smile-face-green-cutthrough.svg\" class=\"icon-part\" tabindex=\"0\">"],"container":{},"body":{},"tags":[],"svgAttributes":"xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none' ","purpose":"noun","id":"undefined"};
	constructIcon( playerObj.varName, playerObj.purpose, playerObj.parts );

	var addPlayer = {"varName":"addPlayer","parts":["<img src=\"./images/smile-face-green-cutthrough.svg\" class=\"icon-part\" tabindex=\"0\">","<img class='icon-part' src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDQ4IDQ4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxuczp4bWw9Imh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIj48cGF0aCBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIGQ9Ik00Ni44LDE4LjRIMzAuMmMtMC40LDAtMC43LTAuMy0wLjctMC43VjEuMmMwLTAuNC0wLjMtMC43LTAuNy0wLjdoLTkuN2MtMC40LDAtMC43LDAuMy0wLjcsMC43djE2LjYgIGMwLDAuNC0wLjMsMC43LTAuNywwLjdIMS4yYy0wLjQsMC0wLjcsMC4zLTAuNywwLjd2OS43YzAsMC40LDAuMywwLjcsMC43LDAuN2gxNi42YzAuNCwwLDAuNywwLjMsMC43LDAuN3YxNi42ICBjMCwwLjQsMC4zLDAuNywwLjcsMC43aDkuN2MwLjQsMCwwLjctMC4zLDAuNy0wLjdWMzAuMmMwLTAuNCwwLjMtMC43LDAuNy0wLjdoMTYuNmMwLjQsMCwwLjctMC4zLDAuNy0wLjd2LTkuNyAgQzQ3LjUsMTguNyw0Ny4yLDE4LjQsNDYuOCwxOC40eiI+PC9wYXRoPjwvc3ZnPg=='' tabindex=\"0\">"],"container":{},"body":{},"tags":[],"svgAttributes":"xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none' ","purpose":"verb","id":"undefinedundefined"};
	constructIcon( addPlayer.varName, addPlayer.purpose, addPlayer.parts );

	var moveObj   = {"varName":"move","parts":["<img src=\"./images/move.svg\" class=\"icon-part\" tabindex=\"0\">"],"container":{},"body":{},"tags":[],"svgAttributes":"xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none' ","purpose":"verb","id":"undefined"};
	constructIcon( moveObj.varName, moveObj.purpose, moveObj.parts );

};  // End addIconDefaults()
