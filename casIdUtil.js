/*
    casIdUtil.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');

var arbitraryCounter = 0;
module.exports = conditions = {

    genId: function () {
        return "_" + arbitraryCounter++;
    },

    makeValuesHumanReadable: function(object) {
        // Make the values human-readable
        var keys = _.keys(object);
        _.each(keys, function(thingId) {
            object[thingId] = thingId;
        });
    }
};
