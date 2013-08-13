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
var ColorBrightnessLightCommand = Lights.ColorBrightnessLightCommand;
var Light = Lights.Light;
var Color = require('./color.js');
var Actions = require('./action/actionDirectory');
var LightAction = Actions.LightAction;
var Scenes = require('./scenes');
var SceneAction = Actions.SceneAction;
var conditions = require('./conditions');
var strategy = require('./strategy');
var Condition = conditions.Condition;
var SimpleState = conditions.SimpleState;
var SimpleStateCondition = conditions.SimpleStateCondition;
var ComputedStateTrueCondition = conditions.ComputedStateTrueCondition;
var conditionRegistry = conditions.conditionRegistry;
var genId = idUtil.genId;
var makeValuesHumanReadable = idUtil.makeValuesHumanReadable;



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

// ------------------------------------------------

var Things = {};
Things.StairsAeonMultisensor = genId();
Things.PrebathroomAeonMultisensor = genId();
Things.BathroomAeonMultisensor = genId();

Things.BedroomDoorMulti = genId();
Things.BedroomStairsMotion = genId();
Things.SamerBackpackPresence = genId();
Things.ChrisBackpackPresence = genId();
Things.chrisPhoneWifi = genId();
Things.samerPhoneWifi = genId();

Things.BathroomMotion = genId("C1");
Things.BathtubMotion = genId("C2");
Things.ClosetMotion = genId("C3");
Things.StairsMotion = genId("C4");

// ------------------------------------------------

var Action = {};
Action.TurnOnStairBottomLight = genId();
Action.TurnOffBottomLight = genId();
Action.TurnOffEverything = genId();
Action.StartWelcomeSequence = genId();
Action.TurnOffAllBathroom = genId();
Action.TurnOnBathtubLight = genId();
Action.TurnOnToiletLight = genId();
Action.TurnOnHallwayLights = genId();
Action.TurnOffHallwayLights = genId();

// ------------------------------------------------

var ComputedState = {};
ComputedState.MotionInHallway = genId();
ComputedState.MotionInPrebathroom = genId();
ComputedState.MotionInBathroom = genId();
ComputedState.MotionNearBottomStairs = genId();

ComputedState.NobodyOnStairs = genId();
ComputedState.NobodyInHallway = genId();
ComputedState.NobodyInTheBathroom = genId();

ComputedState.ChrisJustGotHome = genId();
ComputedState.SamerJustGotHome = genId();
ComputedState.SomebodyJustGotHome = genId();
ComputedState.SomeonesPhoneWifiConnected = genId();
ComputedState.AllPhonesWifiNotPresent = genId();

ComputedState.WelcomeFromAnEmptyHouse = genId();
ComputedState.ComputedBrightnessLevel = genId();


function initConfig() {

    // ================= Conditions =================
    
    whenComputedState(ComputedState.MotionInHallway).then(Action.TurnOnHallwayLights);
    whenComputedState(ComputedState.MotionNearBottomStairs).then(Action.TurnOnStairBottomLight);
    whenComputedState(ComputedState.MotionInBathroom).then(Action.TurnOnToiletLight);
    whenComputedState(ComputedState.MotionInPrebathroom).then(Action.TurnOnBathtubLight);

    whenComputedState(ComputedState.NobodyInHallway).then(Action.TurnOffHallwayLights);
    whenComputedState(ComputedState.NobodyInTheBathroom).then(Action.TurnOffAllBathroom);

    whenComputedState(ComputedState.AllPhonesWifiNotPresent).then(Action.TurnOffEverything);

    // ================= Computed States =================
    // Motion dectection

    defineComputedState(ComputedState.MotionInPrebathroom, [Things.PrebathroomAeonMultisensor], strategy.SimpleStateOR(SimpleState.Active));
    defineComputedState(ComputedState.MotionInHallway, [Things.StairsAeonMultisensor], strategy.SimpleStateOR(SimpleState.Active));
    defineComputedState(ComputedState.MotionInBathroom, [Things.BathroomMotion, Things.BathroomAeonMultisensor], strategy.SimpleStateOR(SimpleState.Active));
    defineComputedState(ComputedState.MotionNearBottomStairs, [Things.StairsMotion, Things.BedroomDoorMulti], strategy.SimpleStateOR(SimpleState.Active));

    defineComputedTimeState(ComputedState.NobodyInHallway, [Things.StairsAeonMultisensor], strategy.TimeSinceStateChangeGreaterThan(SimpleState.Inactive, 45));
    defineComputedTimeState(ComputedState.NobodyInTheBathroom, [Things.BathroomAeonMultisensor], strategy.TimeSinceStateChangeGreaterThan(SimpleState.Inactive, 45));

    defineComputedTimeState(ComputedState.WelcomeFromAnEmptyHouse,
        [ComputedState.AllPhonesWifiNotPresent, ComputedState.SomebodyJustGotHome],
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

    defineComputedTimeState(ComputedState.ComputedBrightnessLevel, [],
        function(dependencyStates) {
            var curTime = new Date();
            var curHour = curTime.getHours();
            /* Overnight */
            if ((curHour > 0 && curHour < 7) || (curHour > 22)) {
                return 1;
            } else /*if ((curHour >= 7 && curHour < 20))*/ {
                return 100;
            }
        }
    );

    defineComputedState(ComputedState.AllPhonesWifiNotPresent, [Things.chrisPhoneWifi, Things.samerPhoneWifi], strategy.StrategySimpleStateAND(SimpleState.NotPresent));
    defineComputedState(ComputedState.SomebodyJustGotHome, [ComputedState.ChrisJustGotHome, ComputedState.SamerJustGotHome], strategy.StrategyComputedStateOR());

    defineComputedTimeState(ComputedState.ChrisJustGotHome, [Things.chrisPhoneWifi], strategy.TimeSinceStateChangeLessThan(SimpleState.Present, 30));
    defineComputedTimeState(ComputedState.SamerJustGotHome, [Things.samerPhoneWifi], strategy.TimeSinceStateChangeLessThan(SimpleState.Present, 30));


    // ================= Actions =================
    defineAction(Action.TurnOnHallwayLights, new SceneAction(Scenes.TurnOnHallwayLights));
    defineAction(Action.TurnOffHallwayLights, new SceneAction(Scenes.TurnOffHallwayLights));
    defineAction(Action.TurnOnStairBottomLight, new LightAction(new Light("Stairs Bottom"), new Lights.OnLightCommand()));
    defineAction(Action.TurnOffBottomLight, new LightAction(new Light("Stairs Bottom"), new Lights.OffLightCommand()));
    defineAction(Action.StartWelcomeSequence, new SceneAction(Scenes.WelcomeHome));
    defineAction(Action.TurnOnBathtubLight, new LightAction(new Light("Bathtub"), new ColorBrightnessLightCommand(Color.randomColorful(), "ComputedBrightnessLevel", 0)));
    defineAction(Action.TurnOnToiletLight, new LightAction(new Light("Toilet"), new ColorBrightnessLightCommand(Color.randomColorful(), "ComputedBrightnessLevel", 0)));
    defineAction(Action.TurnOffAllBathroom, new LightAction(Lights.BathroomGroup, new Lights.OffLightCommand()));
    defineAction(Action.TurnOffEverything, new SceneAction(Scenes.AllOff));

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