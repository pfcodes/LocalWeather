'use strict'

let WeatherApp,
	GeoLocation,
	Elements,
	Canvas, 
	CanvasArtisan,
	ctx,
	$DOM

WeatherApp = {
	api: {
		weather: 'https://api.darksky.net/forecast/165abf3d9f0478fd6a5d0d053a8e52c8/',
		maps: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
	},

	dom: {
		title: $('#label_AppTitle'),
		subtitle: $('#label_AppSubtitle'),
		footer: $('#label_FooterText'),
		welcome: $('#label_WelcomeMessage'),
		temperature: $('#label_Temperature'),
		temperatureLabel: $('#label_TempMetric'),
		toggleButton: $('#btn_MetricToggle'),
		homeAnchor: $('#link_Homepage')
	},

	init: function() {
		$DOM = this.dom
		this.bindActions()
		this.start()
	},

	bindActions: function() {
		$DOM.toggleButton.on('click', this.toggleTemperatureMetric)
	},

	start: function() {
		$DOM.title.text('Local Weather')
		$DOM.welcome.text('Please allow location access.')
		$DOM.toggleButton.text('Switch Units')
		$DOM.footer.text('Powered by DarkSky API')
		$DOM.homeAnchor.text('pf').attr('href', 'http://www.phlfvry.com/')

		try {
			if (!navigator.geolocation) throw 'Unsupported Browser'
			navigator.geolocation.getCurrentPosition(this.getLocationBasedData)
		} catch (e) {
			$DOM.welcome.text('Error: ' + e)
			console.log('Error: ' + e)
		}
	},

	getLocationBasedData: function(location) {
		$DOM.welcome.text('Loading...')
		const apiQuery = location.coords.latitude+','+location.coords.longitude
		WeatherApp.updateLocation(WeatherApp.api.maps + apiQuery)
		WeatherApp.updateWeather(WeatherApp.api.weather + apiQuery)
	},

	updateLocation: function(apiCall) {
		console.log('Update Location: ' + apiCall)
		$.getJSON(apiCall, function(data) {
			$DOM.title.text(
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
			$DOM.welcome.remove()
			$DOM.subtitle.text(data.currently.summary)
			$DOM.temperature.text(Math.round(data.currently.temperature))
			$DOM.toggleButton.css('visibility', 'visible')
			$DOM.temperatureLabel.html('&deg;F')
		})
	},

	toggleTemperatureMetric: function() {
		const label = $DOM.temperatureLabel
		let newTemperature, currentTemperature
		currentTemperature = $DOM.temperature.text()
		if (label.text() === '°F') {
			// converts to celsius
			newTemperature = Math.round((currentTemperature - 32) * 0.5556)
			label.html('&deg;C')
		} else {
			// converts to fahrenheit
			newTemperature = Math.round((currentTemperature * 1.8) + 32)
			label.html('&deg;F')
		}
		$DOM.temperature.text(newTemperature)
	}
}

const elementImage = new Image()
Elements = {
	cloud: {
		baseSize: {
			w: 16,
			h: 16
		},
		image: 'cloud.svg',
	},

	raindrop: {
		baseSize: {
			w: 16,
			h: 16
		},
		image: 'raindrop.svg'
	}
}

GeoLocation = {
	// TODO: turn this into a function
	timeOfDay: 'night'
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

// TODO: make these objects
var clouds = [
	{
		x: 5,
		y: 5,
		xSpeed: 0.09,
		ySpeed: 0,
		scale: 2
	},
	{
		x: 51,
		y: 2,
		xSpeed: 0.05,
		ySpeed: 0,
		scale: 1.5
	}
]

var raindrops = [
	{
		x: 5,
		y: 0,
		ySpeed: 0.5,
		scale: 0.3
	}, 
	{
		x: 51,
		y: 0,
		ySpeed: 0.5,
		scale: 0.3
}]

CanvasArtisan = {
	backdrops: {
		dawn: '',
		morning: '',
		afternoon: '',
		day: '#199eda',
		dusk:'',
		night: '#071a4c'		
	},

	refreshBackground: function(color) {
		ctx.fillStyle = color || this.backdrops[GeoLocation.timeOfDay]
		ctx.fillRect(0, 0, innerWidth, innerHeight)
	},

	drawStaticElement: function(obj) {
		// TODO: code to add sun, moon, etc.
	},

	drawAnimatedElements: function() {
		const e = Elements.raindrop;
		elementImage.src = `./elements/${e.image}`
		for (let i = 0; i < raindrops.length; i++){
			ctx.drawImage(elementImage, raindrops[i].x, raindrops[i].y, raindrops[i].w, raindrops[i].h)
			raindrops[i].x += raindrops[i].xSpeed || 0
			raindrops[i].y += raindrops[i].ySpeed || 0
			raindrops[i].w = e.baseSize.w * raindrops[i].scale || 1
			raindrops[i].h = e.baseSize.h * raindrops[i].scale || 1
		}
	}, 

	// main loop
	drawScene: function() {
		CanvasArtisan.refreshBackground()
		CanvasArtisan.drawAnimatedElements()
		window.requestAnimationFrame(CanvasArtisan.drawScene)
	}
}

$(function() {
	Canvas.init()
	WeatherApp.init()
})