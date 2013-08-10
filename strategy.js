/*
    strategy
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');

function StrategySimpleStateAND(simpleStateToMatch) {
    return function(dependencyStates) {
        return _.all(_.keys(dependencyStates.dependencyStates), function(dependency) {
            return dependencyStates.get(dependency).is(simpleStateToMatch);
        });
    }
}

function SimpleStateOR(simpleStateToMatch) {
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

function TimeSinceStateChangeLessThan(simpleStateToMatch, lessThanNumberOfSeconds, invertResults) {
    return function(dependencyStates) {
        var curTimeSecs = process.hrtime()[0];
        return _.all(_.keys(dependencyStates.dependencyStates), function(dependency) {
            if (!dependencyStates.get(dependency).is(simpleStateToMatch)) {
                return false;
            }
            var timeOk = (curTimeSecs - dependencyStates.get(dependency).updateTime() <= lessThanNumberOfSeconds);
            return (timeOk && !invertResults) || (!timeOk && invertResults);
        });
    }
}

function TimeSinceStateChangeGreaterThan(simpleStateToMatch, greaterThanNumberOfSeconds) {
    return TimeSinceStateChangeLessThan(simpleStateToMatch, greaterThanNumberOfSeconds, true);
}

module.exports = {
    StrategySimpleStateAND: StrategySimpleStateAND,
    SimpleStateOR: SimpleStateOR,
    StrategyComputedStateOR: StrategyComputedStateOR,
    TimeSinceStateChangeLessThan: TimeSinceStateChangeLessThan,
    TimeSinceStateChangeGreaterThan: TimeSinceStateChangeGreaterThan
};
