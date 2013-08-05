/*
    stateReactor
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');

module.exports = stateReactor = {
    react: function(thingId, stateId) {
        logger.i(util.format("Checking for reactions to %s changing...", thingId));
//        state.saveState(input.sensor, "simpleState", input.state);
    }
};
