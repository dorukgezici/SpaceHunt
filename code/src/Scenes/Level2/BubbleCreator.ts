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
        }, 3000);
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

        //determining speed of the next bubble
        let speedXB : number = this.randomIntFromInterval(20, 100);
        var speedYB = this.randomIntFromInterval(-100, -200);

        // time until collision = y distance of bubble starting point (at the bottom) and player / y-speed of the bubble
        var t = -1 * (bounds.bottom - player.y) / speedYB;
        //console.log("t =    " + t);

        // x of possible collision point = x position of player in t seconds
        var xC = player.x + (t * player.vel.x);

        // starting x of the bubble = collision x - x distance travelled by the bubble until collision
        var xBStart = xC - speedXB * t;

        //create new bubble in front of the player
        //var x = player.x + 300;
        var x = xBStart;
        var newBubbleIndex = bubbles.push(new Bubble(x, bounds.bottom, speedXB, speedYB)) - 1;
        scene.add(bubbles[newBubbleIndex]);

        //create new timeout for next bubble
        var nextBubbleInMS = this.randomIntFromInterval(1000, 3000);
        var that = this;
        timer[0] = setTimeout(function () {
            that.createNewBubbleRT(scene, bounds, player, bubbles, timer);
        }, nextBubbleInMS);

    }


    randomIntFromInterval(min: number, max: number):number {
        var t:number = Math.floor(Math.random() * (max - min + 1) + min);
        return t;
    }

}