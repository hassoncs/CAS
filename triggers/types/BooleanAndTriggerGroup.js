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

    function BooleanANDTriggerGroup(name, triggers, eventIdToFire) {
        TriggerGroup.call(this, name, triggers, eventIdToFire);
    }
    BooleanANDTriggerGroup.prototype = new TriggerGroup();
    BooleanANDTriggerGroup.prototype.shouldFire = function(query) {
        var allTriggersInGroupReadyToFire = _.every(this.triggers, function(trigger) {
            return trigger.shouldFire(query);
        });
        return allTriggersInGroupReadyToFire;
    };
    BooleanANDTriggerGroup.prototype.fire = Trigger.prototype.fire;


    function BooleanORTriggerGroup(name, triggers, eventIdToFire) {
        TriggerGroup.call(this, name, triggers, eventIdToFire);
    }
    BooleanORTriggerGroup.prototype = new TriggerGroup();
    BooleanORTriggerGroup.prototype.shouldFire = function(query) {
        var anyTriggersInGroupReadyToFire = _.some(this.triggers, function(trigger) {
            return trigger.shouldFire(query);
        });
        return anyTriggersInGroupReadyToFire;
    };
    BooleanORTriggerGroup.prototype.fire = Trigger.prototype.fire;

    context.BooleanANDTriggerGroup = BooleanANDTriggerGroup;
    context.BooleanORTriggerGroup = BooleanORTriggerGroup;
})(exports);
