/*
    facade.js
*/

var util = require('util'),
    logger = require('./logger'),
    actionRunner = require('./actionRunner');
var RootTriggerGroup = require('./triggers/groups/rootTriggerGroup').RootTriggerGroup;

(function(context) {

    function Event(eventId, eventBody) {
        this.eventId = eventId;
        this.eventBody = eventBody;
    }

    exports.handleEvent = function(eventId, eventBody) {
        actionRunner.runActionsForEvent(new Event(eventId, eventBody));
    };

    var root = new RootTriggerGroup();
    exports.handleQuery = function(query) {
        logger.i(util.inspect(query));
//        logger.i(util.inspect(root));

        root.fire(query);
    };
    
})(exports);
