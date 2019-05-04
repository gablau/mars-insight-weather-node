/* eslint-disable no-undef */
require("should");
var MarsInsightWeather = require("./../lib/mars-insight-weather-node.js");

describe("Testing Mars Insight Weather Node:", function () {
	"use strict";

	this.slow(500);
	this.timeout(2000);

	it("Request + getLatestSol", function (done) {

		var marsweather = new MarsInsightWeather();

		marsweather.request(function(err, response){
			const latestSol = this.getLatestSol();
			//console.log (latestSol);
			latestSol.should.have.properties(["AT", "PRE", "HWS", "First_UTC", "Last_UTC", "WD", "Season"]);
			latestSol.AT.should.have.properties(["av", "ct", "mn", "mx"]);
			latestSol.PRE.should.have.properties(["av", "ct", "mn", "mx"]);
			latestSol.HWS.should.have.properties(["av", "ct", "mn", "mx"]);
			done();
		});

	});
	

	it("Request + getLatestSolKey", function (done) {

		var marsweather = new MarsInsightWeather();

		marsweather.request(function(err, response){
			const latestSolKey = this.getLatestSolKey();
			//console.log (latestSolKey);
			(parseInt(latestSolKey)).should.be.Number();
			(parseInt(latestSolKey)).should.be.greaterThan(100);
			done();
		});

	});

	

	it("Request + getSolKeys", function (done) {

		var marsweather = new MarsInsightWeather();

		marsweather.request(function(err, response){
			const solKeys = this.getSolKeys();
			//console.log (solKeys);
			solKeys.should.be.Array();
			solKeys.length.should.be.greaterThan(5);
			(parseInt(solKeys[0])).should.be.Number();
			(parseInt(solKeys[0])).should.be.greaterThan(100);
			done();
		});

	});
	

	it("Request + getSol", function (done) {

		var marsweather = new MarsInsightWeather();

		marsweather.request(function(err, response){
			const latestSolKey = this.getLatestSolKey();
			const sol = this.getSol(latestSolKey);
			//console.log (latestSol);
			sol.should.have.properties(["AT", "PRE", "HWS", "First_UTC", "Last_UTC", "WD", "Season"]);
			sol.AT.should.have.properties(["av", "ct", "mn", "mx"]);
			sol.PRE.should.have.properties(["av", "ct", "mn", "mx"]);
			sol.HWS.should.have.properties(["av", "ct", "mn", "mx"]);
			done();
		});

	});

	it("Request + getRawData", function (done) {

		var marsweather = new MarsInsightWeather();

		marsweather.request(function(err, response){
			const rawData = this.getRawData();
			//console.log (rawData);
			rawData.should.have.properties(["sol_keys", "validity_checks"]);
			rawData.should.have.properties(this.getSolKeys());
			done();
		});

	});

	it("Request + getConvertedRawData", function (done) {

		var marsweather = new MarsInsightWeather();

		marsweather.request(function(err, response){
			const rawData = this.getConvertedRawData();
			//console.log (rawData);
			rawData.should.have.properties(["sol_keys", "validity_checks"]);
			rawData.should.have.properties(this.getSolKeys());
			done();
		});

	});
	

	it("Constructor + wrong temperature unit", function (done) {

		should.throws(function () {
			var marsweather = new MarsInsightWeather('t');
		}, /Error: Unsupported Temperature unit t, use one of: C, K, F, R/);
		done();
	});

	it("Constructor + wrong pressure unit", function (done) {

		should.throws(function () {
			var marsweather = new MarsInsightWeather('C',  't');
		}, /Error: Unsupported Pressure unit t, use one of: Pa, kPa, MPa, hPa, bar, torr, psi, ksi/);
		done();
	});

	it("Constructor + wrong speed unit", function (done) {

		should.throws(function () {
			var marsweather = new MarsInsightWeather('C',  'Pa', 't');
		}, /Error: Unsupported Speed unit t, use one of: m\/s, km\/h, m\/h, knot, ft\/s/);
		done();
	});

	
	it("Request + different units", function (done) {

		var marsweather = new MarsInsightWeather('F', 'bar', 'km/h');

		marsweather.request(function(err, response){
			const latestSol = this.getLatestSol();
			//console.log (latestSol);
			latestSol.should.have.properties(["AT", "PRE", "HWS", "First_UTC", "Last_UTC", "WD", "Season"]);
			latestSol.AT.should.have.properties(["av", "ct", "mn", "mx"]);
			latestSol.PRE.should.have.properties(["av", "ct", "mn", "mx"]);
			latestSol.HWS.should.have.properties(["av", "ct", "mn", "mx"]);
			done();
		});

	});

	it("Double request", function (done) {

		var marsweather = new MarsInsightWeather('F', 'bar', 'km/h');

		marsweather.request(function(err, response){
			const latestSol = this.getLatestSol();
			//console.log (latestSol);
			latestSol.should.have.properties(["AT", "PRE", "HWS", "First_UTC", "Last_UTC", "WD", "Season"]);
			latestSol.AT.should.have.properties(["av", "ct", "mn", "mx"]);
			latestSol.PRE.should.have.properties(["av", "ct", "mn", "mx"]);
			latestSol.HWS.should.have.properties(["av", "ct", "mn", "mx"]);

			marsweather.request(function(err, response){
				const latestSol = this.getLatestSol();
				//console.log (latestSol);
				latestSol.should.have.properties(["AT", "PRE", "HWS", "First_UTC", "Last_UTC", "WD", "Season"]);
				latestSol.AT.should.have.properties(["av", "ct", "mn", "mx"]);
				latestSol.PRE.should.have.properties(["av", "ct", "mn", "mx"]);
				latestSol.HWS.should.have.properties(["av", "ct", "mn", "mx"]);
	
				done();
			});
		});

	});
	

	it("Request - Wrong arg.", function(done){

		var marsweather = new MarsInsightWeather();

		should.throws(function () {
			marsweather.request("");
		}, /The argument must be a function/);

		done();	
	});

	
	it("Request + different raw data", function (done) {

		var marsweather = new MarsInsightWeather('F', 'bar', 'km/h');

		marsweather.request(function(err, response){
			const rawData = marsweather.getRawData();
			//console.log (rawData[150].AT);
			rawData.should.have.properties(["sol_keys", "validity_checks"]);
			rawData.should.have.properties(this.getSolKeys());

			const convRawData = marsweather.getConvertedRawData();
			//console.log (convRawData[150].AT);
			convRawData.should.have.properties(["sol_keys", "validity_checks"]);
			convRawData.should.have.properties(this.getSolKeys());

			(rawData).should.not.be.eql(convRawData);
			done();
		});

	});

	it("Request + equal raw data", function (done) {

		var marsweather = new MarsInsightWeather();

		marsweather.request(function(err, response){
			const rawData = marsweather.getRawData();
			//console.log (rawData[150].AT);
			rawData.should.have.properties(["sol_keys", "validity_checks"]);
			rawData.should.have.properties(this.getSolKeys());

			const convRawData = marsweather.getConvertedRawData();
			//console.log (convRawData[150].AT);
			convRawData.should.have.properties(["sol_keys", "validity_checks"]);
			convRawData.should.have.properties(this.getSolKeys());

			(rawData).should.be.eql(convRawData);
			done();
		});

	});

});