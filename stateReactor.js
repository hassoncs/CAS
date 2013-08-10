/*
    stateReactor
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');
var state = require('./state');
var recorder = require('./recorder');

var reactedOnce = false;

function DependencyStateContext() {
    this.dependencyStates = {};
    this.dependencyStatesUpdateTime = {};
}
DependencyStateContext.prototype.set = function(dependencyThingId, value, valueUpdateTime) {
    this.dependencyStates[dependencyThingId] = value;
    this.dependencyStatesUpdateTime[dependencyThingId] = valueUpdateTime;
};
DependencyStateContext.prototype.get = function(thingId) {
    var contextSelf = this;
    return {
        is: function(simpleStateId) {
            var stateMatches = (contextSelf.dependencyStates[thingId] ==
                (simpleStateId.slice(0,1).toLowerCase() + simpleStateId.slice(1)));
            return stateMatches;
        },
        value: function() {
            return contextSelf.dependencyStates[thingId];
        },
        updateTime: function() {
            return contextSelf.dependencyStatesUpdateTime[thingId];
        }
    }
};


function ComputedStateReactor(computedStateId, dependencies, strategy) {
    this.computedStateId = computedStateId;
    this.dependencies = dependencies;
    this.strategy = strategy;
}
ComputedStateReactor.prototype.react = function(recursiveData) {
    // Gather my dependencies' states
    var dependencyStateContext = new DependencyStateContext();
    _.each(this.dependencies, function(dependency) {
        var curState = state.getState(dependency, "simpleState") ||
            state.getState(dependency, "computedState");
        var curStateUpdateTime = state.getState(dependency, "simpleStateUpdateTime");
        dependencyStateContext.set(dependency, curState, curStateUpdateTime);
    });

    // Run my strategy giving it the state of my dependencies
    var computedValue = this.strategy(dependencyStateContext);
    var copiedRecursiveData = _.clone(recursiveData);
    copiedRecursiveData.recursions++;

    var currentValue = state.getState(this.computedStateId, "computedState");
    if (computedValue === null || currentValue === computedValue) {
        logger.i("Reactor tick");
        return;
    }
    logger.i(util.format("Reactor Reevaluated '%s' from %s => %s", this.computedStateId, currentValue, computedValue));
    recorder.handleStateUpdate(this.computedStateId, "computedState", computedValue, copiedRecursiveData);
}


var reactorsToNotifyWhenStateChanges = {};
var reactorsToNotifyWhenTimeChanges = [];

exports.react = function(thingId, stateId, recursiveData) {
    var reactorsWhoCare = reactorsToNotifyWhenStateChanges[thingId];

    logger.i(util.format("Checking for reactions to %s changing... found %d",
        thingId, reactorsWhoCare != null ? reactorsWhoCare.length : 0));
    _.each(reactorsWhoCare, function(reactor) {
        reactor.react(recursiveData);
    });

    if (!reactedOnce) {
        //setTimeTimer();
        reactedOnce = true;
    }
};

exports.defineComputedStateReactor = function(reactor) {
    var reactorDependencies = reactor.dependencies;
    _.each(reactorDependencies, function(dependencyId) {
        var reactorsWhoCare = reactorsToNotifyWhenStateChanges[dependencyId] || [];
        reactorsToNotifyWhenStateChanges[dependencyId] = reactorsWhoCare;
        reactorsWhoCare.push(reactor);
    });
};

exports.defineComputedTimeStateReactor = function(reactor) {
    exports.defineComputedStateReactor(reactor);
    reactorsToNotifyWhenTimeChanges.push(reactor);
};


exports.ComputedStateReactor = ComputedStateReactor;

function reactToTime() {
    _.each(reactorsToNotifyWhenTimeChanges, function(reactor) {
        reactor.react({ recursions: 0 });
    });
    //setTimeTimer();
};

var timeTimer;
function setTimeTimer() {
    //clearInterval(timeTimer);
};
setInterval(reactToTime, 10000);
