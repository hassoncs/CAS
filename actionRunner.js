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
var Devices = require('./irDevices');
var Light = Lights.Light;
var LightAction = Actions.LightAction;
var SceneAction = Actions.SceneAction;
var DeviceAction = Actions.DeviceAction;
var StateUpdatingAction = Actions.StateUpdatingAction;

/*
 addAction(Events.SOMEBODY_HOME, new SceneAction(Scenes.SomebodyHome));
 addAction(Events.HOUSE_EMPTY, new SceneAction(Scenes.AllOff));
 addAction(Events.BATHROOM_MOTION_ACTIVE, new LightAction(new Light("Toilet"), new Lights.OnLightCommand()));
 addAction(Events.ENTRANCE_MOTION_ACTIVE, new SceneAction(Scenes.WelcomeHome));


 addAction(
 Events.ENTRANCE_MOTION_ACTIVE,
 new DeviceAction("TV", new Devices.DeviceTogglePowerCommand()));
 addAction(
 Events.ENTRANCE_MOTION_ACTIVE,
 new DeviceAction("Stereo", new Devices.DeviceTogglePowerCommand()));
 addAction(
 Events.ENTRANCE_MOTION_ACTIVE,
 new DeviceAction("ATV", new Devices.DeviceSelectCommand()));
 addAction(Events.ENTRANCE_MOTION_INACTIVE, new LightAction(Lights.EntranceGroup, new Lights.OffLightCommand()));
 addAction(
 Events.ENTRANCE_MOTION_INACTIVE,
 new LightAction(new Light("Hallway"), new Lights.BrightnessLightCommand(40, 2)));

 addAction(
 Events.BATHROOM_ENTRANCE_MOTION_ACTIVE,
 new LightAction(new Light("Bathtub"), new Lights.OnLightCommand()));
 */

var actionTypes;
var actions = {};

module.exports = conditions = {
    defineActionType: function(_actionType) {
        actionTypes = _actionType;
    },
    defineAction: function(actionId, action) {
        actions[actionId] = action;
    },
    runAction: function(actionId) {
        actions[actionId].run();
    }
};