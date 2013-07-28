var serverPort = 11337;


var express = require('express'),
    lights = require('./hueWrapper'),
    util = require('util'),
    logger = require('./logger'),
    sensorTriggerDecider = require('./sensorEventTriggerDecider'),
    actionRunner = require('./actionRunner'),
    wifiStatus = require('./wifiConnectStatus');

var app = express();
app.get('/', function(req, res) {
    var message = "Success!"
	res.send(message);

//    sensorTriggerDecider.handleRawInput({sensor:"C2"});
    sensorTriggerDecider.handleRawInput(req.query);
});


lights.init();
sensorTriggerDecider.init();
actionRunner.init();
//wifiStatus.init();
app.listen(serverPort);

logger.i('Server running!');
