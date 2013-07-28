

(function(context) {

    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    context.randomColor = function() {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    };

})(exports);