var fs = require('fs');
var logging = require('logging');

(function(context) {
    var LOG_FILE_NAME = '/tmp/automation.log';
    var log = logging.from(LOG_FILE_NAME);

    context.i = function(data) {
        log(data);
    };

})(exports);
