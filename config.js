/*
    conditionConfig.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');
var stateReactor = require('./stateReactor');
var ComputedStateReactor = stateReactor.ComputedStateReactor;
var idUtil = require('./casIdUtil');
var actionRunner = require('./actionRunner');
var Lights = require('./hueWrapper');
var Light = Lights.Light;
var Actions = require('./action/actionDirectory');
var LightAction = Actions.LightAction;
var conditions = require('./conditions');
var Condition = conditions.Condition;
var SimpleState = conditions.SimpleState;
var SimpleStateCondition = conditions.SimpleStateCondition;
var ComputedStateTrueCondition = conditions.ComputedStateTrueCondition;
var conditionRegistry = conditions.conditionRegistry;
var genId = idUtil.genId;
var makeValuesHumanReadable = idUtil.makeValuesHumanReadable;

var Things = {};
Things.BedroomDoorMulti = genId();
Things.BedroomStairsMotion = genId();
Things.SamerBackpackPresence = genId();
Things.ChrisBackpackPresence = genId();
Things.chrisPhoneWifi = genId();
Things.samerPhoneWifi = genId();
Things.C1 = genId("Bathroom Motion");
Things.C2 = genId("Bathtub Motion");
Things.C3 = genId("Closet Motion");
Things.C4 = genId("Stairs Motion");


var Action = {};
Action.TurnOnStairBottomLight = genId();
Action.TurnOffEverything = genId();
Action.StartWelcomeSequence = genId();


var ComputedState = {};
ComputedState.MotionOnTheStairs = genId();
ComputedState.NobodyIsHome = genId();
ComputedState.ChrisJustGotHome = genId();
ComputedState.SamerJustGotHome = genId();
ComputedState.SomebodyJustGotHome = genId();
ComputedState.SomeonesPhoneWifiConnected = genId();


function whenThingState(thingId, stateId) {
    var newCondition = new SimpleStateCondition(thingId, stateId);
    conditionRegistry.registerCondition(newCondition);
    return newCondition;
}


function whenComputedState(computedId) {
    var newCondition = new ComputedStateTrueCondition(computedId);
    conditionRegistry.registerCondition(newCondition);
    return newCondition;
}


function defineAction(actionId, action) {
    actionRunner.defineAction(actionId, action);
}

function defineComputedState(computedStateId, dependencies, strategy) {
    var reactor = new ComputedStateReactor(computedStateId, dependencies, strategy);
    stateReactor.defineComputedStateReactor(reactor);
}

function defineComputedTimeState(computedStateId, dependencies, strategy) {
    var reactor = new ComputedStateReactor(computedStateId, dependencies, strategy);
    stateReactor.defineComputedTimeStateReactor(reactor);
}


function initConfig() {

    whenComputedState(ComputedState.MotionOnTheStairs).then(Action.TurnOnStairBottomLight);
    whenComputedState(ComputedState.SomebodyJustGotHome).then(Action.StartWelcomeSequence);

    // ================= Computed States=================

    defineComputedState(ComputedState.MotionOnTheStairs, [Things.C4, Things.BedroomDoorMulti], StrategySimpleStateOR(SimpleState.Active));
    defineComputedState(ComputedState.SomebodyJustGotHome, [ComputedState.ChrisJustGotHome, ComputedState.SamerJustGotHome], StrategyComputedStateOR());

    defineComputedTimeState(ComputedState.ChrisJustGotHome, [Things.chrisPhoneWifi], StrategyTimeSinceStateChangeToStateLessThan(SimpleState.Present, 30));
    defineComputedTimeState(ComputedState.SamerJustGotHome, [Things.samerPhoneWifi], StrategyTimeSinceStateChangeToStateLessThan(SimpleState.Present, 30));


    function StrategyTimeSinceStateChangeToStateLessThan(simpleStateToMatch, lessThanNumberOfSeconds) {
        return function(dependencyStates) {
            var curTimeSecs = process.hrtime()[0];
            return _.all(_.keys(dependencyStates.dependencyStates), function(dependency) {
                var timeOk = (curTimeSecs - dependencyStates.get(dependency).updateTime() <= lessThanNumberOfSeconds);
                var stateOk = (dependencyStates.get(dependency).is(simpleStateToMatch));
                return timeOk && stateOk;
            });
        }
    }

    function StrategySimpleStateOR(simpleStateToMatch) {
        return function(dependencyStates) {
            return _.any(_.keys(dependencyStates.dependencyStates), function(dependency) {
                return dependencyStates.get(dependency).is(simpleStateToMatch);
            });
        }
    }

    function StrategyComputedStateOR() {
        return function(dependencyStates) {
            return _.any(_.keys(dependencyStates.dependencyStates), function(dependency) {
                var val = dependencyStates.get(dependency).value();
                return val;
            });
        }
    }

    // ================= Actions=================
    defineAction(Action.TurnOnStairBottomLight, new LightAction(new Light("Stairs Bottom"), new Lights.OnLightCommand()));
    defineAction(Action.StartWelcomeSequence, new LightAction(new Light("Stairs Top"), new Lights.OnLightCommand()));

    // when(ComputedState.NobodyIsHome).then(Action.TurnOffEverything);
    // when(ComputedState.SomebodyJustGotHome).then(Action.StartWelcomeSequence);
    actionRunner.defineActionType(Action);
}



module.exports = conditions = {
    init: function() {
        initConfig();
    }
};

makeValuesHumanReadable(Things);    // For debugging
makeValuesHumanReadable(Action);    // For debugging
makeValuesHumanReadable(ComputedState);    // For debugging