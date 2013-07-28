
var _ = require('underscore'),
    util = require('util'),
    hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState,
    logger = require('./logger');

(function(context) {
    var HUE_USER_NAME = "lalaautomationserver";

    var hueBridgeInfo,
        hueBridgeDetailedInfo,
        hueApi,
        lightArray,
        lightNamesToIds;


    function Light(lightName) {
        this.lightId = lightNamesToIds[lightName];
        this.on = function() {
            hueApi
                .setLightState(this.lightId, lightState.create().on())
                .done();
        };
        this.off = function() {
            hueApi
                .setLightState(this.lightId, lightState.create().off())
                .done();
        };
    }


    function doHueBridgeInfoReceived(hueBridges) {
        logger.i('Bridge Info Received!');
        logger.i(util.format('%d Hue Bridges Found: %s', hueBridges.length, util.inspect(hueBridges)));
        hueBridgeInfo = hueBridges[0];

        logger.i('Connecting to the HueApi...');
        hueApi = new HueApi(hueBridgeInfo.ipaddress, HUE_USER_NAME);
        hueApi
            .connect()
            .then(hueApiConnectionSucess)
            .done();
    };

    function hueApiConnectionSucess(_hueBridgeDetailedInfo) {
        logger.i('hueApiConnectionSucess!');
        hueBridgeDetailedInfo = _hueBridgeDetailedInfo;

        logger.i('Fetching Hue light data...');
        hueApi
            .lights()
            .then(hueApiLightDataReceived)
            .done();
    }

    function hueApiLightDataReceived(_hueLightData) {
        lightArray = _hueLightData.lights;
        logger.i(util.format('Light data received. Found %d lights.', lightArray.length));

        populateLightNameHash();
    }

    function populateLightNameHash() {
        lightNamesToIds = {};
        _.each(lightArray, function(lightData) {
            lightNamesToIds[lightData.name] = lightData.id;
        });
    }

    function turnOnAllLights() {
        logger.i(util.format('Turning on all %d lights.', lightArray.length));

        for (var i = 1; i <= lightArray.length; i++) {
            logger.i('turning on ' + lightArray[i-1].name);
            hueApi
                .setLightState(i, lightState.create().on())
                .done();
        }
    }

    function getLightByName(lightName) {
        return new Light(lightName);
    }

    function init() {
        logger.i('Fetching Bridge Info!');
        hue.locateBridges()
            .then(doHueBridgeInfoReceived)
            .done();
    }

    exports.init = init;
    exports.turnOnAllLights = turnOnAllLights;
    exports.getLightByName = getLightByName;
})(exports);



