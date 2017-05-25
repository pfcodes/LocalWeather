 var weatherApp, s;

weatherApp = {

	properties: {
		title: $('#label_AppTitle'),
		subtitle: $('#label_AppSubtitle'),
		version: $('#label_Version'),
		welcome: $('#label_WelcomeMessage'),
		temperature: $('#label_Temperature'),
		toggleButton: $('#btn_MetricToggle'),
		homeAnchor: $('#link_Homepage'),

		api: {
			weather: 'https://api.darksky.net/forecast/165abf3d9f0478fd6a5d0d053a8e52c8/',
			maps: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
		}, 

		LABEL_FAHRENHEIT: '&#176;F',
		LABEL_CELSIUS: '&#176;C',
	},

	init: function() {
		s = this.properties;
		this.start();
	},

	start: function() {
		s.version.text('1.5');
		s.title.text('Local Weather');
		s.homeAnchor.attr('href', 'http://www.phlfvry.com/');
		s.homeAnchor.text('< pf />');
		s.welcome.text('Please allow location access.');
		s.toggleButton.text('Switch Units');
		s.toggleButton.on('click', this.toggleTemperatureMetric);

		try {
			if (!navigator.geolocation) throw 'Unsupported Browser';
			navigator.geolocation.getCurrentPosition(this.getLocationBasedData);
		} catch (e) {
			s.welcome.text('Unsupported Browser');
			console.log('Error: ' + e);
		}
	},

	getLocationBasedData: function(location) {
		s.welcome.text('Loading...');

		var api = weatherApp.properties.api;
		var apiQuery = location.coords.latitude+','+location.coords.longitude;

		weatherApp.updateLocation(api.maps + apiQuery);
		weatherApp.updateWeather(api.weather + apiQuery);
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
			s.title.text(cityname + ' ' + statename);
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
			s.welcome.remove();
			var data = JSON.parse(this.responseText);
			s.subtitle.text(data.currently.summary);
			s.temperature.text(Math.round(data.currently.temperature));
			s.toggleButton.css('visibility', 'visible');
			set('label', 'TempMetric', weatherApp.properties.LABEL_FAHRENHEIT);
			}
		}
		xhr.open('GET', param, true);
		xhr.send();
	},

	toggleTemperatureMetric: function() {
		var label = get('label', 'TempMetric');
		var o = get('label', 'Temperature').innerHTML;
		var n;

		if (label.innerHTML == '°F') {
			n = Math.round((o - 32) * 0.5556);
			set('label', 'TempMetric', weatherApp.properties.LABEL_CELSIUS);
		} else {
			// convert to fahrenheit
			n = Math.round((o * 1.8) + 32);
			set('label', 'TempMetric', weatherApp.properties.LABEL_FAHRENHEIT);
		}
		s.temperature.text(n);
	}
};

$(function() {
	weatherApp.init();
});

// Convenience functions -- add to a namespace
function get(type, id) { return document.getElementById(type + '_' + id); }
function set(type, id, newValue) { get(type, id).innerHTML = newValue; }
function show(type, id)	{ get(type, id).style.visibility = 'visible'; }
function hide(type, id) { get(type, id).style.visibility = 'hidden'; }
function remove(type, id) { get(type, id).remove(); }

