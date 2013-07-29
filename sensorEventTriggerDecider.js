 /*
    sensorTriggerDecider
*/

var _ = require('underscore');
var util = require('util');
var sensorWrapper = require('./sensorWrapper');
var logger = require('./logger');
var hueWrapper = require('./hueWrapper');
var Facade = require('./facade');
var Events = require('./events');
var sensorNames = require('./sensorWrapper');
var Trigger = require('./triggers/trigger').Trigger;
var SensorTrigger = require('./triggers/sensorTrigger').SensorTrigger;

(function(context) {

    var SENSOR_TRIGGERS = [
        new SensorTrigger("C1", Events.BATHROOM_MOTION_ACTIVE, "active"),
        new SensorTrigger("roomEntranceMotion", Events.ENTRANCE_MOTION_ACTIVE, "active"),
        new SensorTrigger("roomEntranceMotion", Events.ENTRANCE_MOTION_INACTIVE, "inactive"),

        new SensorTrigger("chrisPhoneWifi", Events.CHRIS_ARRIVED_HOME, "present"),
        new SensorTrigger("chrisPhoneWifi", Events.CHRIS_LEFT_HOME, "notPresent")
    ];

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
