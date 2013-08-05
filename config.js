/*
    conditionConfig.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');
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
var conditionRegistry = conditions.conditionRegistry;
var genId = idUtil.genId;
var makeValuesHumanReadable = idUtil.makeValuesHumanReadable;

var Things = {};
Things.BedroomDoorMulti = genId();
Things.BedroomStairsMotion = genId();
Things.SamerBackpackPresence = genId();
Things.ChrisBackpackPresence = genId();
Things.ChrisPhoneWifi = genId();
Things.SamerPhoneWifi = genId();


var Action = {};
Action.TurnOnStairBottomLight = genId();
Action.TurnOffEverything = genId();
Action.StartWelcomeSequence = genId();


var ComputedState = {};
ComputedState.NobodyIsHome = genId();
ComputedState.SomebodyJustGotHome = genId();


function whenThingState(thingId, stateId) {
    var newCondition = new SimpleStateCondition(thingId, stateId);
    conditionRegistry.registerCondition(newCondition);
    return newCondition;
}

function when(computedId) {

}


function defineAction(actionId, action) {
    actionRunner.defineAction(actionId, action);
}

//define(ComputedState.SomebodyJustGotHome)
function initConfig() {
    whenThingState(Things.BedroomDoorMulti, SimpleState.Active).then(Action.TurnOnStairBottomLight);

    defineAction(Action.TurnOnStairBottomLight, new LightAction(new Light("Stairs Bottom"), new Lights.OnLightCommand()));


    //when(ComputedState.NobodyIsHome).then(Action.TurnOffEverything);
    //when(ComputedState.SomebodyJustGotHome).then(Action.StartWelcomeSequence);
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