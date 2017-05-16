/*
 *
 *  A script which gets users location and returns the local
 *  weather
 *
 *
 *	weather.js 
 *	
 *
 *	by phlfvry
 *
 *  Copyright 2017. All Rights Reserved.
 *
 *	TODO:
 *		- Write code to modify DOM objects
 *		- Reorganize and clean up code.
 *		- Obtain SSL Certificate to ensure crossbrowser compatibility
 *		  with navigator.geolocation.
 *		- Register for; and, apply  DarkSky API.
 *		- Integrate into Portfolio Website
 *  
 */

API_URL = "https://api.darksky.net/forecast/";
API_KEY = '';
APP_VERSION = 0.01;

FAHRENHEIT = '&#8457;';
CELSIUS = '&#8451;';

$(document).ready(function() {
	weatherApp();
});

function weatherApp() {
	update('label','Version', 'Version: ' + APP_VERSION);
	document.getElementById('btn_MetricToggle').addEventListener('click', toggleTemperatureMetric);

	promptUserForLocation();
}

function promptUserForLocation() {
	 try {
	 	
	 	var navObject = navigator.geolocation;
	 	if (!navObject) throw 'Unsupported Browser';
	 	
		navObject.getCurrentPosition(callAPIWithLocation);
	 	 
	} catch(e) {
		console.log('Error: ' + e)	
	}
}

function toggleTemperatureMetric() {
	update('label', 'TempMetric', CELSIUS);
}

function update(element, id, newValue) {
	var object = document.getElementById(element + '_' + id);
	object.innerHTML = newValue;
}

function callAPIWithLocation(location) {
	var latitude = location.coords.latitude;
	var longitude = location.coords.longitude;
	
	var api = API_URL + API_KEY +  '/' + latitude + ',' + longitude;
    
	// call API
	// get response from API
	// update page elements with results from API
}

