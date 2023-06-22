/*! 
* SmallWorlds X JavaScript Web API Widgets/Spin to Win API
* Description: JavaScript file to handle API elements specific to the SmallWorlds X S2W widget on the homepage.
* Author: Benjamin Robert
* Author: Justin Schwertmann
* URI: https://www.smallworlds.app/
* Created: 6/20/23
* Last Edited: 6/20/23
*/

// ----- VARIABLES
let api_retries = 0;


// ----- FUNCTIONS

// Connect to API endpoint and load in data if available.
async function apiConnectS2W(){
	
	// Test for JS API being loaded.
	if(typeof has_api_loaded === 'undefined' || !has_api_loaded){
		console.log("API has not been initialized. Please report this.");
		return null;
	}
	
	// Test of API is online and accessible
	if(typeof has_api_online === 'undefined' || !has_api_online){
		while(api_retries < 3){
			initAPI(apiConnectS2W);
			console.log("Trying to reconnect to API ("+api_retries+")...");
			api_retries++;
			return null;
		}
	}
	
	// API is unreachable. Handle running locally without any calls.
	if(!has_api_online){
		// Display red top-bar to indicate an error has occured.
		document.getElementById("topUI").style.background = "linear-gradient(0deg, rgba(2,0,36,0) 0%, rgba(255,0,0,1) 100%)";
		
	}
	// API has been reached. Connect and get details.
	else{
		// Load details function.
		await s2wLoadApiDetails();
	}
	
	// Dismiss loading screen and fade into the widget.
	widgetOnAPILoad(has_api_online);
}

// Get details on requested avatar's s2w state.
async function s2wLoadApiDetails(meID){
}
	

