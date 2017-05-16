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

APP_VERSION = 0.01;
HOME_URL = 'http://www.phlfvry.com/';

API_URL = 'https://api.darksky.net/forecast/';
API_KEY = '';

LABEL_APP_HEADER = 'Weather';
LABEL_HOME_URL = 'pf';
LABEL_TOGGLE_BTN = 'Convert';
LABEL_FAHRENHEIT = '&#8457;';
LABEL_CELSIUS = '&#8451;';

$(document).ready(function() {
	weatherApp();
});

function weatherApp() {
	// initializers	
	var linkToHome = get('link', 'Homepage');
	linkToHome.href = HOME_URL;
	linkToHome.innerHTML = LABEL_HOME_URL;
	
	hide('btn', 'MetricToggle'); // hide until we're sure app starts
	var toggleButton = get('btn', 'MetricToggle');
	toggleButton.innerHTML = LABEL_TOGGLE_BTN;
	toggleButton.addEventListener('click', toggleTemperatureMetric);

	set('label','HeaderTitle', LABEL_APP_HEADER);
	set('label','Version',  APP_VERSION);

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
		// convert label_Temperature DOM to celsius
		set('label', 'TempMetric', LABEL_CELSIUS);
	} else {
		// convert label_Temperature DOM to fahrenheit
		set('label', 'TempMetric', LABEL_FAHRENHEIT);
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

function show(type, id) {
	get(type, id).style.visibility = 'visible';
}

function hide(type, id) {
   get(type, id).style.visibility = 'hidden';
}

function setTemperature(value) {
	set('label', 'Temperature', value);
}

function setLocation(value) {
	set('label', 'UserLocation', value);
}

function getJSONFromAPI(location) {
	var api = API_URL + API_KEY;
	
	var latitude = location.coords.latitude;
	var longitude = location.coords.longitude;	
	api += '/' + latitude + ',' + longitude;
	
	show('btn','MetricToggle');
	toggleTemperatureMetric();
	setTemperature(32); // for now
	setLocation('{' + latitude + ',' + longitude + '}');
	// call API
	// get JSON from API


	// update page elements
}

