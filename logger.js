var fs = require('fs');

(function(context) {
    var LOG_FILE_NAME = '/tmp/automationTest.log';

    context.i = function(data) {
        var msg = data + '\n';
        fs.appendFileSync(LOG_FILE_NAME, msg);
        console.log(data);
    };

})(exports);