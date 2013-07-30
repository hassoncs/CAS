
var _ = require('underscore');

(function(context) {

    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    context.randomColor = function() {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    };
    context.randomColorful = function() {
        var colors = _.shuffle([_.random(0, 50), _.random(125,255), _.random(125,255)]);
        return new Color(colors[0], colors[1], colors[2]);
    };

})(exports);