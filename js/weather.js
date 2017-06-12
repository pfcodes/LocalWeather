'use strict'

var WeatherApp,
	Elements,
	Canvas, 
	CanvasArtisan, 
	GeoLocation, 
	s, 
	ctx

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
			maps: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
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
		s = this.properties
		this.bindActions()
		this.start()
	},

	bindActions: function() {
		s.toggleButton.on('click', this.toggleTemperatureMetric)
	},

	start: function() {
		s.title.text('Local Weather')
		s.welcome.text('Please allow location access.')
		s.toggleButton.text('Switch Units')
		s.footer.text('Powered by DarkSky API')
		s.homeAnchor.text('pf').attr('href', 'http://www.phlfvry.com/')

		try {
			if (!navigator.geolocation) throw 'Unsupported Browser'
			navigator.geolocation.getCurrentPosition(this.getLocationBasedData)
		} catch (e) {
			s.welcome.text('Error: ' + e)
			console.log('Error: ' + e)
		}
	},

	getLocationBasedData: function(location) {
		s.welcome.text('Loading...')
		var apiQuery = location.coords.latitude+','+location.coords.longitude
		WeatherApp.updateLocation(s.api.maps + apiQuery)
		WeatherApp.updateWeather(s.api.weather + apiQuery)
	},

	updateLocation: function(apiCall) {
		console.log('Update Location: ' + apiCall)
		$.getJSON(apiCall, function(data) {
			s.title.text(
				data.results[0].address_components[2].short_name 
				+' '+
				data.results[0].address_components[4].short_name
			)
			$(document).attr('title', 
				data.results[0].address_components[2].short_name + 
				' - Weather Conditions ')
		})
	},

	updateWeather: function(apiCall) {
		console.log('Update Weather: ' + apiCall);
		$.getJSON(apiCall, function(data) {
			s.welcome.remove()
			s.subtitle.text(data.currently.summary)
			s.temperature.text(Math.round(data.currently.temperature))
			s.toggleButton.css('visibility', 'visible')
			s.temperatureLabel.html('&deg;F')
		})
	},

	toggleTemperatureMetric: function() {
		var newTemperature, currentTemperature
		currentTemperature = s.temperature.text()
		var label = s.temperatureLabel
		if (label.text() == '°F') {
			// converts to celsius
			newTemperature = Math.round((currentTemperature - 32) * 0.5556)
			label.html('&deg;C')
		} else {
			// converts to fahrenheit
			newTemperature = Math.round((currentTemperature * 1.8) + 32)
			label.html('&deg;F')
		}
		s.temperature.text(newTemperature)
	}
}

var elementImage = new Image()

Elements = {
	cloud: {
		baseSize: {
			w: 16,
			h: 16
		},	// pixels
		image: 'cloud.svg',
	}
}

GeoLocation = {
	timeOfDay: 'day'
}

Canvas = {
	settings: {
		control: $('#canvas')
	},
	init: function() {
		this.bindActions()
		ctx = this.settings.control[0].getContext('2d')
		this.resizeCanvas()
	},
	bindActions: function() {
		$(window).on('resize', this.resizeCanvas)
	},
	resizeCanvas: function() {
		Canvas.settings.control.width(innerWidth)
		Canvas.settings.control.height(innerHeight)
		Canvas.refresh()
	},
	refresh: function() {
		CanvasArtisan.drawScene()
	}
}

var clouds = [{
		x: 5,
		y: 5,
		speed: 0.09,
		scale: 2
		}, {
		x: 51,
		y: 2,
		speed: 0.05,
		scale: 1.5
}]

CanvasArtisan = {
	refreshBackground: function(color) {
		ctx.fillStyle = color ? color : WeatherApp.backdrops[GeoLocation.timeOfDay]
		ctx.fillRect(0, 0, innerWidth, innerHeight)
	},
	drawStaticElement: function() {
		// sun, moon
	},
	animateElements: function() {
		// just clouds for now...
		let e = Elements.cloud;
		elementImage.src = `./elements/${e.image}`
		for (let i = 0; i < clouds.length; i++){
			ctx.drawImage(elementImage, clouds[i].x, clouds[i].y, clouds[i].w, clouds[i].h)
			clouds[i].x += clouds[i].speed
			clouds[i].y = clouds[i].y
			clouds[i].w = e.baseSize.w * clouds[i].scale
			clouds[i].h = e.baseSize.h * clouds[i].scale
		}
	}, 
	// main loop
	drawScene: function() {
		CanvasArtisan.refreshBackground()
		CanvasArtisan.animateElements()
		window.requestAnimationFrame(CanvasArtisan.drawScene)
	}
}

$(function() {
	Canvas.init()
	WeatherApp.init()
})