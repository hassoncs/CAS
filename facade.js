/*
    facade.js
*/

var util = require('util'),
    logger = require('./logger'),
    actionRunner = require('./actionRunner');
var pubsub = require('./pubsub.js');
var RootTriggerGroup = require('./triggers/groups/rootTriggerGroup').RootTriggerGroup;

(function(context) {

    function Event(eventId, eventBody) {
        this.eventId = eventId;
        this.eventBody = eventBody;
    }

    exports.handleEvent = function(eventId, eventBody) {
        var event = new Event(eventId, eventBody);
        actionRunner.runActionsForEvent(event);
        pubsub.publish('/event', util.inspect(event));
    };

    //var root = new RootTriggerGroup();
    exports.handleExternalInput = function(input) {
        logger.i("External input recieved: " + util.inspect(input));

    };
    
})(exports);
