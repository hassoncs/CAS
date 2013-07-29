/*
    rootTriggerGroup.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('.././logger');
var TriggerGroup = require('./trigger').TriggerGroup;
var sensorTriggerGroup = require('./sensorTriggerGroup').sensorTriggerGroup;

(function(context) {
    var rootTriggerGroup = new TriggerGroup([
        sensorTriggerGroup
    ]);

    context.rootTriggerGroup = rootTriggerGroup;
})(exports);
