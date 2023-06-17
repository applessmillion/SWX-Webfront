/*! 
* SmallWorlds X JavaScript Common Widget
* Description: Handle common functions and elements shared across widgets.
* Author: Benjamin Robert
* Author: Justin Schwertmann
* URI: https://www.smallworlds.app/
* Created: 6/15/23
* Last Edited: 6/15/23
*/

function widgetOnAPILoad(){
	// Remove loading spinner
	document.getElementById("loadingSpinner").display = "none";
	if(has_api_online){
		// Fade out loading background and spinner.
		setTimeout(function(){ document.getElementById("loadingOverlay").className = "widget-overlay widget-overlay-dismissed" },1000);
	}else{
		// on API load error, show error.
		document.getElementById("loadingOverlay").innerHTML = "SmallWorlds encountered an error. Please try again later.";
	}
	
	
}