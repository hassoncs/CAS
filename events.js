/*
    events.js
*/

var _ = require('underscore');
var util = require('util'),
    logger = require('./logger');

(function(context) {
    var arbitraryCounter = 0;

    function next() {
        return "_" + arbitraryCounter++;
    }

    exports.ENTRANCE_MOTION_ACTIVE = next();
    exports.ENTRANCE_MOTION_INACTIVE = next();
    exports.BATHROOM_MOTION_ACTIVE = next();
    exports.BATHROOM_ENTRANCE_MOTION_ACTIVE = next();
    exports.BATHROOM_ENTRANCE_MOTION_INACTIVE = next();

    exports.CHRIS_ARRIVED_HOME = next();
    exports.CHRIS_LEFT_HOME = next();

    exports.SAMER_ARRIVED_HOME = next();
    exports.SAMER_LEFT_HOME = next();

    exports.HOUSE_EMPTY = next();
    exports.SOMEBODY_HOME = next();

    // Make the keys human-readable
    var keys = _.keys(exports);
    _.each(keys, function(eventName) {
        exports[eventName] = eventName;
    });

})(exports);
