/*
    trigger.js
*/

var _ = require('underscore'),
    util = require('util'),
    logger = require('./../../logger');
var Facade = require('./../../facade');

(function(context) {

    function Trigger(eventIdToFire) {
        this.eventIdToFire = eventIdToFire;
    }
    Trigger.prototype.fire = function(query) {
        Facade.handleEvent(this.eventIdToFire, { state: this.state });
    };
    Trigger.prototype.shouldFire = function(query) { return true; };


    function TriggerGroup(triggers) {
        this.triggers = triggers;
    }
    TriggerGroup.prototype.fire = function(query) {
//        logger.i("TriggerGroup.fire, my triggers: " + util.inspect(this.triggers));

        _.each(this.triggers, function(trigger) {
//            logger.i("Should " + util.inspect(trigger) + " fire?");
            if (trigger.shouldFire(query)) {
//                logger.i("Firing " + util.inspect(trigger));
                trigger.fire(query);
            }
        });
    };
    TriggerGroup.prototype.shouldFire = function(query) {
//        logger.i("TriggerGroup.prototype.shouldFire");
        return true;
    };

    context.Trigger = Trigger;
    context.TriggerGroup = TriggerGroup;
})(exports);
