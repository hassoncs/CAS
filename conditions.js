/*
    conditions.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');
var actionRunner = require('./actionRunner');
var state = require('./state');
var idUtil = require('./casIdUtil');
var genId = idUtil.genId;
var makeValuesHumanReadable = idUtil.makeValuesHumanReadable;


var SimpleState = {};
SimpleState.Active = genId();
SimpleState.Inactive = genId();
SimpleState.Present = genId();
SimpleState.NotPresent = genId();
makeValuesHumanReadable(SimpleState);    // For debugging


var DEFAULT_COOLDOWN_DURATION = 60; /* seconds */
function Condition(thingId, stateId) {
    this.thingId = thingId;
    this.stateId = stateId;
    this.lastFiredTime = 0;
}
Condition.prototype.then = function(actionId) {
    this.actionId = actionId;
};
Condition.prototype.isSatisfied = function() {
    var curTime = process.hrtime()[0]; // seconds
    var passedCooldown = (curTime >= this.lastFiredTime + DEFAULT_COOLDOWN_DURATION);
    return passedCooldown;
};
Condition.prototype.runAction = function() {
    logger.i("Condition satisfied, running action " + this.actionId);
    actionRunner.runAction(this.actionId);
    this.lastFiredTime = process.hrtime()[0]; // seconds
};


function SimpleStateCondition(thingId, stateId) {
    Condition.call(this, thingId, stateId);
}
SimpleStateCondition.prototype = new Condition();
SimpleStateCondition.prototype.isSatisfied = function() {
    var superConditionIsSatisfied = Condition.prototype.isSatisfied.call(this);
    var currentState = state.getState(this.thingId, "simpleState");
    var stateMatches = (currentState == this.stateId.toLowerCase());
    return superConditionIsSatisfied && stateMatches;
};


function ConditionRegistry() {
    this.conditions = [];
}
ConditionRegistry.prototype.registerCondition = function(condition) {
    this.conditions.push(condition);
};
ConditionRegistry.prototype.runApplicableConditions = function() {
    logger.i(util.format("Checking %d condition(s)", this.conditions.length));
    _.each(this.conditions, function(condition) {
        if (condition.isSatisfied()) {
            condition.runAction();
        }
    });
};

var theConditionRegistry = new ConditionRegistry();
module.exports = conditions = {
    SimpleState: SimpleState,
    Condition: Condition,
    SimpleStateCondition: SimpleStateCondition,
    conditionRegistry: theConditionRegistry
};
