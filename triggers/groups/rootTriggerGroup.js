/*
    rootTriggerGroup.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('../../logger');
var TriggerGroup = require('./../types/trigger').TriggerGroup;
var sensorTriggerGroup = require('./sensorTriggerGroup').sensorTriggerGroup;
var stateUpdateTriggerGroup = require('./stateUpdateTriggerGroup').stateUpdateTriggerGroup;

(function(context) {
    var rootTriggerGroup = new TriggerGroup([
        sensorTriggerGroup,
        stateUpdateTriggerGroup
    ]);

    context.rootTriggerGroup = rootTriggerGroup;
})(exports);
