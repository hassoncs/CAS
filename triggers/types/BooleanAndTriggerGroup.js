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

    function BooleanANDTriggerGroup(triggers) {
        TriggerGroup.call(this, triggers);
    }
    BooleanANDTriggerGroup.prototype = new TriggerGroup();
    BooleanANDTriggerGroup.prototype.shouldFire = function(query) {
        var allTriggersInGroupReadToFire = _.every(this.triggers, function(trigger) {
            return trigger.shouldFire(query);
        });
        return allTriggersInGroupReadToFire;
    };
    BooleanANDTriggerGroup.prototype.fire = function(query) {
        _.each(this.triggers, function(trigger) {
            trigger.fire(query);
        });
    };

    context.BooleanANDTriggerGroup = BooleanANDTriggerGroup;
})(exports);
