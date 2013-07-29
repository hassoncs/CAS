 /*
    stateUpdateTriggerGroup
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./../../logger');
var Facade = require('./../../facade');
var Events = require('./../../events');
var TriggerGroup = require('./../types/trigger').TriggerGroup;
var StateChangeTrigger = require('./../types/stateChangeTrigger').StateChangeTrigger;

(function(context) {

    var stateUpdateTriggerGroup = new TriggerGroup([
        new StateChangeTrigger("chrisPhone", "presence", "notPresent")
    ]);

    context.stateUpdateTriggerGroup = stateUpdateTriggerGroup;
})(exports);
