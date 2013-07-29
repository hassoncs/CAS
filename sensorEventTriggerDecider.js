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
     sensorNames = require('./sensorWrapper');

(function(context) {

    var SENSOR_TRIGGERS = [
        new SensorTrigger("C1", Events.BATHROOM_MOTION_ACTIVE, "active"),
        new SensorTrigger("roomEntranceMotion", Events.ENTRANCE_MOTION_ACTIVE, "active"),
        new SensorTrigger("roomEntranceMotion", Events.ENTRANCE_MOTION_INACTIVE, "inactive"),

        new SensorTrigger("chrisPhoneWifi", Events.CHRIS_ARRIVED_HOME, "present"),
        new SensorTrigger("chrisPhoneWifi", Events.CHRIS_LEFT_HOME, "notPresent")
    ];

    function Trigger() {}
    Trigger.prototype.fire = function(query) { /* noop */ };
    Trigger.prototype.shouldFire = function(query) { return false; };



    function SensorTrigger(sensor, eventIdToFire, state) {
        Trigger.call(this);
        this.sensor = sensor;
        this.eventIdToFire = eventIdToFire;
        this.state = state;
    }
    SensorTrigger.prototype = new Trigger();
    SensorTrigger.prototype.shouldFire = function(query) {
        var sensor = query.sensor;
        var state = query.state;
        return (this.sensor == sensor) && (this.state == state);
    };
    SensorTrigger.prototype.fire = function(query) {
        logger.i("Sensor Triggered Event: " + this.eventIdToFire);
        Facade.handleEvent(this.eventIdToFire, { state: this.state });
    };


    function handleRawInput(query) {
        query.sensor = sensorNames.getSensorName(query.sensor) || query.sensor;
        logger.i(util.inspect(query));
        sensorMatches(query);
    }

    function sensorMatches(query) {
        var triggersToFire = _.filter(SENSOR_TRIGGERS, function(trigger) {
            return SensorTrigger.prototype.shouldFire.call(trigger, query);
        });

        logger.i("sensorMatches: " + util.inspect(triggersToFire));
        _.each(triggersToFire, function(trigger) {
            SensorTrigger.prototype.fire.call(trigger, query);
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
