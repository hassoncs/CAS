 /*
    sensorTriggerDecider
*/

 var _ = require('underscore'),
     util = require('util'),
     sensorWrapper = require('./sensorWrapper'),
     logger = require('./logger'),
     hueWrapper = require('./hueWrapper'),
     Facade = require('./facade'),
     Events = require('./events');

(function(context) {

    var SENSOR_TRIGGERS = [
        //new Trigger("C2", "turnOnBottomStairLight"),
        new Trigger("roomEntranceMotion", Events.TURN_ON_ENTRANCE_LIGHT)
    ];

    function Trigger() {}
    Trigger.prototype.fire = function() { /* noop */ };
    Trigger.prototype.shouldFire = function() { return false; };

    SensorTrigger.prototype = new Trigger();
    function SensorTrigger(sensor, eventId) {
        Trigger.call(this);
        this.sensor = sensor;
        this.eventId = eventId;
    }
    SensorTrigger.prototype.shouldFire = function(query) {
        var sensor = query.sensor || "";
        var state = query.state;

        return (this.sensor == sensor) && (!state && state == "active");
    };
    SensorTrigger.prototype.fire = function() {
        logger.i("Sensor Triggered Event: " + this.eventId);
        Facade.handleEvent(this.eventId);
    };


    function handleRawInput(query) {
        logger.i(util.inspect(query));
        sensorMatches(query);
    }

    function sensorMatches(query) {
        var triggersToFire = _.filter(SENSOR_TRIGGERS, function(trigger) {
            return trigger.shouldFire(query);
        });

        logger.i("sensorMatches: " + util.inspect(triggersToFire));
        _.each(triggersToFire, function(trigger) {
            trigger.fire();
        });
    }

    function triggerAction(actionId) {
        hueWrapper.turnOnAllLights();
    }

    function init() {
        logger.i("Initializing the triggers!");
    }

    context.init = init;
    context.handleRawInput = handleRawInput;
})(exports);
