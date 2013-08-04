/*
    view.js
*/

var _ = require('underscore');
var util = require('util');
var logger = require('./logger');
var fs = require('fs');
var ejs = require('ejs');

var options;
var templates = {};

module.exports = view = {
    init: function init(optionsArg)
    {
        options = optionsArg;
        if (!options.viewDir) {
            throw new Error("options.viewDir is required, please tell me where the views are");
        }
    },

    render: function(query) {
        var path = options.viewDir + '/index.ejs';
        var str = fs.readFileSync(path, 'utf8');

        return ejs.render(str, {
        });
    }
};
