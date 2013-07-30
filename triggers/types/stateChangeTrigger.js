/*
    sensorTrigger.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('../../logger');
var Facade = require('../../facade');
var state = require('../../state');
var Trigger = require('./trigger').Trigger;

(function(context) {

    function StateChangeTrigger(thingId, stateId, eventIdToFire) {
        var name = "StateChangeTrigger:" + (thingId + stateId + state);
        Trigger.call(this, name, eventIdToFire);
        this.thingId = thingId;
        this.stateId = stateId;
    }
    StateChangeTrigger.prototype = new Trigger();
    StateChangeTrigger.prototype.shouldFire = function(query) {
        return true;
    };


    function StateEqualityTrigger(thingId, stateId, state, eventIdToFire) {
        Trigger.call(this, thingId, stateId, eventIdToFire);
        this.name = "StateEqualityTrigger:" + (thingId + stateId + state);
        this.state = state;
    }
    StateEqualityTrigger.prototype = new StateChangeTrigger();
    StateEqualityTrigger.prototype.shouldFire = function(query) {
        var curState = state.getState(this.thingId, this.stateId);
        return (this.state == curState);
    };

    function TimeSinceStateChangeGreaterThanTrigger(thingId, stateId, eventIdToFire, timeSinceChange, invert) {
        StateChangeTrigger.call(this, thingId, stateId, eventIdToFire);
        this.name = "TimeSinceStateChangeTrigger:" + (thingId + stateId + timeSinceChange);
        this.timeSinceChange = timeSinceChange;
        this.invert = invert;
    }
    TimeSinceStateChangeGreaterThanTrigger.prototype = new StateChangeTrigger();
    TimeSinceStateChangeGreaterThanTrigger.prototype.shouldFire = function(query) {
        var curStateTime = state.getState(this.thingId, this.stateId);
        if (!curStateTime) {
            return false;
        }

        var time = process.hrtime()[0]; // seconds
        var shouldActivate = (time - curStateTime >= this.timeSinceChange);
        return (shouldActivate && !this.invert) || (!shouldActivate && this.invert);
    };

    context.StateChangeTrigger = StateChangeTrigger;
    context.StateEqualityTrigger = StateEqualityTrigger;
    context.TimeSinceStateChangeGreaterThanTrigger = TimeSinceStateChangeGreaterThanTrigger;
})(exports);
