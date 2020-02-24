var convert = require('convert-units')
var round10 = require('round10').round10;
var fetch = require("node-fetch");


var MarsInsightWeather = function(temperatureUnit, pressureUnit, windSpeedUnit) {
	"use strict";

	this.temperatureUnit = (temperatureUnit !== undefined) ? temperatureUnit : 'C';   // "C" | "F" | "K" | "R"; // Temperature
	this.pressureUnit = (pressureUnit !== undefined) ? pressureUnit : 'Pa';  		//"Pa" | "hPa" | "kPa" | "MPa" | "bar" | "torr" | "psi" | "ksi"; // Pressure
	this.windSpeedUnit = (windSpeedUnit !== undefined) ? windSpeedUnit : 'm/s'; 	// "m/s" | "km/h" | "m/h" | "knot" | "ft/s"; // Speed

	//console.log(this.temperatureUnit +' '+ this.pressureUnit +' '+this.windSpeedUnit);

	//check if all input units are valid
	var allTempUnit = convert().from('C').possibilities();
	var allPressureUnit = convert().from('Pa').possibilities();
	var allWindspeedUnit = convert().from('m/s').possibilities();

	if(allTempUnit.indexOf(this.temperatureUnit) === -1){
		throw new Error('Unsupported Temperature unit ' + this.temperatureUnit + ', use one of: ' + allTempUnit.join(', '));
	}

	if(allPressureUnit.indexOf(this.pressureUnit) === -1){
		throw new Error('Unsupported Pressure unit ' + this.pressureUnit + ', use one of: ' + allPressureUnit.join(', '));
	}


	if(allWindspeedUnit.indexOf(this.windSpeedUnit) === -1){
		throw new Error('Unsupported Speed unit ' + this.windSpeedUnit + ', use one of: ' + allWindspeedUnit.join(', '));
	}

	var that = this;

	that.lastRequestTime = 0;
	that.lastRawData = undefined; 
	that.lastRawDataConv = undefined;
	
	var API_CALL_LIMIT = 60 * 60 //limit api call: one hour

	var convertData = function(data) {
		var dataConv = JSON.parse(JSON.stringify(data)); //clone object

		for(var i=0; i<dataConv.sol_keys.length; i++){
			var sol = dataConv.sol_keys[i];
			dataConv[sol] = converSolUnit(dataConv[sol]);
		}

		return dataConv;
	}

	var converSolUnit = function(sol) {
		if(that.temperatureUnit !== 'C') {
			sol.AT.av = round10(convert(sol.AT.av).from('C').to(that.temperatureUnit), -3);
			sol.AT.mn = round10(convert(sol.AT.mn).from('C').to(that.temperatureUnit), -3);
			sol.AT.mx = round10(convert(sol.AT.mx).from('C').to(that.temperatureUnit), -3);
		}

		if(that.pressureUnit !== 'Pa') {
			sol.PRE.av = round10(convert(sol.PRE.av).from('Pa').to(that.pressureUnit), -3);
			sol.PRE.mn = round10(convert(sol.PRE.mn).from('Pa').to(that.pressureUnit), -3);
			sol.PRE.mx = round10(convert(sol.PRE.mx).from('Pa').to(that.pressureUnit), -3);
		}

		if(that.windSpeedUnit !== 'm/s') {
			sol.HWS.av = round10(convert(sol.HWS.av).from('m/s').to(that.windSpeedUnit), -3);
			sol.HWS.mn = round10(convert(sol.HWS.mn).from('m/s').to(that.windSpeedUnit), -3);
			sol.HWS.mx = round10(convert(sol.HWS.mx).from('m/s').to(that.windSpeedUnit), -3);
		}

		return sol;
	}

	var getTimestamp = function() {
		return Math.floor(Date.now() / 1000);
	}

	that.request = function(callback){
		if ((typeof callback) !== "function"){
			throw new Error("The argument must be a function");
		}
		
		//skip api call if limit not exceeded
		var now = getTimestamp();
		if(that.lastRawData != undefined && now < (that.lastRequestTime + API_CALL_LIMIT)) {
			callback.call(that, false, that.lastRawDataConv);
			return;
		}

		var url = "https://mars.nasa.gov/rss/api/?feed=weather&category=insight&feedtype=json&ver=1.0";

		fetch(url)
			.then(response => {

				if(response.status !== 200) {
					var err = new Error(response.status);
					err.response = response;
   					throw err;
				}
				return response.json();
			})
			.then(data => {
				that.lastRawData = data;
				that.lastRawDataConv = convertData(data);
				that.lastRequestTime = getTimestamp();
				callback.call(that, false, that.lastRawDataConv);
			  })
			.catch(err =>{
				//console.log(err);
				console.error("Exception caught in JSON.parse"/*, body*/);
				callback.call(that, err, {});
			});

	};

	that.getRawData = function(){
		return that.lastRawData;
	};

	that.getConvertedRawData = function(){
		return that.lastRawDataConv;
	};

	that.getSol = function(sol){
		return that.lastRawDataConv[sol];
	};

	that.getSolKeys = function(){
		return that.lastRawDataConv.sol_keys;
	};

	that.getLatestSolKey = function(){
		return that.lastRawDataConv.sol_keys[that.lastRawDataConv.sol_keys.length-1];
	};

	that.getLatestSol = function(){
		return that.lastRawDataConv[that.getLatestSolKey()];
	};
};

module.exports = MarsInsightWeather;
