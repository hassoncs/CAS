/*
    state.js
*/

var _ = require('underscore'),
    util = require('util'),
    logger = require('./logger');
var Facade = require('./facade');

(function(context) {
    var things = {};

    function saveState(thingId, stateId, data) {
        things[thingId] = things[thingId] || {};
        var thingStates = things[thingId];

        thingStates[stateId] = data;

//        process.nextTick(function() {
        Facade.handleQuery({ action: "save", thingId: thingId, stateId: stateId, data: data });
//        });
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
    context.things = things;
})(exports);
