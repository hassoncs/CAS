
 /*
    WifiConnectStatus
*/

var _ = require('underscore');
var http = require('http');
var sys = require('sys');
var exec = require('child_process').exec;
var logger = require('./logger');
var ping = require ("net-ping");
var util = require ("util");

(function(context) {
//    var CHRIS_MAC_ADDRESS = "CC:3A:61:6A:60:A6";
//    var SAMER_MAC_ADDRESS = "CC:3A:61:C2:EB:1D";

    var DEVICES;

    function Device(name, ip) {
        this.name = name;
        this.ip = ip;
        this.available = false;
        setLastUpdateTime();

        this.update = function() {
            var self = this,
                session = ping.createSession();

            setLastUpdateTime();
            session.pingHost (ip, function (error, target) {
                if (error) {
                    self.setUnavailable();
                } else {
                    self.setAvailable();
                }
            });
        }

        this.setAvailable = function() {
            logger.i(util.format("Device %s is %s.", this.name, "ONline"));
            this.available = false;
        };
        this.setUnavailable = function() {
            logger.i(util.format("Device %s is %s.", this.name, "OFFline"));
            this.available = false;
        };
        function setLastUpdateTime() {
            this.lastUpdate = new Date();
        }

    }


    function updateDevice(device) {
        var ip = DEVICES[phoneId];

    }

    function startTimers() {
        logger.i("Starting Timers...");
        _.each(DEVICES, function(device) {
            device.update();
            setInterval(function() {
                device.update();
            }, 5000)
        });
    }

    function init() {
        var _DEVICES = {};
        addDevice("ChrisPhone", "10.0.0.6");
        addDevice("SamerPhone", "10.0.0.31");
        DEVICES = _DEVICES;

        function addDevice(deviceIp, deviceName) {
            _DEVICES[deviceName] = new Device(deviceIp, deviceName)
        }

        startTimers();
    }

    context.init = init;
})(exports);