 /*
    sensorWrapper
*/

(function(context) {
    var SENSOR_NAME_MAP = {
        "C1": "",
        "C2": "StairsBottom",
        "C3": "Closet",
        "C4": ""
    };

    function getSensorName(sensorId) {
        return SENSOR_NAME_MAP[sensorId];
    }

    function doRawSensorRecieved(sensorId) {
        var name = getSensorName(sensorId);

    }

})(exports);