/*
 *  by phlfvry
 *  Copyright 2017. All Rights Reserved.
 *  
 */
var weatherApp = {
	constants: function() {	return {
		APP_VERSION: '1.5',
		HOME_URL: 'http://www.phlfvry.com/',

		WEATHER_API_BASEURL: 
		'https://api.darksky.net/forecast/165abf3d9f0478fd6a5d0d053a8e52c8/',
		
		GOOGLEMAPS_API_BASEURL: 
		'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
		
		LABEL_WELCOMEMESSAGE: 'Please allow location access',
		LABEL_APP_HEADER: 'Weather',
		LABEL_TOGGLE_BTN: 'Switch Units',
		LABEL_FAHRENHEIT: '&#176;F',
		LABEL_CELSIUS: '&#176;C',
		LABEL_HOME_URL: '&lt; pf / &gt;',

		LABEL_WELCOME_MESSAGE: 'Please allow location access.'
		};
	}(),

	init: function() {
		set('label','HeaderTitle', this.constants.LABEL_APP_HEADER);
		set('label','Version', 'version ' + this.constants.APP_VERSION);
		
		var linkToHome = get('link', 'Homepage');
		linkToHome.href = this.constants.HOME_URL;
		linkToHome.innerHTML = this.constants.LABEL_HOME_URL;
		
		var toggleButton = get('btn', 'MetricToggle');
		toggleButton.innerHTML = this.constants.LABEL_TOGGLE_BTN;
		toggleButton.addEventListener('click', this.toggleTemperatureMetric);

		set('label','WelcomeMessage', this.constants.LABEL_WELCOME_MESSAGE);
	},

	start: function() {
		try {
			if (!navigator.geolocation) throw 'Unsupported Browser';
			navigator.geolocation.getCurrentPosition(this.getLocationBasedData);
		} catch (e) {
			set('label', 'WelcomeMessage', 'Unsupported Browser');
			console.log('Error: ' + e);
		}
	},

	getLocationBasedData: function(location) {
		set('label', 'WelcomeMessage', 'Loading...');
		var latit = location.coords.latitude;
		var longit = location.coords.longitude;
		var locationapi = weatherApp.constants.GOOGLEMAPS_API_BASEURL;
		var weatherapi = weatherApp.constants.WEATHER_API_BASEURL;
		locationapi += latit+','+longit;
		weatherapi += latit+','+longit;
		weatherApp.updateLocation(locationapi);
		weatherApp.updateWeather(weatherapi);
	},

	updateLocation: function(param) {
		console.log('Update Location: ' + param);
		var cityandstate = '';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
	 		if (this.readyState == 4 && this.status == 200) {	
			data = JSON.parse(this.responseText);
			cityname = data.results[0].address_components[2].short_name;
			statename = data.results[0].address_components[4].short_name;
			cityandstate = cityname + ', ' + statename;
			setLocation(cityandstate);
			}
		};
		xhr.open('GET', param, true);
		xhr.send();

	},

	updateWeather: function(param) {
		console.log('Update Weather: ' + param);
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {	
			if (this.readyState == 4 && this.status == 200) {
			remove('label', 'WelcomeMessage');
			var data = JSON.parse(this.responseText);
			setTemperature(Math.round(data.currently.temperature));
			show('btn', 'MetricToggle');
			set('label', 'TempMetric', weatherApp.constants.LABEL_FAHRENHEIT);
			}
		}
		xhr.open('GET', param, true);
		xhr.send();
	},

	toggleTemperatureMetric: function() {
		var label = get('label', 'TempMetric');
		var o = get('label', 'Temperature').innerHTML;
		var n = 0;

		if (label.innerHTML == '°F') {
			n = Math.round((o - 32) * 0.5556);
			set('label', 'TempMetric', weatherApp.constants.LABEL_CELSIUS);
		} else {
			// convert to fahrenheit
			n = Math.round((o * 1.8) + 32);
			set('label', 'TempMetric', weatherApp.constants.LABEL_FAHRENHEIT);
		}

		setTemperature(n);
	}
};

$(document).ready(function() {
	weatherApp.init();
	weatherApp.start();
});

// Convenience functions -- add to a namespace
function get(type, id) { return document.getElementById(type + '_' + id); }
function set(type, id, newValue) { get(type, id).innerHTML = newValue; }
function show(type, id)	{ get(type, id).style.visibility = 'visible'; }
function hide(type, id) { get(type, id).style.visibility = 'hidden'; }
function remove(type, id) { get(type, id).remove(); }
function setTemperature(value) { set('label', 'Temperature', value); }
function setLocation(value) { set('label', 'UserLocation', value); }

