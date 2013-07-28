/*
    events.js
*/

var util = require('util'),
    logger = require('./logger');

(function(context) {
    var arbitraryCounter = 0;

    function next() {
        return "_" + arbitraryCounter++;
    }

    exports.ENTRANCE_MOTION_ACTIVE = next();
    exports.ENTRANCE_MOTION_INACTIVE = next();

})(exports);
