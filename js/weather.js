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
    welcome: $('#label_WelcomeMessage'),
    temperature: $('#label_Temperature'),
    temperatureLabel: $('#label_TempMetric'),
    toggleButton: $('#btn_MetricToggle')
  },

  init: function() {
    $DOM = this.dom
    this.bindActions()
    this.setDOMLabels()
  },

  bindActions: function() {
    $DOM.toggleButton.on('click', this.toggleTemperatureMetric)
  },

  setDOMLabels: function() {
    $DOM.title.text('Local Weather')
    $DOM.welcome.text('Please allow location access.')
    $DOM.toggleButton.text('Switch Units')
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
      // convert to celsius
      newTemperature = Math.round((currentTemperature - 32) * 0.5556)
      label.html('&deg;C')
    } else {
      // convert to fahrenheit
      newTemperature = Math.round((currentTemperature * 1.8) + 32)
      label.html('&deg;F')
    }

    $DOM.temperature.text(newTemperature)
  }
}

const elementImage = new Image()

WeatherElements = {
  wereGenerated: false,
  elementArray: [],
  elementTypes: {
    cloud: {
      image: 'cloud.svg',
      width: 16,
      height: 16,
      xSpeed: 0.1
    },
    raindrop: {
      image: 'raindrop.svg',
      width: 16,
      height: 16,
      ySpeed: 3
    }
  },

  generate: function () {
    const elementCount = 2;
    let t = 'cloud'

    elementImage.src = `./elements/${this.elementTypes[t].image}`
    //let keys = Object.getOwnPropertyNames(this.elementTypes[t])

    for (let i = 0; i < elementCount; i ++) {
      this.elementArray.push([
        this.elementTypes[t], {
          x: 0+(16*i*3),
          y: 0,
          scale: 2
        }]
      )
    }
    this.wereGenerated = true;
  },
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
      // TODO: add support for IP Lookup
      if (!navigator.geolocation) throw 'Unsupported Browser'
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

  // TODO: Call CanvasArtisan to update new background color
  setTimeOfDay: function(time){
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

// TODO: add remaining colors and then turn them into gradients
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
    ctx.fillStyle = this.backdrops[GeoLocation.attributes.timeOfDay] || this.backdrops['day']
    ctx.fillRect(0, 0, innerWidth, innerHeight)
  },
  // TODO: code to add sun, moon, etc.
  drawStaticElement: function(obj) {
    //
  },

  drawAnimatedElements: function() {
    if (WeatherElements.wereGenerated) {
      let e = WeatherElements.elementArray
      let len = e.length
      for (let i = 0; i < len; i++) {
        e[i][1].x += e[i][0].xSpeed || e[i][1].x
        e[i][1].y += e[i][0].ySpeed || e[i][1].y
        e[i][0].w = e[i][0].width ? e[i][0].width * e[i][1].scale : 16
        e[i][0].h = e[i][0].height ? e[i][0].height * e[i][1].scale : 16
        ctx.drawImage(elementImage, e[i][1].x, e[i][1].y, e[i][0].w, e[i][0].h)
      }
    } else {
      WeatherElements.generate()
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