var WeatherApp, Canvas, CanvasArtisan, GeoLocation, s, ctx;

WeatherApp = {

	backdrops: {
			'dawn': 		'',
			'morning': 		'',
			'afternoon': 	'',
			'day': 			'#199eda',
			'dusk':			'',
			'night': 		'#071a4c'		
	},

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

	elements: {
		'cloud': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925" fill="#fff" transform="matrix(.77976 0 0 .78395-299.99-418.63)"/></svg>',
		'rain': '',
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
		s.welcome.text('Please allow location access.');
		s.toggleButton.text('Switch Units');
		s.footer.text('Powered by DarkSky API');
		s.homeAnchor.text('pf').attr('href', 'http://www.phlfvry.com/');


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

	updateLocation: function(apiCall) {
		console.log('Update Location: ' + apiCall);
		$.getJSON(apiCall, function(data) {
			s.title.text(
				data.results[0].address_components[2].short_name 
				+' '+
				data.results[0].address_components[4].short_name
			);
			$(document).attr('title', 
				data.results[0].address_components[2].short_name + 
				' - Weather Conditions ');
		});
	},

	updateWeather: function(apiCall) {
		console.log('Update Weather: ' + apiCall);
		$.getJSON(apiCall, function(data) {
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

GeoLocation = {
	timeOfDay: 'day'
};

Canvas = {

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
		Canvas.refresh();
	},

	refresh: function() {
		CanvasArtisan.draw();
	}
};

// just clouds for now...
var image = new Image();
image.src = 'data:image/svg+xml;base64,' + window.btoa(WeatherApp.elements.cloud);

CanvasArtisan = {

	refreshBackground: function(color) {
		ctx.fillStyle = color ? color : WeatherApp.backdrops[GeoLocation.timeOfDay];
		ctx.fillRect('0','0', innerWidth, innerHeight);
	},

	// main loop
	draw: function() {
		CanvasArtisan.refreshBackground();
		ctx.drawImage(image, 35, 5, 16, 16);
		ctx.drawImage(image, 10, 0, 16, 16);
		ctx.translate(0.05,0);
		window.requestAnimationFrame(CanvasArtisan.draw);
	}
};



$(function() {
	Canvas.init();
	WeatherApp.init();
});

