/*
    state.js
*/

var _ = require('underscore'),
    util = require('util'),
    logger = require('./logger');

(function(context) {
    var things = {};

    function saveState(thingId, stateId, data) {
        var thing = things[thingId] || {};
        var states = thing[stateId] || {};

        states[stateId] = data;
        logger.i(util.format("[Save] ThingId: %s, stateId: %s = %s", thingId, stateId, data));

        thing[stateId] = states;
        things[thingId] = thing;
    }

    function saveTime(thingId, stateId) {
        var time = process.hrtime()[0]; // seconds
        saveState(thingId, stateId, time);
    }

    function getState(thingId, stateId) {
        var thing = things[thingId];
        var state = thing != null ? thing[stateId] : null;
        return state;
    }

    context.saveState = saveState;
    context.saveTime = saveTime;
    context.getState = getState;
})(exports);
