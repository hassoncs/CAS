/*
    facade.js
*/

var util = require('util'),
    logger = require('./logger'),
    actionRunner = require('./actionRunner');

(function(context) {

    function Event(eventId, eventBody) {
        this.eventId = eventId;
        this.eventBody = eventBody;
    }

    exports.handleEvent = function(eventId, eventBody) {
        actionRunner.runActionsForEvent(new Event(eventId, eventBody));
    };
    
})(exports);
