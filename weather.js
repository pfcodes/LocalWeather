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
 *  
 */

APP_VERSION 			= '1.0';
HOME_URL 				= 'http://www.phlfvry.com/';

WEATHER_API_BASEURL 	= 'https://api.darksky.net/forecast/';
WEATHER_API_KEY 		= '165abf3d9f0478fd6a5d0d053a8e52c8'; 
WEATHER_API_FULLURL 	= WEATHER_API_BASEURL + WEATHER_API_KEY;

GOOGLEMAPS_API_BASEURL 	= 'https://maps.googleapis.com/maps/api/geocode/json?';

LABEL_APP_HEADER 		= 'Weather';
LABEL_TOGGLE_BTN 		= 'Switch Units'; 
LABEL_FAHRENHEIT 		= '&#176;F'; // °F
LABEL_CELSIUS 			= '&#176;C'; // °C
LABEL_HOME_URL 			= 'by &lt; pf / &gt;'; // < pf / >

$(document).ready(function() {
	weatherApp();
});

function weatherApp() {
	// initialize DOM objects with constants	
	set('label','HeaderTitle', LABEL_APP_HEADER);
	set('label','Version', 'version ' + APP_VERSION);
	
	var linkToHome = get('link', 'Homepage');
	linkToHome.href = HOME_URL;
	linkToHome.innerHTML = LABEL_HOME_URL;
	
	var toggleButton = get('btn', 'MetricToggle');
	toggleButton.innerHTML = LABEL_TOGGLE_BTN;
	toggleButton.addEventListener('click', toggleTemperatureMetric);

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
 		navObject.getCurrentPosition(getJSONFromAPI); // call getJSONFromAPI() with location info
	} catch(e) {	
		set(label, 'WelcomeMessage',
			'Error: Browser is not supported. Try another one.'
		);
		console.log('Error: ' + e)	
	}
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
		if (this.readyState == 4 && this.status == 200) { // succesful request GoogleMaps API
			data = JSON.parse(this.responseText);
			cityname = data.results[0].address_components[2].short_name;
			statename = data.results[0].address_components[4].short_name;
			cityandstate = cityname + ', ' + statename;
			setLocation(cityandstate); // assign value to DOM
		}
	}
	googlemapsxhr.open("GET", googlemapsapi, true);
	googlemapsxhr.send();

	// call Weather API for weather information
	var weatherxhr = new XMLHttpRequest();
	weatherxhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) { // succesful request from Weather API
			remove('label', 'WelcomeMessage');

			data = JSON.parse(this.responseText);
			setTemperature(Math.round(data.currently.temperature)); // assign value to DOM
			
			show('btn', 'MetricToggle');
			set('label','TempMetric', LABEL_FAHRENHEIT); // shows unit metric for the first time
		}
	}
	weatherxhr.open("GET", weatherapi, true);
	weatherxhr.send();
}

function toggleTemperatureMetric() {
	var label = get('label','TempMetric');
	
	if (label.innerHTML == '°F') {
		// convert to celsius
		var oldValue = get('label','Temperature').innerHTML;
		var newValue = Math.round((oldValue - 32) * 0.5556);

		set('label', 'Temperature', newValue);
		set('label', 'TempMetric', LABEL_CELSIUS);
	} else {
		// convert to fahrenheit
		var oldValue = get('label','Temperature').innerHTML;
		var newValue = Math.round((oldValue * 1.8) + 32);
		
		set('label', 'Temperature', newValue);
		set('label', 'TempMetric', LABEL_FAHRENHEIT);
	}
}

// Convenience functions
function get(type, id) { return document.getElementById(type + '_' + id); }
function set(type, id, newValue) { get(type, id).innerHTML = newValue; }

function show(type, id)	{ get(type, id).style.visibility = 'visible'; }
function hide(type, id) { get(type, id).style.visibility = 'hidden'; }
function remove(type, id) { get(type, id).remove(); }

function setTemperature(value) { set('label', 'Temperature', value); }
function setLocation(value) { set('label', 'UserLocation', value); }

