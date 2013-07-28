
 /*
    actionDirectory.js
*/

 var util = require('util'),
     logger = require('.././logger'),
     lights = require('.././hueWrapper'),
     actionRunner = require('.././hueWrapper');

(function(context) {

    function Action() {
        this.actionType = "Action";
    }
    Action.prototype.run = function() {
        logger.i(util.format("Running action %s!", this.actionType));
    };



    function TurnOnLightAction(lightName) {
        Action.call(this);
        this.actionType = "TurnOnLightAction";
        this.lightName = lightName;
        logger.i('TurnOnLightAction constructor for lightName: ' + lightName);
    }
    TurnOnLightAction.prototype = new Action();
    TurnOnLightAction.prototype.run = function() {
        logger.i(util.format("Running TurnOnLightAction %s!", this.lightName));
        lights.getLightByName(this.lightName).on();
    };

    function TurnOffLightAction(lightName) {
        Action.call(this);
        this.actionType = "TurnOffLightAction";
        this.lightName = lightName;
        logger.i('TurnOffLightAction constructor for lightName: ' + lightName);
    }
    TurnOffLightAction.prototype = new Action();
    TurnOffLightAction.prototype.run = function() {
        logger.i(util.format("Running TurnOffLightAction %s!", this.lightName));
        lights.getLightByName(this.lightName).off();
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
    context.TurnOnLightAction = TurnOnLightAction;
    context.TurnOffLightAction = TurnOffLightAction;
    context.DelayedAction = DelayedAction;

})(exports);
