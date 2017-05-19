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
 *		- Temperature conversion functions and change style.
 *		- Reorganize and clean up code (make more DRY).
 *		- Add powered by Darksky API label.
 *		- Obtain SSL Certificate to ensure crossbrowser compatibility with geolocation
 *		  with navigator.geolocation.
 *		- Get new API key after testing.
 *		- Integrate into portfolio website.
 *  
 */

APP_VERSION = 0.9;
HOME_URL = 'http://www.phlfvry.com/';

WEATHER_API_BASEURL = 'https://api.darksky.net/forecast/';
WEATHER_API_KEY = '165abf3d9f0478fd6a5d0d053a8e52c8'; 
WEATHER_API_FULLURL = WEATHER_API_BASEURL + WEATHER_API_KEY;

GOOGLEMAPS_API_BASEURL = 'https://maps.googleapis.com/maps/api/geocode/json?';

LABEL_APP_HEADER = 'Weather';
LABEL_HOME_URL = 'by &lt; pf / &gt;';
LABEL_TOGGLE_BTN = 'Toggle';
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
	
	hide('btn', 'MetricToggle'); // make hidden by default
	var toggleButton = get('btn', 'MetricToggle');
	toggleButton.innerHTML = LABEL_TOGGLE_BTN;
	toggleButton.addEventListener('click', toggleTemperatureMetric);

	set('label','HeaderTitle', LABEL_APP_HEADER);
	set('label','Version', 'version ' + APP_VERSION);
	
	// display welcome message
	set('label','WelcomeMessage',
		'Please allow location access' 
	);

	promptUserForLocation();
}

function promptUserForLocation() {
	 try {	 	
	 	var navObject = navigator.geolocation;
	 	if (!navObject) throw 'Unsupported Browser';
		navObject.getCurrentPosition(getJSONFromAPI);
	} catch(e) {	
		set(label, 'WelcomeMessage',
			'Error: Browser is not supported. Try another one.'
		);
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
	var object = get(type, id);
	object.innerHTML = newValue;
}

function show(type, id) {
	get(type, id).style.visibility = 'visible';
}

function hide(type, id) {
   get(type, id).style.visibility = 'hidden';
}

function remove(type, id) {
	get(type, id).remove();
}

function setTemperature(value) {
	set('label', 'Temperature', value);
}

function setLocation(value) {
	set('label', 'UserLocation', value);
}

function getJSONFromAPI(location) {
	var latitude = location.coords.latitude;
	var longitude = location.coords.longitude;	
	var weatherapi = WEATHER_API_BASEURL + WEATHER_API_KEY + '/' + latitude + ',' + longitude;
 	var googlemapsapi = GOOGLEMAPS_API_BASEURL + 'latlng='+latitude+','+longitude;

	set('label', 'WelcomeMessage', 'Loading...');

	// call GoogleMaps API for location information
	var cityandstate = '';
	var googlemapsxhr = new XMLHttpRequest();
	googlemapsxhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			data = JSON.parse(this.responseText);
			cityname = data.results[0].address_components[2].short_name;
			statename = data.results[0].address_components[4].short_name;
			cityandstate = cityname + ', ' + statename;
			setLocation(cityandstate);
		}
	}
	googlemapsxhr.open("GET", googlemapsapi, true);
	googlemapsxhr.send();

	// call Weather API for weather information
	var weatherxhr = new XMLHttpRequest();
	weatherxhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			remove('label', 'WelcomeMessage');

			data = JSON.parse(this.responseText);
			setTemperature(Math.round(data.currently.temperature));
			
			show('btn', 'MetricToggle');
			toggleTemperatureMetric();
		}
	}
	weatherxhr.open("GET", weatherapi, true);
	weatherxhr.send();
}

