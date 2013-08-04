/*
    pubsub
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');
var faye = require('faye');


(function(context) {
    var MESSAGING_PORT = 11338;
    var TIMEOUT = 180;
    var bayeux;

    context.exports = pubsub = {
        init: function() {
            // Start up the messaging server
            bayeux = new faye.NodeAdapter({mount: '/faye', timeout: TIMEOUT});
            bayeux.listen(MESSAGING_PORT);
            logger.i(util.format('Messaging server running on port %d', MESSAGING_PORT));
        },

        publish: function(topic, data) {
            bayeux.getClient().publish(topic, data);
        },

        subscribe: function() {

        }
    };
})(module);
