/*
    trigger.js
*/

var _ = require('underscore'),
    util = require('util'),
    logger = require('./../logger');

(function(context) {

    function Trigger() {}
    Trigger.prototype.fire = function(query) { /* noop */ };
    Trigger.prototype.shouldFire = function(query) { return false; };

    context.Trigger = Trigger;
})(exports);
