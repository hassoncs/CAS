 /*
    actionRunner
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');
var Lights = require('./hueWrapper');
var Actions = require('./action/actionDirectory');
var Events = require('./events');
var Light = Lights.Light;
var LightAction = Actions.LightAction;
 var DelayedAction = Actions.DelayedAction;

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
        addAction(Events.ENTRANCE_MOTION_ACTIVE, new LightAction(new Light("Stairs Bottom"), new Lights.OnLightCommand()));
        addAction(Events.ENTRANCE_MOTION_ACTIVE, new DelayedAction(
            LightAction(new Light("Stairs Bottom"), new Lights.OffLightCommand()), 60000));
    }

    function addAction(eventId, action) {
        var actions = ACTIONS[eventId];

        actions = actions || [];
        actions.push(action);

        ACTIONS[eventId] = actions;
    }

    exports.init = init;
    exports.runActionsForEvent = runActionsForEvent;
})(exports);
