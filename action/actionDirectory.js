
 /*
    actionDirectory.js
*/

var util = require('util');
var logger = require('.././logger');
var lights = require('.././hueWrapper');
var actionRunner = require('.././hueWrapper');
var state = require('.././state');


(function(context) {

    function Action() {
        this.actionType = "Action";
    }
    Action.prototype.run = function() {
        logger.i(util.format("Running action %s!", this.actionType));
    };

    function SimpleLightAction(lightName, lightAction) {
        Action.call(this);
        this.actionType = "SimpleLightAction";
        this.lightName = lightName;
        this.lightAction = lightAction;
        logger.i('SimpleLightAction constructor for lightName: ' + lightName);
    }
    SimpleLightAction.prototype = new Action();
    SimpleLightAction.prototype.run = function() {
        state.saveTime(this.lightName, "activateTime");

        logger.i(util.format("Running SimpleLightAction action: %s", this.lightAction));
        lights.getLightByName(this.lightName)[this.lightAction]();
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


    context.Action = Action;
    context.SimpleLightAction = SimpleLightAction;
    context.DelayedAction = DelayedAction;

})(exports);
