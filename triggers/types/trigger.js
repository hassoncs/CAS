/*
    trigger.js
*/

var _ = require('underscore'),
    util = require('util'),
    logger = require('./../../logger');
var Facade = require('./../../facade');

(function(context) {

    function Trigger(name, eventIdToFire) {
        this.name = name;
        this.eventIdToFire = eventIdToFire;
    }
    Trigger.prototype.fire = function(query) {
        Facade.handleEvent(this.eventIdToFire, { state: this.state });
    };
    Trigger.prototype.shouldFire = function(query) { return true; };


    function TriggerGroup(name, triggers, eventIdToFire) {
        Trigger.call(this, name, eventIdToFire);
        this.triggers = triggers;
    }
    TriggerGroup.prototype = new Trigger();
    TriggerGroup.prototype.fire = function(query) {
        _.each(this.triggers, function(trigger) {
            if (trigger.shouldFire(query)) {
                trigger.fire(query);
            }
        });
    };
    TriggerGroup.prototype.shouldFire = function(query) {
        return true;
    };

    context.Trigger = Trigger;
    context.TriggerGroup = TriggerGroup;
})(exports);
