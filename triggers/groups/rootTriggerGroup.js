/*
    rootTriggerGroup.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('../../logger');
var TriggerGroup = require('./../types/trigger').TriggerGroup;
var SensorTriggerGroup = require('./sensorTriggerGroup').SensorTriggerGroup;
var StateUpdateTriggerGroup = require('./stateUpdateTriggerGroup').StateUpdateTriggerGroup;

(function(context) {

    function RootTriggerGroup() {
        TriggerGroup.call(this, [
            new SensorTriggerGroup(),
            new StateUpdateTriggerGroup()
        ]);
    }
    RootTriggerGroup.prototype = new TriggerGroup();

    context.RootTriggerGroup = RootTriggerGroup;
})(exports);
