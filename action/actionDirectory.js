/*
   actionDirectory.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('.././logger');
var lights = require('.././hueWrapper');
var state = require('.././state');

(function(context) {

    function Action() {
        this.actionType = "Action";
    }
    Action.prototype.run = function() {
        logger.i(util.format("Running action %s!", this.actionType));
    };

    function LightAction(light, lightCommands) {
        Action.call(this);
        this.actionType = "LightAction";
        this.light = light;
        this.lightCommands = lightCommands;
        if (!_.isArray(lightCommands)) {
            this.lightCommands = [lightCommands];
        }
    }
    LightAction.prototype = new Action();
    LightAction.prototype.run = function() {
        state.saveTime(this.name, "activateTime");
        logger.i("running action on light: " + this.light.name);
        this.light.act(this.lightCommands);
    };

    function DelayedAction(actionToRun, delay) {
        Action.call(this);
        this.actionType = "DelayedAction";
        this.actionToRun = actionToRun;
        this.delay = delay;
        logger.i('DelayedAction constructor: ', actionToRun, delay);
    }
    DelayedAction.prototype = new Action();
    DelayedAction.prototype.run = function() {
        logger.i(util.format("Running DelayedAction: " + this.actionToRun.actionType));
        var action = this.actionToRun;
        setTimeout(function() {
            action.run();
        }, this.delay);
    };

    function SceneAction(scene) {
        Action.call(this);
        this.scene = scene;
    }
    SceneAction.prototype = new Action();
    SceneAction.prototype.run = function() {
        this.scene.activate();
    }

    context.Action = Action;
    context.LightAction = LightAction;
    context.DelayedAction = DelayedAction;

})(exports);
