 var WeatherApp, GeoLocation, s;

WeatherApp = {

	properties: {
		
		api: {
			weather: 'https://api.darksky.net/forecast/165abf3d9f0478fd6a5d0d053a8e52c8/',
			maps: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
		}, 

		title: $('#label_AppTitle'),
		subtitle: $('#label_AppSubtitle'),
		version: $('#label_Version'),
		welcome: $('#label_WelcomeMessage'),
		temperature: $('#label_Temperature'),
		temperatureLabel: $('#label_TempMetric'),
		toggleButton: $('#btn_MetricToggle'),
		homeAnchor: $('#link_Homepage'),
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
			s.welcome.text('Error: ' + e);
			console.log('Error: ' + e);
		}
	},

	getLocationBasedData: function(location) {
		s.welcome.text('Loading...');

		var apiQuery = location.coords.latitude+','+location.coords.longitude;

		WeatherApp.updateLocation(s.api.maps + apiQuery);
		WeatherApp.updateWeather(s.api.weather + apiQuery);
	},

	updateLocation: function(param) {
		console.log('Update Location: ' + param);
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
			s.temperatureLabel.html('&deg;F');
			}
		}
		xhr.open('GET', param, true);
		xhr.send();
	},

	toggleTemperatureMetric: function() {
		var newTemperature;
		var currentTemperature = s.temperature.text();
		var label = s.temperatureLabel;
		if (label.text() == '°F') {
			// converts to celsius
			newTemperature = Math.round((currentTemperature - 32) * 0.5556);
			label.html('&deg;C');
		} else {
			// converts to fahrenheit
			newTemperature = Math.round((currentTemperature * 1.8) + 32);
			label.html('&deg;F');
		}
		s.temperature.text(newTemperature);
	}
};

$(function() {
	WeatherApp.init();
});

