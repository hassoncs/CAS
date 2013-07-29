 /*
    actionRunner
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');
var Lights = require('./hueWrapper');
var Actions = require('./action/actionDirectory');
var Events = require('./events');
var Scenes = require('./scenes');
var Light = Lights.Light;
var LightAction = Actions.LightAction;
var SceneAction = Actions.SceneAction;
var StateUpdatingAction = Actions.StateUpdatingAction;

(function(context) {

    var ACTIONS = {};
    function runActionsForEvent(event) {
        var actions = ACTIONS[event.eventId];
        if (!actions) {
            return;
        }
        _.each(actions, function(action) {
            action.run(event);
        });
    }

    function init() {
        addAction(Events.HOUSE_EMPTY, new LightAction(new Light("Hallway"), new Lights.OffLightCommand()));
        addAction(Events.BATHROOM_MOTION_ACTIVE, new LightAction(new Light("Toilet"), new Lights.OnLightCommand()));
        addAction(Events.ENTRANCE_MOTION_ACTIVE, new SceneAction(Scenes.WelcomeHome));
        addAction(Events.ENTRANCE_MOTION_INACTIVE, new LightAction(Lights.EntranceGroup, new Lights.OffLightCommand()));
        addAction(
            Events.ENTRANCE_MOTION_INACTIVE,
            new LightAction(new Light("Hallway"), new Lights.BrightnessLightCommand(40, 2)));


        addAction(Events.CHRIS_ARRIVED_HOME, new StateUpdatingAction("chrisPhone", "state", "presence"));
        addAction(Events.CHRIS_LEFT_HOME, new StateUpdatingAction("chrisPhone", "state", "presence"));
        addAction(Events.SAMER_ARRIVED_HOME, new StateUpdatingAction("samerPhone", "state", "presence"));
        addAction(Events.SAMER_LEFT_HOME, new StateUpdatingAction("samerPhone", "state", "presence"));
        addAction(
            Events.BATHROOM_ENTRANCE_MOTION_ACTIVE,
            new LightAction(new Light("Bathtub"), new Lights.OnLightCommand()));
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
