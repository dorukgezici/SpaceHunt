import * as ex from "excalibur";
import Crocodile from "./Crocodile";
import Level2Player from "./Level2Player";
import { GameBootstrap } from "../../GameBootstrap";
import BaseLevel from "../../Components/BaseLevel";

// class for cyclically creating new bubbles and adding them to the scene, in front of the player
export default class CrocodileCreator {

	engine: ex.Engine;
	scene: ex.Scene;
	level: BaseLevel;
	crocodiles: Crocodile[];
	bounds: ex.BoundingBox;
	bootstrap: GameBootstrap;

	timer: number[] = [-1]; // to be passed by reference

	constructor(bootstrap: GameBootstrap, scene: ex.Scene, bounds: ex.BoundingBox, level: BaseLevel, crocodiles: Crocodile[]) {
		this.engine = bootstrap.engine;
		this.scene = scene;
		this.bounds = bounds;
		this.level = level;
		this.crocodiles = crocodiles;
		this.bootstrap = bootstrap;
	}

	start() {
		console.log("crocodileCreator started! (Level2 - CrocodileCreator - start())");

		// start timer scheduling new crocodile creations
		this.timer[0] = setTimeout(() => {
			this.createNewCrocodileRT(this.scene, this.bounds, this.level, this.crocodiles, this.timer);
		}, 1500);
	}

	stop() {
		// cancel timer // kill bubbles ?
		console.log("crocodileCreator stopped! (Level2 - CrocodileCreator - stop())");
		if (this.timer[0] !== -1) {
			clearInterval(this.timer[0]);
		}
	}

	createNewCrocodileRT(scene: ex.Scene, bounds: ex.BoundingBox, level: BaseLevel, crocodiles: Crocodile[], timer: number[]) {
		console.log("creating new bubble... (Level2 - CrocodileCreator - createNewCrocodileRT()");

		// determining speed of the next bubble
		let speedXB: number = this.randomIntFromInterval(-20, -100);
		let speedYB: number = this.randomIntFromInterval(0, 0);

		// time until collision = y distance of bubble starting point (at the bottom) and player / y-speed of the bubble
		let t = -1 * (bounds.bottom - level.frontPlayer.y) / speedYB;
		// console.log("t =    " + t);

		// x of possible collision point = x position of player in t seconds
		let xC = level.frontPlayer.x + (t * level.frontPlayer.vel.x);

		// starting x of the bubble = collision x - x distance travelled by the bubble until collision
		let xBStart = xC - speedXB * t;

		// create new bubble in front of the player
		let x = level.frontPlayer.x + 1000;
		// let x = xBStart;
		let newCrocodileIndex = crocodiles.push(new Crocodile(this.bootstrap, x, this.randomIntFromInterval(120, bounds.bottom - 60), speedXB, speedYB)) - 1;
		scene.add(crocodiles[newCrocodileIndex]);

		// create new timeout for next bubble
		let nextCrocodileInMS = this.randomIntFromInterval(1500, 3000);
		let that = this;
		timer[0] = setTimeout(function () {
			that.createNewCrocodileRT(scene, bounds, level, crocodiles, timer);
		}, nextCrocodileInMS);
	}

	randomIntFromInterval(min: number, max: number): number {
		let t: number = Math.floor(Math.random() * (max - min + 1) + min);
		return t;
	}

}
