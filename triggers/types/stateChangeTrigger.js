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

    function StateChangeTrigger(thingId, stateId, state, eventIdToFire) {
        Trigger.call(this, "StateChangeTrigger:" + (thingId + stateId + state), eventIdToFire);
        this.thingId = thingId;
        this.stateId = stateId;
        this.state = state;
    }
    StateChangeTrigger.prototype = new Trigger();
    StateChangeTrigger.prototype.shouldFire = function(query) {
        var curState = state.getState(this.thingId, this.stateId);
        return (this.state == curState);
    };

    context.StateChangeTrigger = StateChangeTrigger;
})(exports);
