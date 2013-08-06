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
var Scenes = require('./scenes');
var SceneAction = Actions.SceneAction;
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
Action.TurnOffBottomLight = genId();
Action.TurnOffEverything = genId();
Action.StartWelcomeSequence = genId();
Action.TurnOffAllBathroom = genId();
Action.TurnOnBathtubLight = genId();
Action.TurnOnToiletLight = genId();


var ComputedState = {};
ComputedState.MotionOnTheStairs = genId();
ComputedState.NobodyOnStairs = genId();
ComputedState.NobodyIsHome = genId();
ComputedState.ChrisJustGotHome = genId();
ComputedState.SamerJustGotHome = genId();
ComputedState.SomebodyJustGotHome = genId();
ComputedState.SomeonesPhoneWifiConnected = genId();
ComputedState.NobodyInTheBathroom = genId();
ComputedState.ProbablyGoingToUseTheBathroom = genId();
ComputedState.WelcomeFromAnEmptyHouse = genId();


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

function StrategySimpleStateAND(simpleStateToMatch) {
    return function(dependencyStates) {
        return _.all(_.keys(dependencyStates.dependencyStates), function(dependency) {
            return dependencyStates.get(dependency).is(simpleStateToMatch);
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

function StrategyTimeSinceStateChangeStateLessThan(simpleStateToMatch, lessThanNumberOfSeconds) {
    return function(dependencyStates) {
        var curTimeSecs = process.hrtime()[0];
        return _.all(_.keys(dependencyStates.dependencyStates), function(dependency) {
            var timeOk = (curTimeSecs - dependencyStates.get(dependency).updateTime() <= lessThanNumberOfSeconds);
            var stateOk = (dependencyStates.get(dependency).is(simpleStateToMatch));
            return timeOk && stateOk;
        });
    }
}


function initConfig() {

    whenComputedState(ComputedState.MotionOnTheStairs).then(Action.TurnOnStairBottomLight);
//    whenComputedState(ComputedState.SomebodyJustGotHome).then(Action.StartWelcomeSequence);
    whenComputedState(ComputedState.ProbablyGoingToUseTheBathroom).then(Action.TurnOnToiletLight);
    whenComputedState(ComputedState.NobodyInTheBathroom).then(Action.TurnOffAllBathroom);
    whenComputedState(ComputedState.NobodyIsHome).then(Action.TurnOffEverything);
    whenComputedState(ComputedState.NobodyOnStairs).then(Action.TurnOffBottomLight);

    whenThingState(Things.C2, SimpleState.Active).then(Action.TurnOnBathtubLight);

    // ================= Computed States =================
    defineComputedState(ComputedState.MotionOnTheStairs, [Things.C4, Things.BedroomDoorMulti], StrategySimpleStateOR(SimpleState.Active));
    defineComputedState(ComputedState.ProbablyGoingToUseTheBathroom, [Things.C1], StrategySimpleStateOR(SimpleState.Active));

    defineComputedState(ComputedState.NobodyIsHome, [Things.chrisPhoneWifi, Things.samerPhoneWifi], StrategySimpleStateAND(SimpleState.NotPresent));
    defineComputedState(ComputedState.SomebodyJustGotHome, [ComputedState.ChrisJustGotHome, ComputedState.SamerJustGotHome], StrategyComputedStateOR());

    defineComputedTimeState(ComputedState.ChrisJustGotHome, [Things.chrisPhoneWifi], StrategyTimeSinceStateChangeStateLessThan(SimpleState.Present, 30));
    defineComputedTimeState(ComputedState.SamerJustGotHome, [Things.samerPhoneWifi], StrategyTimeSinceStateChangeStateLessThan(SimpleState.Present, 30));

    defineComputedTimeState(ComputedState.NobodyInTheBathroom, [Things.C2, Things.C1], StrategyTimeSinceStateChangeStateLessThan(SimpleState.Inactive, 20));

    defineComputedTimeState(ComputedState.NobodyOnStairs, [Things.C4], StrategySimpleStateOR(SimpleState.Inactive, 15));

    defineComputedTimeState(ComputedState.WelcomeFromAnEmptyHouse,
        [ComputedState.NobodyIsHome, ComputedState.SomebodyJustGotHome],
        function(dependencyStates) {
            return null;
            var curTimeSecs = process.hrtime()[0];
            return _.all(_.keys(dependencyStates.dependencyStates), function(dependency) {
                var timeOk = (curTimeSecs - dependencyStates.get(dependency).updateTime() <= lessThanNumberOfSeconds);
                var stateOk = (dependencyStates.get(dependency).is(simpleStateToMatch));
                return timeOk && stateOk;
            });
        }
    );


    // ================= Actions =================
    defineAction(Action.TurnOnStairBottomLight, new LightAction(new Light("Stairs Bottom"), new Lights.OnLightCommand()));
    defineAction(Action.TurnOffBottomLight, new LightAction(new Light("Stairs Bottom"), new Lights.OffLightCommand()));
    defineAction(Action.StartWelcomeSequence, new SceneAction(Scenes.WelcomeHome));
    defineAction(Action.TurnOnBathtubLight, new LightAction(new Light("Bathtub"), new Lights.OnLightCommand()));
    defineAction(Action.TurnOnToiletLight, new LightAction(new Light("Toilet"), new Lights.OnLightCommand()));
    defineAction(Action.TurnOffAllBathroom, new LightAction(Lights.BathroomGroup, new Lights.OffLightCommand()));
    defineAction(Action.TurnOffEverything, new SceneAction(Scenes.AllOff));

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