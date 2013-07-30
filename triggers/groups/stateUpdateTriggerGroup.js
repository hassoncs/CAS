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
var StateEqualityTrigger = require('./../types/stateChangeTrigger').StateEqualityTrigger;
var BooleanANDTriggerGroup = require('./../types/booleanAndTriggerGroup').BooleanANDTriggerGroup;
var BooleanORTriggerGroup = require('./../types/booleanAndTriggerGroup').BooleanORTriggerGroup;

(function(context) {

    function StateUpdateTriggerGroup() {
        TriggerGroup.call(this, "StateUpdateTriggerGroup", [
            new BooleanANDTriggerGroup("TriggerSomebodyIsPresent", [
                new StateEqualityTrigger("chrisPhone", "presence", "notPresent"),
                new StateEqualityTrigger("samerPhone", "presence", "notPresent")
            ], Events.HOUSE_EMPTY),
            new BooleanORTriggerGroup("TriggerNobodyIsPresent", [
                new StateEqualityTrigger("chrisPhone", "presence", "present"),
                new StateEqualityTrigger("samerPhone", "presence", "present")
            ], Events.SOMEBODY_HOME)
        ]);
    }
    StateUpdateTriggerGroup.prototype = new TriggerGroup();
    StateUpdateTriggerGroup.prototype.shouldFire = function(query) {
        return (query.action == "save");
    };

    context.StateUpdateTriggerGroup = StateUpdateTriggerGroup;
})(exports);
