/*
    recorder.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');
var state = require('./state');
var stateReactor = require('./stateReactor');
var conditionRegistry = require('./conditions').conditionRegistry;


exports.handleInput = function(input, stateReactor) {
    var thingId = input.sensor;
    if (!thingId) {
        return;
    }
    logger.i("Recording input: " + util.inspect(input));

    state.saveState(thingId, "simpleState", input.state);
    state.saveState(thingId, "simpleStateUpdateTime", process.hrtime()[0]);
    stateReactor.react(thingId, "simpleState", { recursions: 0 });

    conditionRegistry.runApplicableConditions();
};

exports.handleStateUpdate = function(thingId, stateId, newValue) {
    state.saveState(thingId, stateId, newValue);
    stateReactor.react(thingId, stateId, { recursions: 0 });
    conditionRegistry.runApplicableConditions();
};