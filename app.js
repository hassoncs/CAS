var serverPort = 11337;

var express = require('express');
var Lights = require('./hueWrapper');
var util = require('util');
var logger = require('./logger');
var sensorTriggerDecider = require('./sensorEventTriggerDecider');
var actionRunner = require('./actionRunner');
var Scenes = require('./scenes');
var LightAction = require('./action/actionDirectory.js').LightAction;
var app = express();

app.get('/', function(req, res) {
    var message = "Success!"
	res.send(message);

//    sensorTriggerDecider.handleRawInput({sensor:"C2"});
    sensorTriggerDecider.handleRawInput(req.query);
});

Lights.init();
sensorTriggerDecider.init();
actionRunner.init();
app.listen(serverPort);

logger.i('Server running!');
