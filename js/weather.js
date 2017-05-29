var WeatherApp, Canvas, CanvasArtisan, s, ctx;

WeatherApp = {

	properties: {
		api: {
		weather: 'https://api.darksky.net/forecast/165abf3d9f0478fd6a5d0d053a8e52c8/',
		maps: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
		}, 
		title: $('#label_AppTitle'),
		subtitle: $('#label_AppSubtitle'),
		footer: $('#label_FooterText'),
		welcome: $('#label_WelcomeMessage'),
		temperature: $('#label_Temperature'),
		temperatureLabel: $('#label_TempMetric'),
		toggleButton: $('#btn_MetricToggle'),
		homeAnchor: $('#link_Homepage'),
	},

	init: function() {
		s = this.properties;
		this.bindActions();
		this.start();
	},

	bindActions: function() {
		s.toggleButton.on('click', this.toggleTemperatureMetric);
	},

	start: function() {
		
		s.title.text('Local Weather');
		s.footer.text('Powered by DarkSky API');
		s.homeAnchor.attr('href', 'http://www.phlfvry.com/');
		s.homeAnchor.text('< pf />');
		s.welcome.text('Please allow location access.');
		s.toggleButton.text('Switch Units');

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
		$.getJSON(param, function(data) {
			s.title.text(
				data.results[0].address_components[2].short_name+' '+
				data.results[0].address_components[4].short_name
			);
			$(document).attr('title', data.results[0].address_components[2].short_name +
				' - Weather Conditions ');
		});
	},

	updateWeather: function(param) {
		console.log('Update Weather: ' + param);
		$.getJSON(param, function(data) {
			s.welcome.remove();
			s.subtitle.text(data.currently.summary);
			s.temperature.text(Math.round(data.currently.temperature));
			s.toggleButton.css('visibility', 'visible');
			s.temperatureLabel.html('&deg;F');
		});
	},

	toggleTemperatureMetric: function() {
		var newTemperature, currentTemperature;
		currentTemperature = s.temperature.text();
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

var Canvas = {

	settings: {
		control: $('#canvas')
	},

	init: function() {
		this.bindActions();
		ctx = this.settings.control[0].getContext('2d');
		this.resizeCanvas();
	},

	bindActions: function() {
		$(window).on('resize', this.resizeCanvas);
	},

	resizeCanvas: function() {
		Canvas.settings.control.width(innerWidth);
		Canvas.settings.control.height(innerHeight);
		this.drawBackground('day', 'cloudy');
	},

	drawBackground: function(timeOfDay, conditions) {
		var colors = {
			'dawn': 		'',
			'morning': 		'',
			'afternoon': 	'',
			'day': 			'#199eda',
			'dusk':			'',
			'night': 		'#071a4c'
		};

		CanvasArtisan.bgcolor(colors[timeOfDay]);
	}
};

var CanvasArtisan = {
	bgcolor: function(color) {
		ctx.fillStyle = color;
		ctx.fillRect('0','0', innerWidth, innerHeight);
	}
	// stars, clouds, rain, lightning, grass, etc.
};

$(function() {
	Canvas.init();
	WeatherApp.init();
});

