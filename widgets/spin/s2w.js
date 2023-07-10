/*! 
* SmallWorlds X JavaScript Widgets/Spin to Win
* Description: JavaScript file to handle JS specific to the SmallWorlds X S2W widget on the homepage.
* Author: Benjamin Robert
* Author: Justin Schwertmann
* URI: https://www.smallworlds.app/
* Created: 7/10/23
* Last Edited: 7/10/23
*/

// ----- VARIABLES
let s2w_b_countdown = 300; // Countdown until next free spin is available. This is mainly handled server-side, but the client-side variable is for visual pieces where needed.
let s2w_d_spins; // Spins account has left on s2w deluxe.
let s2w_d_buy1 = []; // Purchase option from the database. Contains number of spins [0] in option, and cost [1] 
let s2w_d_buy2 = []; // Purchase option from the database. Contains number of spins [0] in option, and cost [1] 
let s2w_d_buy3 = []; // Purchase option from the database. Contains number of spins [0] in option, and cost [1] 
let s2w_d_buy4 = []; // Test a web exclusive option. Contains number of spins [0] in option, and cost [1] 


// ----- FUNCTIONS

// Format seconds left until next free spin.
function s2wFormatTimer(timer){
	let time_h = 0; // Hours
	let time_m = 0; // Minutes
	let time_s = 0; // Seconds
	
	while(timer >= 3600){ /* Handle hours. */
		time_h++;
		timer -= 3600;
	}
	
	while(timer >= 60){ /* Handle minutes. */
		time_m++;
		timer -= 60;
	}
	
	time_s = timer; // Anything left of the timer is added to seconds.
	
	
	if(time_m < 10 && time_h > 0){ // Add extra 0 to minutes if they are single-digit and if hours are greater than 0.
		time_m = '0' + time_m;
	}
	
	if(time_s < 10){ // Add extra 0 to seconds if they are single-digit.
		time_s = '0' + time_s;
	}
	
	if(time_h != 0){ // Return h:mm:ss
		return time_h + ':' + time_m + ':' + time_s;
	}else if(time_m != 0){ // Return mm:ss
		return time_m + ':' + time_s;
	}else if(time_s != 0){ // Return ss's'
		return time_s + 's';
	}else if(timer == 0){ // Return 'Ready'
		return 'Ready!';
	}else if(timer > 0){ // Something funky went wrong. Display error.
		return 'Error';
		console.log('Error: timer not null, but formatting could not be completed.');
	}else{ // Something else went wrong.
		return 'Error';
		console.log('Error: Timer less than zero.');
	}

}

// Focus on the basic wheel and handle clearing other details.
function s2wBasicWheelFocus(){
	s2wClearWidgetStyles(); // Clear any preset styles.
	document.querySelector("div#wheelTileBasic div.wheel-element").style.setProperty('left', '-75%');
	document.querySelector("div#wheelTileBasic div.wheel-element").style.setProperty('z-index', '2');
	document.querySelector("div#wheelTileDeluxe div.wheel-element").style.setProperty('z-index', '0');
	document.querySelector("div#wheelTileBasic").style.setProperty('width', '60%');
	document.querySelector("div#bottomUI").style.setProperty('bottom', '-35px');
	
}

// Focus on the deluxe wheel and handle clearing other details.
function s2wDeluxeWheelFocus(){
	s2wClearWidgetStyles(); // Clear any preset styles.
	document.querySelector("div#wheelTileBasic div.wheel-element").style.setProperty('left', '-140%');
	document.querySelector("div#wheelTileDeluxe div.wheel-element").style.setProperty('right', '-75%');
	document.querySelector("div#wheelTileDeluxe div.wheel-element").style.setProperty('z-index', '2');
	document.querySelector("div#wheelTileBasic div.wheel-element").style.setProperty('z-index', '0');
	document.querySelector("div#wheelTileDeluxe").style.setProperty('width', '60%');
	document.querySelector("div#wheelTileBasic").style.setProperty('width', '40%');
	document.querySelector("div#bottomUI").style.setProperty('bottom', '-35px');
	
}

function s2wBasicWheelInit(){
	// Remove event listeners that could mess with the focus.
	document.getElementById('wheelTileBasic').removeEventListener('mouseenter', s2wBasicWheelFocus);
	document.getElementById('wheelTileBasic').removeEventListener('mouseleave', s2wClearWidgetStyles);
	document.getElementById('wheelTileDeluxe').removeEventListener('mouseenter', s2wDeluxeWheelFocus);
	document.getElementById('wheelTileDeluxe').removeEventListener('mouseleave', s2wClearWidgetStyles);
	
	
	// Hide other UI
	document.querySelector("div#bottomUI").style.setProperty('opacity', '0');
	document.querySelector("#wheelTileDeluxe").style.setProperty('opacity', '0');
	document.querySelector("#s2wLogoDeluxe").style.setProperty('opacity', '0');
}

function s2wOnLoad(){
	document.querySelector('div.s2w-play-btn-container').style.setProperty('display','none');
}
	
function s2wClearWidgetStyles(){

	document.querySelector("div#wheelTileBasic div.wheel-element").style='';
	document.querySelector("div#wheelTileDeluxe div.wheel-element").style='';
	document.querySelector("div#wheelTileBasic").style='';
	document.querySelector("div#wheelTileDeluxe").style='';
	document.querySelector("div#bottomUI").style='';
	document.querySelector("#s2wLogoDeluxe").style='';
	document.querySelector("#s2wLogo").style='';
	
}
	