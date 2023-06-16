/*! 
* this is duplicated for simplicity during testing. final resting place is https://content.smallworlds.app/web/js/api.js
* SmallWorlds X JavaScript Web API 
* Description: Rewritten API file focusing on calls to display webpages outside of the main Flash app.
* Author: Benjamin Robert
* Author: Justin Schwertmann
* URI: https://www.smallworlds.app/
* Created: 6/12/23
* Last Edited: 6/15/23
*/
const swAPIURL = 'https://smallworlds.app/api/'; // We do not deviate from this API endpoint.
var response_data; 	// Basic variable to store API response.
var has_api_loaded = true; // Report if our initAPI() function has run and loaded.
var has_api_online; // Report status of API endpoint based on initAPI() fetch.
initAPI(); // Test for API connectivity.


async function initAPI(callbackFunction=''){
	let controller = new AbortController(); // Will allow us to timeout API test.
	let apiTimeout = 3000; // 3 seconds
	const timeoutId = setTimeout(() => {controller.abort();}, apiTimeout); // Start 3s timeout
	
	// Test the API & world status and wait for a response <= apiTimeout
	await fetch(swAPIURL+'world/online', { signal: controller.signal,})
		.then(response => {
			has_api_online = true;
		})
		.catch(error => {
			if(error.name === 'AbortError'){
				// Error due to timeout on API request.
				console.log("API offline.");
			}else{
				// Error due to some other reason.
				console.log("Recieved response, but it was unexpected.");
			}
			has_api_online = false;
		});
	
	// If this API is being called to activate something, trigger the function passed to us.
	if(callbackFunction){ callbackFunction(); }
}
	
// Request GET data from an API endpoint 
async function getAPIresponse(endpoint){
	// If this page has unsuccessfully loaded, respond like this.
	if(!has_api_loaded) { console.log("API is not loaded. How are you running this?"); initAPI(); }
	
	// If our API is not online, do not try to process requests.
	if(!has_api_online) { console.log("API is offline. API requests will not be processed. Please refresh the page to try again."); return null; }
	
	await fetch(swAPIURL+endpoint)
	  .then(response => response.json()) // Extract JSON data from the response
	  .then(data => {
		response_data = data;
		return response_data; // Store the data in our variable
	})
		.catch(error => {
		console.log('Error:', error);
		//handleLogout(); // We do not want to do this during testing.

	});
}

async function sendAPIresponse(endpoint, post_data=''){
	// If this page has unsuccessfully loaded, respond like this.
	if(!has_api_loaded) { console.log("API is not loaded. How are you running this?"); initAPI(); }
	// If our API is not online, do not try to process requests.
	if(!has_api_online) { console.log("API is offline. API requests will not be processed. Please refresh the page to try again."); return null; }
	
	await fetch(swAPIURL+endpoint)
	  .then(response => response.json()) // Extract JSON data from the response
	  .then(data => {
		response_data = data;
		return response_data; // Store the data in our variable
	})
		.catch(error => {
		console.log('Error:', error);
		//handleLogout(); // We do not want to do this during testing.

	});
	
	// Run function from widgets/common/common.js to send status of API.
	apiLoadingComplete();
}

function handleLogout(){
	window.location.replace("https://smallworlds.app/");
	document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); }); // Clear cookies and go to login.
	console.log("Session has expired or the API is down. Redirect to login.");
}
