/* Pet care & logic functions file. */

// ----- VARIABLES AND CONSTANTS
let careMode = 0; // Mode of care. Ranges 1-3 for active care and 0 for no care mode.
let careStatusHappiness = 0; // Current status of happiness. Default is 0, but we will pull current status from API later.
let careStatusHealth = 0; // Current status of health. Default is 0, but we will pull current status from API later.
let careStatusHygiene = 0; // Current status of hygiene. Default is 0, but we will pull current status from API later.
const careMaxHappiness = 100; // Maximum value for happiness value.
const careMaxHealth = 100; // Maximum value for health value.
const careMaxHygiene = 100; // Maximum value for hygiene value.
const careIncrementHappiness = 2; // How much should our progress increment on successful patting?
const careIncrementHygiene = 5; // How much should our progress increment on successful cleaning?
const careIncrementHealth = 25; // How much should our progress increment on successful feeding?

// ----- ON-LOAD EVENT LISTENERS
// Add event listeners for the care buttons.
document.getElementById('UIPatBtn').addEventListener('click', function(){ petSwitchCareMode(1); });
document.getElementById('UIFoodBtn').addEventListener('click', function(){ petSwitchCareMode(2); });
document.getElementById('UICleanBtn').addEventListener('click', function(){ petSwitchCareMode(3); });
	
// Add event listener to pet stage. Will reset care mode to none.
document.getElementById('petDisplay').addEventListener('click', function(){ petSwitchCareMode(0); });

// ----- FUNCTIONS
// Visually update the progress of care bars.
function petUpdateCareBars(){
	let happinessWidth = Math.round((careStatusHappiness*100)/careMaxHappiness);
	let healthWidth = Math.round((careStatusHealth*100)/careMaxHealth);
	let hygieneWidth = Math.round((careStatusHygiene*100)/careMaxHygiene);

	// Set style of progress bar fill elements to the respective width vars.
	document.getElementById('barHappinessFill').style.width = happinessWidth+"%";
	document.getElementById('barHealthFill').style.width = healthWidth+"%";
	document.getElementById('barHygieneFill').style.width = hygieneWidth+"%";
}

// Handle switching between care modes. Update cursor and add event listeners for specific care modes.
function petSwitchCareMode(mode=0){
	
	is_pet_idle = false; // Take our pet out of its idle animation.
	setPetHead(pet_head_state_front); // Snap it's head back at us.
	// Trigger when our current mode is no care (0) and we are switching to care mode.
	if(mode != 0){
		if(mode == 1){ // Pat/happy mode 
			document.getElementById('petWidget').className = "widget-box cursor-pat-enabled";
			document.getElementById('petDisplay').addEventListener('mouseover', petIncrementCare);
		}
		else if(mode == 2){ // food/health mode 
			document.getElementById('petWidget').className = "widget-box cursor-food-enabled";
			document.getElementById('petAssembly').addEventListener('click', petIncrementCare);
		}
		else if(mode == 3){ // Clean/hygiene mode 
			document.getElementById('petWidget').className = "widget-box cursor-clean-enabled";
			document.getElementById('petDisplay').addEventListener('mouseover', petIncrementCare);
		}
	}
	// Trigger when we are currently in an active care mode and are switching to no care mode.
	else if(mode == 0 && careMode != 0){
		document.getElementById('petDisplay').removeEventListener('mouseover', petIncrementCare);
		document.getElementById('petAssembly').removeEventListener('click', petIncrementCare);
		document.getElementById('petWidget').className = 'widget-box'; // Clear cursor
		
		// Set time-out for emoting in case emotes still are handling in the background.
		document.getElementById("petEmoteSpace").style.opacity = "0";
		is_pet_emoting = true;
		setTimeout( function(){ is_pet_emoting = false; }, 500);
		
		is_pet_idle = true; // Put our pet back into idling.
		handlePetIdleAnimation(); // Start back up idle loop.
	}
	// Change careMode to mode, the arg passed to this function.
	if(mode > 3) { mode = 0 } // Handle mode greater than 3 & treat as a reset.
	careMode = mode;
}

// Increment our care status based on mode.
function petIncrementCare(){
	// We do not want the values of our careStatus to exceed the maximum set values.
	if(careStatusHealth > careMaxHealth){ careStatusHealth = careMaxHealth; }
	if(careStatusHappiness > careMaxHappiness){ careStatusHappiness = careMaxHappiness; }
	if(careStatusHygiene > careMaxHygiene){ careStatusHygiene = careMaxHygiene; }

	// We do not want the values of our careStatus to (somehow) fall below 0.
	if(careStatusHealth < 0){ careStatusHealth = 0; }
	if(careStatusHappiness < 0){ careStatusHappiness = 0; }
	if(careStatusHygiene < 0){ careStatusHygiene = 0; }
	
	// Now we increment our care value based on careMode.
	if(careMode == 1){ 
		careStatusHappiness += careIncrementHappiness;
		if(!is_pet_emoting){ petEmotePat(); } // do emote animation if not currently doing one
	} // Happiness
	else if(careMode == 2){ 
		careStatusHealth += careIncrementHealth; 
		if(!is_pet_emoting){ petEmoteEat(); } // do emote animation if not currently doing one
	} // Health
	else if(careMode == 3){ 
		careStatusHygiene += careIncrementHygiene;
		if(!is_pet_emoting){ petEmotePat(); } // do emote animation if not currently doing one
	} // Hygiene
	else{ return false } // Someone passed some bad data along...

	// Call petUpdateCareBars to update the visual of care bars.
	petUpdateCareBars();
}