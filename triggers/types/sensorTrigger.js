/*
    sensorTrigger.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('../../logger');
var Facade = require('../../facade');
var Trigger = require('./trigger').Trigger;
var TriggerGroup = require('./trigger').TriggerGroup;

(function(context) {

    function SensorTrigger(sensor, eventIdToFire, state) {
        Trigger.call(this, eventIdToFire);
        this.sensor = sensor;
        this.state = state;
    }
    SensorTrigger.prototype = new Trigger();
    SensorTrigger.prototype.shouldFire = function(query) {
        var sensor = query.sensor;
        var state = query.state;
        return (this.sensor == sensor) && (this.state == state);
    };

    context.SensorTrigger = SensorTrigger;
})(exports);
