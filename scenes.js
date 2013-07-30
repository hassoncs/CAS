
var _ = require('underscore');
var hue = require('./hueWrapper');
var logger = require('./logger');
var Actions = require('./action/actionDirectory');
var LightAction = Actions.LightAction;
var ColorBrightnessLightCommand = hue.ColorBrightnessLightCommand;
var OffLightCommand = hue.OffLightCommand;
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
    var hallwayLightGroup = new LightGroup("hallway", ["Hallway", "Stairs Top", "Stairs Bottom"]);
    var stairsLightGroup = new LightGroup("stairs", ["Stairs Top", "Stairs Bottom"]);
    var bathroomLightGroup = new LightGroup("bathroom", ["Bathtub", "Toilet"]);
    var allLightGroup = new LightGroup("all", [
        "Bedroom Main", "Bedroom Window", "Bedroom Spotlight",
        "Hallway", "Stairs Top", "Stairs Bottom", "Bathtub", "Toilet"
    ]);

    context.WelcomeHome = new Scene([
        new LightAction(new Light("Stairs Bottom"), new ColorBrightnessLightCommand(Color.randomColor(), 100, 1)),
        new LightAction(new Light("Stairs Top"), new ColorBrightnessLightCommand(Color.randomColor(), 100, 3)),
        new LightAction(new Light("Hallway"), new ColorBrightnessLightCommand(Color.randomColor(), 100, 5)),
        new LightAction(bedroomLightGroup, new ColorBrightnessLightCommand(Color.randomColor(), 100, 5))
    ]);

    context.AllOff = new Scene([
        new LightAction(allLightGroup, new OffLightCommand())
    ]);

    context.SomebodyHome = new Scene([
        new LightAction(bedroomLightGroup, new ColorBrightnessLightCommand(Color.randomColor(), 100, 10))
    ]);

})(exports);
