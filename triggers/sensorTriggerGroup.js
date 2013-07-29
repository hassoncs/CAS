 /*
    sensorTriggerDecider
*/

var _ = require('underscore');
var util = require('util');
var sensorWrapper = require('./../sensorWrapper');
var logger = require('./../logger');
var hueWrapper = require('./../hueWrapper');
var Facade = require('./../facade');
var Events = require('./../events');
var sensorNames = require('./../sensorWrapper');
var TriggerGroup = require('./trigger').TriggerGroup;
var SensorTrigger = require('./sensorTrigger').SensorTrigger;

(function(context) {

    var sensorTriggerGroup = new TriggerGroup([
        new SensorTrigger("C1", Events.BATHROOM_MOTION_ACTIVE, "active"),
        new SensorTrigger("roomEntranceMotion", Events.ENTRANCE_MOTION_ACTIVE, "active"),
        new SensorTrigger("roomEntranceMotion", Events.ENTRANCE_MOTION_INACTIVE, "inactive"),
        new SensorTrigger("C2", Events.BATHROOM_ENTRANCE_MOTION_ACTIVE, "active"),
        new SensorTrigger("C2", Events.BATHROOM_ENTRANCE_MOTION_INACTIVE, "inactive"),

        new SensorTrigger("chrisPhoneWifi", Events.CHRIS_ARRIVED_HOME, "present"),
        new SensorTrigger("chrisPhoneWifi", Events.CHRIS_LEFT_HOME, "notPresent")
    ]);

    context.sensorTriggerGroup = sensorTriggerGroup;
})(exports);
