/*
    sensorTrigger.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('.././logger');
var Facade = require('.././facade');
var Trigger = require('./trigger').Trigger;

(function(context) {

//    function StateChangeTrigger(sensor, eventIdToFire, state) {
//        Trigger.call(this);
//        this.sensor = sensor;
//        this.eventIdToFire = eventIdToFire;
//        this.state = state;
//    }
//    StateChangeTrigger.prototype = new Trigger();
//    StateChangeTrigger.prototype.shouldFire = function(query) {
//        var sensor = query.sensor;
//        var state = query.state;
//        return (this.sensor == sensor) && (this.state == state);
//    };
//    StateChangeTrigger.prototype.fire = function(query) {
//        if (!this.shouldFire(query)) {
//            return;
//        }
//
//        logger.i("StateChangeTrigger Event: " + this.eventIdToFire);
//        Facade.handleEvent(this.eventIdToFire, { state: this.state });
//    };
//
//    context.SensorTrigger = SensorTrigger;
})(exports);
