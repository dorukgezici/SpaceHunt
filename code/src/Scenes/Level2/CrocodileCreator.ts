import * as ex from "excalibur";
import Crocodile from "./Crocodile";
import Player from "./Player";

//class for cyclically creating new bubbles and adding them to the scene, in front of the player

export default class CrocodileCreator {

    engine: ex.Engine;
    scene: ex.Scene;
    player: Player;
    crocodiles: Crocodile[];
    bounds: ex.BoundingBox;

    timer: number[] = [-1]; //to be passed by reference

    constructor(engine: ex.Engine, scene: ex.Scene, bounds: ex.BoundingBox, player: Player, crocodiles: Crocodile[]) {
        this.engine = engine;
        this.scene = scene;
        this.bounds = bounds;
        this.player = player;
        this.crocodiles = crocodiles;
    }

    start() {
        console.log("crocodileCreator started! (Level2 - CrocodileCreator - start())");

        //start timer scheduling new crocodile creations
        var that = this;
        this.timer[0] = setTimeout(function () {
            that.createNewCrocodileRT(that.scene, that.bounds, that.player, that.crocodiles, that.timer);
        }, 1500);
    }

    stop() {
        //cancel timer // kill bubbles ?
        console.log("crocodileCreator stopped! (Level2 - CrocodileCreator - stop())");
        if (this.timer[0] != -1) {
            clearInterval(this.timer[0]);
        }
    }


    //TODO: random position(hitting the player based on it's current speed and y-distance?) & intervals
    createNewCrocodileRT(scene: ex.Scene, bounds: ex.BoundingBox, player: Player, crocodiles: Crocodile[], timer: number[]) {
        console.log("creating new crocodile... (Level2 - CrocodileCreator - createNewCrocodileRT()");


        //create new bubble in front of the player
        var x = player.x + 600;
        var newCrocodileIndex = crocodiles.push(new Crocodile(x, bounds.bottom)) - 1;
        scene.add(crocodiles[newCrocodileIndex]);

        //create new timeout for next bubble
        var that = this;
        timer[0] = setTimeout(function () {
            that.createNewCrocodileRT(scene, bounds, player, crocodiles, timer);
        }, 1000);

    }


}
