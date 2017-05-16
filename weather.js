/*
 *
 *	weather.js 
 *	by phlfvry
 *  version: 0.01
 *
 *
 */

function get_location() {
	console.log("get_location() called");

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showWeather);
	} else {
		console.log("Geolocation disabled, denied by user, or not supported.");
		
		// update body with error message
	}
}

function showWeather(location) {
	console.log("showWeather() called with param: " + location);	
	
	// capture and shorten location variables		
	var latitude = location.coords.latitude;
	var longtitude = location.coords.longtitude;

	// DarkSky API
	var API = "https://api.darksky.net/forecast/";
	var API_Key = "typeAPIkeyhere";
	var API_Params = API_Key + "/" + latitude + "," + longtitude;
	
	// update page elemts with results from API
}

$(document).ready(function() {
	console.log("Will call get_location()");
	
	// update page title with version
	get_location();
});

