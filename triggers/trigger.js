/*
    trigger.js
*/

var _ = require('underscore'),
    util = require('util'),
    logger = require('./../logger');

(function(context) {

    function Trigger() {}
    Trigger.prototype.fire = function(query) {  };
    Trigger.prototype.shouldFire = function(query) { return false; };

    function TriggerGroup(triggers) {
        this.triggers = triggers;
    }
    TriggerGroup.prototype.fire = function(query) {
        _.each(this.triggers, function(trigger) {
            trigger.fire(query);
        })
    };
    TriggerGroup.prototype.shouldFire = function(query) { return true; };

    context.Trigger = Trigger;
    context.TriggerGroup = TriggerGroup;
})(exports);
