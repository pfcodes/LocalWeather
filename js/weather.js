'use strict'

let $DOM,
	WeatherApp,
	WeatherElements,
	GeoLocation,
	Canvas, 
	CanvasArtisan,
	ctx

WeatherApp = {
	api: 'https://api.darksky.net/forecast/165abf3d9f0478fd6a5d0d053a8e52c8/',

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
	},

	updateWeather: function(apiCall) {
		console.log(`[WeatherApp]: API call - ${apiCall}`);
		$.getJSON(apiCall, function(data) {
			const d = data.currently
			GeoLocation.setTimeOfDay(d.time)
			$DOM.welcome.remove()
			$DOM.subtitle.text(d.summary)
			$DOM.temperature.text(Math.round(d.temperature))
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
WeatherElements = {
	generate: function() {

	}, 

	cloud: {
		image: 'cloud.svg',
		width: 16,
		height: 16
	},

	raindrop: {
		image: 'raindrop.svg',
		width: 16,
		height: 16
	}
}

GeoLocation = {
	api: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',

	attributes: {
		latitude: '',
		longitude: '',
		cityName: '',
		stateName: '',
		timeOfDay: ''
	},
	
	init: function() {
		try {
			if (!navigator.geolocation) throw 'Unsupported Browser' // TODO: add support for IP Lookup
			navigator.geolocation.getCurrentPosition(this.locate)
		} catch (e) {
			$DOM.welcome.text('Error: ' + e)
			console.log('Error: ' + e)
		}
	},

	locate: function(results) {
		$DOM.welcome.text('Loading...')
		const a = GeoLocation.attributes
		a.latitude = results.coords.latitude
		a.longitude = results.coords.longitude
		const apiCall = `${GeoLocation.api}${a.latitude},${a.longitude}`
		console.log(`[GeoLocation]: API call - ${apiCall}`)
		$.getJSON(apiCall, function(data) {
			const d = data.results[0]
			a.cityName = d.address_components[2].short_name
			a.stateName = d.address_components[4].short_name
			$DOM.title.text(`${a.cityName} ${a.stateName}`)
			$(document).attr('title', `${a.cityName} - Weather Conditions`)
		})
		WeatherApp.updateWeather(`${WeatherApp.api}${a.latitude},${a.longitude}`)
	},

	setTimeOfDay: function(time){
		// TODO: Call CanvasArtisan to update new background color
		console.log(`[GeoLocation]: ${time}`)
	}
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
		scale: 2
	},
	{
		x: 51,
		y: 2,
		xSpeed: 0.05,
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
	// TODO: add remaining colors and then turn them into gradients
	backdrops: {
		dawn: '',
		morning: '',
		afternoon: '',
		day: '#199eda',
		dusk:'',
		night: '#071a4c'		
	},

	refreshBackground: function(color) {
		ctx.fillStyle = this.backdrops[GeoLocation.attributes.timeOfDay] || this.backdrops['day']
		ctx.fillRect(0, 0, innerWidth, innerHeight)
	},

	drawStaticElement: function(obj) {
		// TODO: code to add sun, moon, etc.
	},

	drawAnimatedElements: function() {
		const e = WeatherElements.cloud;
		elementImage.src = `./elements/${e.image}`
		let len = clouds.length
		for (let i = 0; i < len; i++){
			clouds[i].x += clouds[i].xSpeed || 0
			clouds[i].y += clouds[i].ySpeed || 0
			clouds[i].w = e.width ? e.width * clouds[i].scale : 16
			clouds[i].h = e.height ? e.height * clouds[i].scale : 16
			ctx.drawImage(elementImage, clouds[i].x, clouds[i].y, clouds[i].w, clouds[i].h)
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
	GeoLocation.init()
	WeatherApp.init()
})