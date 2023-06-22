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
//let my_pet_info;

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
		while(api_retries < 3){
			initAPI(apiConnectPet);
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
		await petLoadApiDetails();
		
	}
	
	// Dismiss loading screen and fade into the widget.
	widgetOnAPILoad(has_api_online);
}

// Get details on requested avatar's pet.
// Default is set to 'Benjo ' avatar ID in case of error.
async function petLoadApiDetails(ownerId='p7thmpaltch4s88w0djlpopmtj3wpnur'){
	
	// This block of code will be to determine if our variable my_pet_info is defined.
	// Currently, this is handled and set from the homepage re-write. It is not set anywhere in our widget.
	// Eventually, we will move this variable declaration to this widget, probably here. 
	// For now, just get this feature-ful, it will need to be run from the homepage.
	
	// Utilize global variable api_user_info to pull avatar data & pet data.
		await getAPIresponse('avatar/pet/'+ownerId+"/");
		let my_pet_info = response_data;
		// Merge db data - stringId+headPostfix
		pet_pic_string = response_data.stringid+response_data.postfix;
			
		// Build links to pet images
		let pet_snapshot = 'https://avatars.smallworlds.app/'+pet_pic_string+'_snap.png';
		let pet_thumbnail = 'https://avatars.smallworlds.app/'+pet_pic_string+'_thumb.png';
		let pet_head = 'https://avatars.smallworlds.app/'+pet_pic_string+'.png';
		
		
		document.getElementById('petName').innerHTML = my_pet_info.name;
		document.getElementById('petMotto').innerHTML = my_pet_info.desc;
		document.getElementById('petHead').style.background = 'url('+pet_head+')';
}
	

