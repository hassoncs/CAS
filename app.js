var serverPort = 11337;

var express = require('express');
var Lights = require('./hueWrapper');
var util = require('util');
var logger = require('./logger');
var rootTriggerGroup = require('./triggers/rootTriggerGroup');
var actionRunner = require('./actionRunner');
var Scenes = require('./scenes');
var LightAction = require('./action/actionDirectory.js').LightAction;
var app = express();

app.get('/', function(req, res) {
    var query = req.query;

    var message = "Success!"
	res.send(message);

    logger.i(util.inspect(query));
//    query.sensor = sensorNames.getSensorName(query.sensor) || query.sensor;
    rootTriggerGroup.rootTriggerGroup.fire(query);
});

Lights.init();
actionRunner.init();
app.listen(serverPort);

logger.i('Server running!');
