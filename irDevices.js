var _ = require('underscore');
var logger = require('./logger');
var http = require('http');

(function(exports) {

    function IrDevice(deviceName) {
        this.deviceName = deviceName;
    }
    IrDevice.prototype.act = function(action) {
        var options = {
            host: '10.0.0.50',
            port: 8556,
            path: '/?action=' + this.deviceName + action
        };

        logger.i("Posting to ir device: " + action);
        http.get(options, function(res) {
            console.log("Got response: " + res.statusCode);
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    }

    function DeviceTogglePowerCommand() {}
    DeviceTogglePowerCommand.prototype.execute = function(deviceName) {
        new IrDevice(deviceName).act("Power");
    }

    function DeviceIncreaseVolumeCommand() {}
    DeviceIncreaseVolumeCommand.prototype.execute = function(deviceName) {
        new IrDevice(deviceName).act("VolUp");
    }

    function DeviceDecreaseVolumeCommand() {}
    DeviceDecreaseVolumeCommand.prototype.execute = function(deviceName) {
        new IrDevice(deviceName).act("VolDown");
    }

    function DeviceSelectCommand() {}
    DeviceSelectCommand.prototype.execute = function(deviceName) {
        new IrDevice(deviceName).act("Select");
    }

    exports.DeviceTogglePowerCommand = DeviceTogglePowerCommand;
    exports.DeviceIncreaseVolumeCommand = DeviceIncreaseVolumeCommand;
    exports.DeviceDecreaseVolumeCommand = DeviceDecreaseVolumeCommand;
    exports.DeviceSelectCommand = DeviceSelectCommand;

})(exports);