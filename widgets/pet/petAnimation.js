/* Pet animations and keyframe definitions */
const pet_head_bounds = [256,128]; // Define bounds of image in px; format X, Y

// ----- PET ANIMATION VARIABLES
let is_pet_idle = true; // Is the pet idling?
let is_pet_trick = false; // Is the pet engaged in a trick?
let is_pet_emoting = false; // Is the pet in an emote state?
let pet_headspace = 'pet_head_state_front'; // Let the rest of our functions know what keyframe we're on.

// ----- PET HEAD KEYFRAME DEFINITIONS

const pet_head_state_front = [0,0,'pet_head_state_front'];
const pet_head_state_front_left = [-64,0,'pet_head_state_front_left'];
const pet_head_state_front_right = [-192,-64,'pet_head_state_front_right'];
const pet_head_state_left = [-128,0,'pet_head_state_left'];
const pet_head_state_right = [-128,-64,'pet_head_state_right'];
const pet_head_state_back = [0,-64,'pet_head_state_back'];
const pet_head_state_back_left = [-64,-64,'pet_head_state_back_left'];
const pet_head_state_back_right = [-192,0,'pet_head_state_back_right'];

// ----- SUPPORTING FUNCTIONS FOR ANIMATION

// Set the head image to coordinates defined by our keyframe definitions
function setPetHead(state){
	document.getElementById('petHead').style.backgroundPosition = ""+state[0]+"px "+state[1]+"px";
	pet_headspace = state[2];
}

// Set emotion image above pet to a specific image.
function setPetEmotion(frame_path, args='center center no-repeat'){
	document.getElementById("petEmoteSpace").style.background = "url("+frame_path+")"+args;
}

// Handle delays through a JS promise.
function petDelay(x){
	return new Promise((resolve) => { setTimeout(() => { resolve(x); }, 4000)});
}

// Engage the pet in an idle animation every while.
async function handlePetIdleAnimation(){
	while(is_pet_idle){
		await petDelay();
		await petAnimationIdle();
		
	}
}
	

// ----- PET ANIMATIONS

// Unlike other animations, we do not need to rely on a set motion of keyframes. In fact,
// We'll get a little random with it...
function petAnimationIdle(){
	let pet_state_randomization = Math.ceil(Math.random()*4);
	if(pet_headspace == 'pet_head_state_front'){
		if(pet_state_randomization == 1){ setPetHead(pet_head_state_front_left); }
		else if(pet_state_randomization == 2){ setPetHead(pet_head_state_front_right); }
	}
	else if(pet_headspace == 'pet_head_state_front_left'){
		if(pet_state_randomization == 1){ setPetHead(pet_head_state_left); }
		else if(pet_state_randomization == 2){ setPetHead(pet_head_state_front); }
	}
	else if(pet_headspace == 'pet_head_state_front_right'){
		if(pet_state_randomization == 1){ setPetHead(pet_head_state_right); }
		else if(pet_state_randomization == 2){ setPetHead(pet_head_state_front); }
	}
	else if(pet_headspace == 'pet_head_state_right'){
		if(pet_state_randomization != 1){ setPetHead(pet_head_state_front_right); }
		// else if(pet_state_randomization == 2){ setPetHead(pet_head_state_back_right); }
	}
	else if(pet_headspace == 'pet_head_state_left'){
		if(pet_state_randomization != 1){ setPetHead(pet_head_state_front_left); }
		// else if(pet_state_randomization == 2){ setPetHead(pet_head_state_back_left); }
	}else{ // Reset to front if we get in trouble.
		setPetHead(pet_head_state_front);
	}
}

// Display eating animation above pet head for ~3s. 
function petEmoteEat(){
	// Load images in immediately with frame 1 still showing.
	setPetEmotion('./images/emote_eat_3.png');
	setPetEmotion('./images/emote_eat_2.png');
	setPetEmotion('./images/emote_eat_1.png');
	setTimeout( function(){ document.getElementById("petEmoteSpace").style.opacity = "1"}, 10);
	
	// Set emote state to true.
	is_pet_emoting = true;
	
	// Begin proper animation with jank setTimeout.
	setTimeout( function(){ setPetEmotion('./images/emote_eat_2.png') }, 500);
	setTimeout( function(){ setPetEmotion('./images/emote_eat_3.png') }, 1000);
	setTimeout( function(){ setPetEmotion('./images/emote_eat_1.png') }, 1500);
	setTimeout( function(){ setPetEmotion('./images/emote_eat_2.png') }, 2000);
	setTimeout( function(){ document.getElementById("petEmoteSpace").style.opacity = "0" }, 2000);
	setTimeout( function(){ setPetEmotion('./images/emote_eat_3.png') }, 2500);
	setTimeout( function(){ setPetEmotion('./images/emote_eat_1.png') }, 3000);
	setTimeout( function(){ setPetEmotion('./images/emote_eat_2.png') }, 3500);
	setTimeout( function(){ is_pet_emoting = false; }, 2100);
}


// Display happy emote above pet head for 1 second.
function petEmotePat(){
	// Load images in immediately with frame 1 still showing.
	setPetEmotion('./images/emote_happy.png');
	document.getElementById("petEmoteSpace").style.opacity = "1";
	
	// Set emote state to true.
	is_pet_emoting = true;
	
	// Show animation for 2s using setTimeout
	setTimeout( function(){ is_pet_emoting = false; }, 1000);
	setTimeout( function(){ document.getElementById("petEmoteSpace").style.opacity = "0" }, 1000);
}

// Unused
function petEmoteClean(){
	// Load images in immediately with frame 1 still showing.
	setPetEmotion('./images/emote_clean_3.png');
	setPetEmotion('./images/emote_clean_2.png');
	setPetEmotion('./images/emote_clean_1.png');
	document.getElementById("petEmoteSpace").style.opacity = "1";
	
	// Set emote state to true.
	is_pet_emoting = true;
	
	// We need to expand the bounding box of petEmote for this one...
	document.getElementById("petEmoteSpace").style.height = "70%";
	// Begin proper animation with jank setTimeout.
	setTimeout( function(){ setPetEmotion('./images/emote_clean_2.png'), 'contain center center' }, 1000);
	setTimeout( function(){ setPetEmotion('./images/emote_clean_3.png'), 'contain center center' }, 2000);
	setTimeout( function(){ setPetEmotion('./images/emote_clean_4.png'), 'contain center center' }, 3000);
	setTimeout( function(){ setPetEmotion('./images/emote_clean_5.png'), 'contain center center' }, 4000);
	setTimeout( function(){ document.getElementById("petEmoteSpace").style.opacity = "0" }, 1500);
	setTimeout( function(){ is_pet_emoting = false; }, 1500);
	setTimeout( function(){ document.getElementById("petEmoteSpace").style.height = ""; }, 3500);
}