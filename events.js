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

    exports.TURN_ON_ENTRANCE_LIGHT = next();
    
})(exports);