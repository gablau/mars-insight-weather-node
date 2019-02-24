# A simple NodeJS interface to [NASA Mars InSight Mission weather API](https://mars.nasa.gov/insight/weather/).


## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save mars-insight-weather-node

If you don't have or don't want to use npm:

    $ cd ~/.node_modules
    $ git clone git://github.com/gab.lau/mars-insight-weather-node.git

---

## Documentation

### Constructor
```javascript
MarsInsightWeather(temperatureUnit, pressureUnit, windSpeedUnit)
```

### Methods

```javascript
request(callback)
```
Make the call to the API to take the data, the call is cached and reused for all other methods, there is an hour limit between two API calls to not overload the service.
Requires a parameter for a `callback` function, see examples



```javascript
getRawData()
```
Returns raw API result without units conversion

```javascript
getConvertedRawData()
```
Returns raw API result with units conversion

```javascript
getSolKeys()
```
Returns all sol keys available

```javascript
getLatestSolKey()
```
Returns latest sol key available

```javascript
getSol(sol_key)
```
Returns sol by `sol_key`

```javascript
getLatestSol()
```
Returns latest sol


### Units of measurement
    Default units: 'C', 'Pa', 'm/s'

	Temperature: 'C', 'F', 'K', 'R'
	Pressure: 'Pa', 'hPa', 'kPa', 'MPa', 'bar', 'torr', 'psi', 'ksi'
	Wind speed: 'm/s', 'km/h', 'm/h', 'knot', 'ft/s'

---
## Usage

Example use:
```javascript
var MarsInsightWeather = require('mars-insight-weather-node');
var marsweather = new MarsInsightWeather();

marsweather.request(function(err, response){
    console.log ("Temperature ", this.getLatestSol().AT);
    console.log ("Pressure ", this.getLatestSol().PRE);
    console.log ("Wind speed ", this.getLatestSol().HWS);
});
```

Example use with different units of measurement:
```javascript
var MarsInsightWeather = require('mars-insight-weather-node');
var marsweather = new MarsInsightWeather('F', 'bar', 'km/h');

marsweather.request(function(err, response){
    console.log ("Temperature ", this.getLatestSol().AT);
    console.log ("Pressure ", this.getLatestSol().PRE);
    console.log ("Wind speed ", this.getLatestSol().HWS);
});
```

Example single sol structure:
```javascript
  {
    "First_UTC": "2019-02-20T12:36:11Z", 
    "Last_UTC": "2019-02-21T13:15:46Z", 
    "Season": "winter", 
    "AT": { // Air temperature
      "av": -63.807, 
      "ct": 17754, 
      "mn": -95.101, 
      "mx": -13.177
    }, 
    "HWS": { // Wind speed
      "av": 4.138, 
      "ct": 8160, 
      "mn": 0.182, 
      "mx": 10.818
    }, 
    "PRE": { // Pressure
      "av": 720.716, 
      "ct": 177468, 
      "mn": 693.681, 
      "mx": 743.525
    }, 
    "WD": { // wind direction
      "0": {
        "compass_degrees": 0.0, 
        "compass_point": "N", 
        "compass_right": 0.0, 
        "compass_up": 1.0, 
        "ct": 150
      }, 
      "1": {
        "compass_degrees": 22.5, 
        "compass_point": "NNE", 
        "compass_right": 0.382683432365, 
        "compass_up": 0.923879532511, 
        "ct": 65
      }, 
      //...other...
      "most_common": {
        "compass_degrees": 225.0, 
        "compass_point": "SW", 
        "compass_right": -0.707106781187, 
        "compass_up": -0.707106781187, 
        "ct": 2497
      }
    }
  }, 

```
---
## Credits

All data provided by: NASA/JPL-Caltech/

## License

[MIT](LICENSE) © Gabriele Lauricella
