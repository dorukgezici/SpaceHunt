import * as ex from "excalibur";
import Bubble from "./Bubble";
import Player from "./Player";

//class for cyclically creating new bubbles and adding them to the scene, in front of the player

export default class BubbleCreator {

    engine: ex.Engine;
    scene: ex.Scene;
    player: Player;
    bubbles: Bubble[]
    bounds: ex.BoundingBox;

    timer: number[] = [-1]; //to be passed by reference

    constructor(engine: ex.Engine, scene: ex.Scene, bounds: ex.BoundingBox, player: Player, bubbles: Bubble[]) {
        this.engine = engine;
        this.scene = scene;
        this.bounds = bounds;
        this.player = player;
        this.bubbles = bubbles;
    }

    start() {
        console.log("bubbleCreator started! (Level2 - BubbleCreator - start())");

        //start timer scheduling new bubble creations
        var that = this;
        this.timer[0] = setTimeout(function () {
            that.createNewBubbleRT(that.scene, that.bounds, that.player, that.bubbles, that.timer);
        }, 1500);
    }

    stop() {
        //cancel timer // kill bubbles ? 
        console.log("bubbleCreator stopped! (Level2 - BubbleCreator - stop())");
        if (this.timer[0] != -1) {
            clearInterval(this.timer[0]);
        }
    }


    //TODO: random position(hitting the player based on it's current speed and y-distance?) & intervals
    createNewBubbleRT(scene: ex.Scene, bounds: ex.BoundingBox, player: Player, bubbles: Bubble[], timer: number[]) {
        console.log("creating new bubble... (Level2 - BubbleCreator - createNewBubbleRT()");

        /*
        //create new bubble in front of the player
        var x = player.x + 300;
        var newBubbleIndex = bubbles.push(new Bubble(x, bounds.bottom)) - 1;
        scene.add(bubbles[newBubbleIndex]);

        //create new timeout for next bubble
        var that = this;
        timer[0] = setTimeout(function () {
            that.createNewBubbleRT(scene, bounds, player, bubbles, timer);
        }, 1500);
        */
    }


}