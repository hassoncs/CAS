
var _ = require('underscore');
var hue = require('./hueWrapper');
var logger = require('./logger');
var Actions = require('./action/actionDirectory');
var LightAction = Actions.LightAction;
var ColorBrightnessLightCommand = hue.ColorBrightnessLightCommand;
var Color = require('./color.js');
var LightGroup = hue.LightGroup;
var Light = hue.Light;

(function(context) {

    function Scene(lightActions) {
        this.actionType = "Scene";
        this.lightActions = lightActions;
        if (!_.isArray(lightActions)) {
            this.lightActions = [lightActions];
        }
//        logger.i("Created Scene with lights:");
//        _.each(lightActions, function(action) {
//            logger.i(action.light.name);
//        });
    }
    Scene.prototype.activate = function() {
        logger.i("Scene was activated.");
        _.each(this.lightActions, function(lightAction) {
            lightAction.run();
        });
    }

    var entranceLightGroup = new LightGroup("entrance", ["Stairs Bottom", "Stairs Top", "Hallway"]);
    var bedroomLightGroup = new LightGroup("bedroom", ["Bedroom Main", "Bedroom Window", "Bedroom Spotlight"]);

    context.WelcomeHomeScene = new Scene([
        new LightAction(new Light("Stairs Bottom"), new ColorBrightnessLightCommand(Color.randomColor(), 100, 1)),
        new LightAction(new Light("Stairs Top"), new ColorBrightnessLightCommand(Color.randomColor(), 100, 3)),
        new LightAction(new Light("Hallway"), new ColorBrightnessLightCommand(Color.randomColor(), 100, 5)),
        new LightAction(bedroomLightGroup, new ColorBrightnessLightCommand(Color.randomColor(), 100, 5))
    ]);

})(exports);
