/*
    BooleanAndTriggerGroup.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('../../logger');
var Facade = require('../../facade');
var Trigger = require('./trigger').Trigger;
var TriggerGroup = require('./trigger').TriggerGroup;

(function(context) {

    function BooleanAndTriggerGroup(triggers) {
        TriggerGroup.call(this, triggers);
    }
    BooleanAndTriggerGroup.prototype = new TriggerGroup();
    BooleanAndTriggerGroup.prototype.shouldFire = function(query) {
        var allTriggersInGroupReadToFire = _.every(this.triggers, function(trigger) {
            return trigger.shouldFire(query);
        });
        return allTriggersInGroupReadToFire;
    };
    BooleanAndTriggerGroup.prototype.fire = function(query) {
//        _.each(this.triggers, function(trigger) {
//            trigger.fire(query);
//        });
        logger.i("FIRING BOOLEAN OP!!!!!");
    };

    context.BooleanAndTriggerGroup = BooleanAndTriggerGroup;
})(exports);
