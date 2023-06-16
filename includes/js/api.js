/*! 
* this is duplicated for simplicity during testing. final resting place is https://content.smallworlds.app/web/js/api.js
* SmallWorlds X JavaScript API 
* Description: Rewritten API file focusing on calls to display webpages outside of the main Flash app.
* Author: Justin Schwertmann
* Author: Benjamin Robert
* URI: https://www.smallworlds.app/
* Created: 6/12/23
* Last Edited: 6/12/23
*/
const swAPIURL = 'https://smallworlds.app/api/'; // We do not deviate from this API endpoint.
var response_data; // Basic variable to store API response.


async function getAPIresponse(endpoint, display_id=''){
	await fetch(swAPIURL+endpoint)
	  .then(response => response.json()) // Extract JSON data from the response
	  .then(data => {
		response_data = data;
		if(display_id){ displayAPIData(response_data, display_id); } // Pass data to immediate display.
		else{ return response_data; } // Store the data in our variable
	})
		.catch(error => {
		console.log('Error:', error);
		//handleLogout(); // We do not want to do this during testing.

	});
}

function displayAPIData(data, display_id, json_selector='') {
  // Manipulate the HTML to display the data
  const resultContainer = document.getElementById(display_id);
  resultContainer.innerHTML = JSON.stringify(data);

}


function handleLogout(){
	window.location.replace("https://smallworlds.app/");
	document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); }); // Clear cookies and go to login.
	console.log("Session has expired or the API is down. Redirect to login.");
}
