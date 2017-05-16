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
 *		- JSON interpretor
 *		- Temperature conversion functions
 *		- Reorganize and clean up code.
 *		- Obtain SSL Certificate to ensure crossbrowser compatibility with geolocation
 *		  with navigator.geolocation.
 *		- Register for; and, apply  DarkSky API.
 *		- Integrate into Portfolio Website
 *  
 */

API_URL = 'https://api.darksky.net/forecast/';
API_KEY = '';

APP_VERSION = 0.01;

HOME_URL = 'http://www.phlfvry.com/';

FAHRENHEIT = '&#8457;';
CELSIUS = '&#8451;';

$(document).ready(function() {
	weatherApp();
});

function weatherApp() {
	// initializers
	document.title += ' (v.' + APP_VERSION + ')';
	set('label','Version',  APP_VERSION);
	
	var link = get('link', 'Homepage');
	link.href = HOME_URL;
	
	get('btn','MetricToggle').addEventListener('click', toggleTemperatureMetric);

	promptUserForLocation();
}

function promptUserForLocation() {
	 try {	 	
	 	var navObject = navigator.geolocation;
	 	if (!navObject) throw 'Unsupported Browser';
	 	
		navObject.getCurrentPosition(getJSONFromAPI);
	} catch(e) {
		console.log('Error: ' + e)	
	}
}

function toggleTemperatureMetric() {
	var label = get('label','TempMetric');
	
	if (label.innerHTML == '℉') { // change this
		// convert label_Temperature to celsius
		set('label', 'TempMetric', CELSIUS);
	} else {
		// convert label_Temperature to fahrenheit
		set('label', 'TempMetric', FAHRENHEIT);
	}
}

function get(type, id) {
	return document.getElementById(type + '_' + id);
}

function set(type, id, newValue) {
	// '*' type updates actual element tag
	if (type == '*') {
		var object = document.getElementsByTagName(id);	
	} else {
		var object = get(type, id);
	}
	object.innerHTML = newValue;
}

function getJSONFromAPI(location) {
	var latitude = location.coords.latitude;
	var longitude = location.coords.longitude;
	
	var api = API_URL + API_KEY +  '/' + latitude + ',' + longitude;
	
	set('label','UserLocation', '{' + latitude + ',' + longitude + '}');
	// call API
	// get JSON from API
	// update page elements
}

