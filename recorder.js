/*
    recorder.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');
var state = require('./state');
var stateReactor = require('./stateReactor');
var conditionRegistry = require('./conditions').conditionRegistry;

module.exports = recorder = {
    handleInput: function(input) {
        var thingId = input.sensor;
        if (!thingId) {
            return;
        }
        logger.i("Recording input: " + util.inspect(input));

        var stateId = "simpleState";
        state.saveState(thingId, stateId, input.state);
//        stateReactor.react(thingId, stateId);
        conditionRegistry.runApplicableConditions();
    }
};
