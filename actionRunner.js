 /*
    actionRunner
*/

var _ = require('underscore'),
    util = require('util'),
    logger = require('./logger'),
    lights = require('./hueWrapper'),
    ActionDirectory = require('./action/actionDirectory'),
    Events = require('./events');

(function(context) {

    var ACTIONS = {};
    function runActionsForEvent(eventId) {
        var actions = ACTIONS[eventId];
        if (!actions) {
            return;
        }
        _.each(actions, function(action) {
            action.run();
        });
    }

    function init() {
        addAction(Events.TURN_ON_ENTRANCE_LIGHT, new ActionDirectory.TurnOnLightAction("Stairs Bottom"));
        addAction(Events.TURN_ON_ENTRANCE_LIGHT, new ActionDirectory.DelayedAction(
            new ActionDirectory.TurnOffLightAction("Stairs Bottom"), 60000));
    }

    function addAction(eventId, action) {
        ACTIONS = ACTIONS || {};
        var actions = ACTIONS[eventId];

        actions = actions || [];
        actions.push(action);

        ACTIONS[eventId] = actions;
    }

    exports.init = init;
    exports.runActionsForEvent = runActionsForEvent;
})(exports);
