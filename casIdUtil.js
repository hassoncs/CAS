/*
    casIdUtil.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');

var arbitraryCounter = 0;
module.exports = conditions = {

    genId: function (realId) {
        var id = realId || ("__" + arbitraryCounter++);
        return id;
    },

    makeValuesHumanReadable: function(object) {
        // Make the values human-readable
        var keys = _.filter(_.keys(object), function(object) {
            return object.slice(0,2) !== "__";
        });
        _.each(keys, function(thingId) {
            object[thingId] = thingId;
        });
    }
};
