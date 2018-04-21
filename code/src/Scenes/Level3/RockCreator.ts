import * as ex from "excalibur";
import Rock, { Rocktypes } from "./Rock";
import BaseLevel from "../../Components/BaseLevel";

// class for cyclically creating new rocks and adding them to the scene, in front of the player

export default class RockCreator {

	engine: ex.Engine;
	scene: ex.Scene;
	level: BaseLevel;
	rocks: Rock[];
	bounds: ex.BoundingBox;

	timer: number[] = [-1]; // to be passed by reference

	constructor(engine: ex.Engine, scene: ex.Scene, bounds: ex.BoundingBox, level: BaseLevel, rocks: Rock[]) {
		this.engine = engine;
		this.scene = scene;
		this.bounds = bounds;
		this.level = level;
		this.rocks = rocks;
	}

	start() {
		console.log("rockCreator started! (Level2 - RockCreator - start())");

		// start timer scheduling new rock creations
		let that = this;
		this.timer[0] = setTimeout(function () {
			that.createNewRockRT(that.scene, that.bounds, that.level, that.rocks, that.timer);
		}, 1500);
	}

	stop() {
		// cancel timer // kill rocks ? 
		console.log("rockCreator stopped! (Level2 - RockCreator - stop())");
		if (this.timer[0] !== -1) {

			clearInterval(this.timer[0]);
		}
	}

	createNewRockRT(scene: ex.Scene, bounds: ex.BoundingBox, level: BaseLevel, rocks: Rock[], timer: number[]) {
		console.log("creating new rock... (Level2 - RockCreator - createNewRockRT()");
		
		// determining type of the next rock
		let rock: Rock;
		if (this.randomIntFromInterval(1, 2) > 1) {
			// big rock
			rock = new Rock(level.frontPlayer.x + 800, 500, 50, -250, 1000, -550, Rocktypes.big); // big rock bouncing towards the player		
		} else {
			// small rock
			rock = new Rock(level.frontPlayer.x + 800, 500, 20, -250, 1000, -250, Rocktypes.small); // small rock "rolling" on the ground
		}

		// create new rock
		let newRockIndex = rocks.push(rock) - 1;
		scene.add(rocks[newRockIndex]);

		// create new timeout for next rock
		let nextRockInMS = this.randomIntFromInterval(1500, 2000); // (100000, 200000); // (1000, 1500);
		let that = this;
		timer[0] = setTimeout(function () {
			that.createNewRockRT(scene, bounds, level, rocks, timer);
		}, nextRockInMS);
	}

	randomIntFromInterval(min: number, max: number): number {
		let t: number = Math.floor(Math.random() * (max - min + 1) + min);
		return t;
	}

}
