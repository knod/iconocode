/* Utils.js
* 
*/

'use strict'

var IcdUtils = function () {
/* 
* 
*/
	var newUtils = {};


	newUtils.getVarIcon = function ( varName, mapObj ) {
	/* ( str ) -> Icon{} or Null
	* 
	* If varName is a key in mapObj, the Icon it matches up
	* to is returned, otherwise null is returned
	*/
		var iconObj = null;

		for ( var property in mapObj ) {

			// First make sure this doesn't go through the prototype's properties
			if ( !mapObj.hasOwnProperty(property) ) {
			} else if ( varName !== property ) {
			} else {
			// If the variable name is found as a key in the map
				iconObj = mapObj[ property ];
			}
		}  // End for key in mapObj


		return iconObj;
	};  // End newUtils.getVarIcon()


	return newUtils;
};  // End IcdUtils {}
