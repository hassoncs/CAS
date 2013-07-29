
var _ = require('underscore'),
    util = require('util'),
    hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    LightState = hue.lightState,
    logger = require('./logger');

(function(context) {
    var HUE_USER_NAME = "lalaautomationserver";
    var FALLBACK_HUE_BRIDGE_IP = "10.0.0.30";

    var hueBridgeInfo,
        hueBridgeDetailedInfo,
        hueApi,
        lightArray,
        lightNamesToIds;

    function Light(lightName) {
        this.name = lightName;
    }
    Light.prototype.act = function(commands) {
        if (!_.isArray(commands))  {
            commands = [commands];
        }

        var lightId = lightNamesToIds[this.name];
        _.each(commands, function(command) {
            command.execute(lightId);
        });
    }

    function LightGroup(groupName, lightNames) {
        this.name = groupName;
        this.lightNames = lightNames;
    }
    LightGroup.prototype.act = function(commands) {
        if (!_.isArray(commands))  {
            commands = [commands];
        }

        logger.i("running commands on light group: " + this.name);
        _.each(this.lightNames, function(lightName) {
            logger.i("light: " + lightName);
            var lightId = lightNamesToIds[lightName];
            _.each(commands, function(command) {
                command.execute(lightId);
            });
        });
    }

    function LightCommand() {}
    LightCommand.prototype.execute = function(lightId) {
        /** override */
    }

    function OnLightCommand(transition) {
        LightCommand.call(this);
        this.transition = transition || 0;
    }
    OnLightCommand.prototype = new LightCommand();
    OnLightCommand.prototype.execute = function(lightId) {
        LightCommand.prototype.execute(lightId);
        hueApi
            .setLightState(lightId, LightState.create()
                .on()
                .transition(this.transition))
            .done();
    }


    function OffLightCommand(transition) {
        LightCommand.call(this);
        this.transition = transition || 0;
    }
    OffLightCommand.prototype = new LightCommand();
    OffLightCommand.prototype.execute = function(lightId) {
        LightCommand.prototype.execute(lightId);
        hueApi
            .setLightState(lightId, LightState.create()
                .off()
                .transition(this.transition))
            .done();
    }

    function ColorLightCommand(color, transition) {
        LightCommand.call(this);
        this.color = color;
        this.transition = transition || 0;
    }
    ColorLightCommand.prototype = new LightCommand();
    ColorLightCommand.prototype.execute = function(lightId) {
        LightCommand.prototype.execute(lightId);
        hueApi
            .setLightState(this.lightId, LightState.create()
                .on()
                .rgb(this.color.r, this.color.g, this.color.b)
                .transition(this.transition))
            .done();
    }

    /** Brightness 0-100. */
    function BrightnessLightCommand(brightness, transition) {
        LightCommand.call(this);
        this.brightness = brightness;
        this.transition = transition || 0;
    }
    BrightnessLightCommand.prototype = new LightCommand();
    BrightnessLightCommand.prototype.execute = function(lightId) {
        LightCommand.prototype.execute(lightId);
        hueApi
            .setLightState(lightId, LightState.create()
                .on()
                .brightness(this.brightness)
                .transition(this.transition))
            .done();
    }

    function ColorBrightnessLightCommand(color, brightness, transition) {
        LightCommand.call(this);
        this.color = color;
        this.brightness = brightness;
        this.transition = transition || 0;
    }
    ColorBrightnessLightCommand.prototype = new LightCommand();
    ColorBrightnessLightCommand.prototype.execute = function(lightId) {
        LightCommand.prototype.execute(lightId);
        hueApi
            .setLightState(lightId, LightState.create()
                .on()
                .rgb(this.color.r, this.color.g, this.color.b)
                .brightness(this.brightness)
                .transition(this.transition))
            .done();
    }

    function hueBridgeInfoReceived(hueBridges) {
        logger.i('Bridge Info Received!');
        logger.i(util.format('%d Hue Bridges Found: %s', hueBridges.length, util.inspect(hueBridges)));

        var ipaddress = FALLBACK_HUE_BRIDGE_IP;
        if (hueBridges.length > 0) {
            hueBridgeInfo = hueBridges[0];
            ipaddress = hueBridgeInfo.ipaddress;
        }

        logger.i('Connecting to the HueApi...');
        hueApi = new HueApi(ipaddress, HUE_USER_NAME);
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
                .setLightState(i, LightState.create().on())
                .done();
        }
    }

    function getLightByName(lightName) {
        return new Light(lightName);
    }

    function init() {
        logger.i('Fetching Bridge Info!');
        hue.locateBridges()
            .then(hueBridgeInfoReceived)
            .done();
    }

    exports.init = init;
    exports.turnOnAllLights = turnOnAllLights;
    exports.getLightByName = getLightByName;
    exports.Light = Light;
    exports.LightGroup = LightGroup;
    exports.OnLightCommand = OnLightCommand;
    exports.OffLightCommand = OffLightCommand;
    exports.ColorLightCommand = ColorLightCommand;
    exports.BrightnessLightCommand = BrightnessLightCommand;
    exports.ColorBrightnessLightCommand = ColorBrightnessLightCommand;
    exports.AllLights = new LightGroup("allLights",
        ["Stairs Bottom",
        "Stairs Top",
        "Hallway",
        "Bedroom Main",
        "Bedroom Window",
        "Bedroom Spotlight",
        "Bathtub",
        "Toilet"]);
    exports.EntranceGroup = new LightGroup("entranceLights", ["Stairs Bottom", "Stairs Top"]);
})(exports);



