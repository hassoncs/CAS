/*
    facade.js
*/

var util = require('util'),
    logger = require('./logger'),
    actionRunner = require('./actionRunner');
var rootTriggerGroup = require('./triggers/groups/rootTriggerGroup');

(function(context) {

    function Event(eventId, eventBody) {
        this.eventId = eventId;
        this.eventBody = eventBody;
    }

    exports.handleEvent = function(eventId, eventBody) {
        actionRunner.runActionsForEvent(new Event(eventId, eventBody));
    };

    exports.handleQuery = function(query) {
        logger.i(util.inspect(query));
        rootTriggerGroup.rootTriggerGroup.fire(query);
    };
    
})(exports);
