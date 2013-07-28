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
        //ENTRANCE_MOTION_INACTIVE
        addAction(Events.ENTRANCE_MOTION_ACTIVE, new ActionDirectory.SimpleLightAction("Stairs Bottom", 'on'));
        addAction(Events.ENTRANCE_MOTION_ACTIVE, new ActionDirectory.DelayedAction(
            new ActionDirectory.SimpleLightAction("Stairs Bottom", 'off'), 60000));
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
