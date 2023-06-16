/*! 
* SmallWorlds X JavaScript Web API Widgets/PetAPI
* Description: JavaScript file to handle API elements specific to the SmallWorlds X Pet widget on the homepage.
* Author: Benjamin Robert
* Author: Justin Schwertmann
* URI: https://www.smallworlds.app/
* Created: 6/15/23
* Last Edited: 6/15/23
*/

// ----- VARIABLES
let api_retries = 0;

// ----- FUNCTIONS
// Connect to API endpoint and load in data if available.
async function apiConnectPet(){
	
	// Test for JS API being loaded.
	if(typeof has_api_loaded === 'undefined' || !has_api_loaded){
		console.log("API has not been initialized. Please report this.");
		return null;
	}
	
	// Test of API is online and accessible
	if(typeof has_api_online === 'undefined' || !has_api_online){
		while(api_retries < 5){
			initAPI(apiConnectPet);
			console.log("Trying to reconnect to API ("+api_retries+")...");
			api_retries++;
			return null;
		}
	}
	
	// API is unreachable. Handle running locally without any calls.
	if(!has_api_online){
		// Display red top-bar to indicate an error has occured.
		document.getElementById("topUI").style.background = "#ff5b5b";
		
	}
	// API has been reached. Connect and get details.
	else{
		// If this page does not have the current avatar's info, get it.
		if(typeof my_info === 'undefined' || !my_info){
			
		}
		
		// Load details function.
		petLoadApiDetails();
		
	}
	
	// Dismiss loading screen and fade into the widget.
	widgetOnAPILoad();
}

// Get details on requested avatar's pet.
// Default is set to 'Benjo ' avatar ID in case of error.
async function petLoadApiDetails(ownerId='p7thmpaltch4s88w0djlpopmtj3wpnur'){
	
}