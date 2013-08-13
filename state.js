/*
    state.js
*/

var _ = require('underscore'),
    util = require('util'),
    logger = require('./logger');

(function(context) {
    var things = {};

    function saveState(thingId, stateId, data) {
        things[thingId] = things[thingId] || {};
        var thingStates = things[thingId];

        thingStates[stateId] = data;
    }

    function saveTime(thingId, stateId) {
        var time = process.hrtime()[0]; // seconds
        saveState(thingId, stateId, time);
    }

    function getState(thingId, stateId) {
        stateId = stateId || "simpleState";
        var thing = things[thingId];
        var state = thing != null ? thing[stateId] : null;
        return state;
    }

    function getComputedState(thingId) {
        var stateId = "computedState";
        var thing = things[thingId];
        var state = thing != null ? thing[stateId] : null;
        return state;
    }

    context.saveState = saveState;
    context.saveTime = saveTime;
    context.getState = getState;
    context.getComputedState = getComputedState;
    context.things = things;
})(exports);
