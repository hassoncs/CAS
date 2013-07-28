/*
    facade.js
*/

var util = require('util'),
    logger = require('./logger'),
    actionRunner = require('./actionRunner');

(function(context) {

    exports.handleEvent = function(eventId) {
        actionRunner.runActionsForEvent(eventId);
    };
    
})(exports);