/*! 
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
var has_been_warned; // Has the console been told the API is down (if it is)?
var api_user_info; // Declare account information in this document for use across all API-dependant files.
var api_endpoints_loaded = []; // Track endpoints that get loaded per page.
var api_modules_loaded = []; // Track modules/widgets that get loaded.

initAPI(); // Test for API connectivity.


async function initAPI(callbackFunction=null){
	let controller = new AbortController(); // Will allow us to timeout API test.
	let apiTimeout = 1500; // 1.5 seconds
	const timeoutId = setTimeout(() => {controller.abort();}, apiTimeout); // Start 3s timeout
	
	// If our API connection has already been successful, skip the check and run the callback function exclusively.
	if(has_api_online != true){
		// Test the API & world status and wait for a response <= apiTimeout
		await fetch(swAPIURL+'me', { signal: controller.signal,})
			.then(response => {
				if(response.ok){
					has_api_online = true;
					api_user_info = response;
				}else{
					console.log('API is online, but the session is invalid.');
					has_api_online = false;
				}
			})
			.catch(error => {
				if(error.name === 'AbortError'){
					// Error due to timeout on API request.
					if(!has_been_warned){ console.log("API offline."); }
					
					// Dismiss further warnings
					has_been_warned = true;
				}else{
					// Error due to some other reason.
					console.log("Recieved response, but it was unexpected.");
				}
				has_api_online = false;
			});
	}
	
	// If this API is being called to activate something, trigger the function passed to us.
	if(callbackFunction){ callbackFunction(); }
}
	
// Request GET data from an API endpoint 
async function getAPIresponse(endpoint){
	// If this page has unsuccessfully loaded, respond like this.
	if(!has_api_loaded) { console.log("API is not loaded. How are you running this?"); initAPI(); }
	
	// If our API is not online, do not try to process requests.
	if(!has_api_online && !has_been_warned) { console.log("API is offline. API requests will not be processed. Please refresh the page to try again."); return null; }
	
	await fetch(swAPIURL+endpoint)
	  .then(response => response.json()) // Extract JSON data from the response
	  .then(data => {
		response_data = data;
		
		// If the API endpoint has not been logged yet set up a keypair in the array.
		if(!api_endpoints_loaded[endpoint]){
			api_endpoints_loaded.push({endpoint:0});
		}
		// Increment number in api_endpoints_loaded for respective endpoint
		api_endpoints_loaded[endpoint] += 1;
		
		return response_data; // Store the data in our variable
	})
		.catch(error => {
		console.log('Error:', error);
		//handleLogout(); // We do not want to do this during testing.

	});
}

// Send POST data to an API endpoint 
async function sendAPIresponse(endpoint, post_data){
	// If this page has unsuccessfully loaded, respond like this.
	if(!has_api_loaded) { console.log("API is not loaded. How are you running this?"); initAPI(); }
	// If our API is not online, do not try to process requests.
	if(!has_api_online && !has_been_warned) { console.log("API is offline. API requests will not be processed. Please refresh the page to try again."); return null; }
	
	
}

function handleLogout(){
	window.location.replace("https://smallworlds.app/");
	document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); }); // Clear cookies and go to login.
	console.log("Session has expired or the API is down. Redirect to login.");
}
