 /*
    sensorNameMap
*/

(function(context) {

    var SENSOR_NAME_MAP = {
        "C1": "Toilet",
        "C2": "Bathtub",
        "C3": "Closet",
        "C4": "HighBathroom"
    };

    function getSensorName(sensorId) {
        return SENSOR_NAME_MAP[sensorId];
    }

    context.getSensorName = getSensorName;

})(exports);
 