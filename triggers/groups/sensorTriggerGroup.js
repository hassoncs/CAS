 /*
    sensorTriggerDecider
*/

var _ = require('underscore');
var util = require('util');
var sensorWrapper = require('./../../sensorWrapper');
var logger = require('./../../logger');
var hueWrapper = require('./../../hueWrapper');
var Facade = require('./../../facade');
var Events = require('./../../events');
var sensorNames = require('./../../sensorWrapper');
var TriggerGroup = require('./../types/trigger').TriggerGroup;
var SensorTrigger = require('./../types/sensorTrigger').SensorTrigger;
var BooleanANDTriggerGroup = require('./../types/booleanAndTriggerGroup').BooleanANDTriggerGroup;
var BooleanORTriggerGroup = require('./../types/booleanAndTriggerGroup').BooleanORTriggerGroup;
var TimeSinceStateChangeGreaterThanTrigger = require('./../types/stateChangeTrigger').TimeSinceStateChangeGreaterThanTrigger;

(function(context) {

    var sensorTriggerGroup = new TriggerGroup();

    function SensorTriggerGroup() {
        TriggerGroup.call(this, "SensorTriggerGroup", [
            new SensorTrigger("C1", "active", Events.BATHROOM_MOTION_ACTIVE),


            // If entrance motion and the lastUpdateTime for presence greater than 30 seconds ago
            new BooleanANDTriggerGroup("WelcomeHomeTrigger", [
                new SensorTrigger("roomEntranceMotion", "active"),
                new BooleanORTriggerGroup("WelcomeHomeTrigger Either Chris or Samer", [
                    new TimeSinceStateChangeGreaterThanTrigger("chrisPhone", "presenceUpdateTime", 60 * 5 /* 5 mins */, true),
                    new TimeSinceStateChangeGreaterThanTrigger("samerPhone", "presenceUpdateTime", 60 * 5 /* 5 mins */, true)
                ])
            ], Events.ENTRANCE_MOTION_ACTIVE),


            new SensorTrigger("roomEntranceMotion", "inactive", Events.ENTRANCE_MOTION_INACTIVE),
            new SensorTrigger("C2", "active", Events.BATHROOM_ENTRANCE_MOTION_ACTIVE),
            new SensorTrigger("C2", "inactive", Events.BATHROOM_ENTRANCE_MOTION_INACTIVE),

            new SensorTrigger("chrisPhoneWifi", "present", Events.CHRIS_ARRIVED_HOME),
            new SensorTrigger("chrisPhoneWifi", "notPresent", Events.CHRIS_LEFT_HOME),

            new SensorTrigger("samerPhoneWifi", "present", Events.SAMER_ARRIVED_HOME),
            new SensorTrigger("samerPhoneWifi", "notPresent", Events.SAMER_LEFT_HOME)
        ]);
    }

    SensorTriggerGroup.prototype = new TriggerGroup();
    SensorTriggerGroup.prototype.shouldFire = function(query) {
        return query.sensor;
    };

    context.SensorTriggerGroup = SensorTriggerGroup;
})(exports);
