var serverPort = 11337;

var express = require('express');
var Lights = require('./hueWrapper');
var util = require('util');
var logger = require('./logger');
var actionRunner = require('./actionRunner');
var Scenes = require('./scenes');
var Facade = require('./facade');
var LightAction = require('./action/actionDirectory.js').LightAction;
var app = express();

app.get('/', function(req, res) {
    var query = req.query;

    var message = "Success!"
	res.send(message);

    Facade.handleQuery(query);
});

Lights.init();
actionRunner.init();
app.listen(serverPort);

logger.i('Server running!');
