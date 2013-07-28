 /*
    util
*/
var util = require('util')

(function(context) {
    exports.displayResult = function(result) {
        console.log(util.inspect(result));
    };
})(exports);