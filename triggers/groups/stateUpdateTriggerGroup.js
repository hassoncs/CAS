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
var BooleanAndTriggerGroup = require('./../types/booleanAndTriggerGroup').BooleanAndTriggerGroup;

(function(context) {

    function StateUpdateTriggerGroup() {
        TriggerGroup.call(this, [
            new BooleanAndTriggerGroup([
                new StateChangeTrigger("chrisPhone", "presence", "notPresent", Events.HOUSE_EMPTY),
                new StateChangeTrigger("samerPhone", "presence", "notPresent", Events.HOUSE_EMPTY)
            ])
        ]);
    }
    StateUpdateTriggerGroup.prototype = new TriggerGroup();
    StateUpdateTriggerGroup.prototype.shouldFire = function(query) {
        return (query.action == "save");
    };

    context.StateUpdateTriggerGroup = StateUpdateTriggerGroup;
})(exports);
