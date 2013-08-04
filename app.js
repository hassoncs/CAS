var _ = require('underscore');
var express = require('express');
var Lights = require('./hueWrapper');
var util = require('util');
var logger = require('./logger');
var actionRunner = require('./actionRunner');
var Scenes = require('./scenes');
var Facade = require('./facade');
var LightAction = require('./action/actionDirectory.js').LightAction;
var http = require('http');
var faye = require('faye');
var ejs = require('ejs');
var view = require('./view.js');
var pubsub = require('./pubsub.js');
var app = express();

var SERVER_PORT = 11337;

app.get('/', function(req, res) {
    var query = req.query;

    Facade.handleQuery(query);
	res.send(view.render(query));
});


pubsub.init();
Lights.init();
actionRunner.init();
view.init({viewDir: __dirname + '/views'});

app.use(express.static(__dirname + '/public'));
app.listen(SERVER_PORT);
logger.i(util.format('Web server running on port %d', SERVER_PORT));
