import * as ex from "excalibur";
import { Class } from "../../Class";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import { GameBootstrap, IGameElement, IGameElementEvents } from "../../GameBootstrap";
import Ground from "./Ground";
import Player from "./Player";
import Cannibale from "./Cannibale";

export default class Level4 extends Class<IGameElementEvents> implements IGameElement {

	readonly sceneKey: string = "level4";
	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 600);
	readonly sceneBackgroundColor: ex.Color = ex.Color.Gray;

	engine: ex.Engine;
	scene: ex.Scene;
	bounds: ex.BoundingBox;

	// actors
	ground: Ground;
	player: Player;
	cannibales: Cannibale[] = [];

	/*
	// bubbles
	bubbles: Bubble[];
    bubbleCreator: BubbleCreator;
    */

	loader: ex.Loader;

	constructor(bootstrap: GameBootstrap) {
		super();

		this.engine = bootstrap.engine;
		this.scene = new ex.Scene(this.engine);
		this.bounds = this.engine.getWorldBounds();
		this.loader = bootstrap.loader;

		// Actor creation
		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 25);
		this.player = new Player(100, 400, this.levelBounds);

		let i = 0;
		let numCannibales = 10;
		for(i; i < numCannibales; i++) {
			let xStart = this.randomIntFromInterval(500, 4500);
			let speedX = this.randomIntFromInterval(100, 200);
			this.cannibales.push(new Cannibale(xStart, 525, 50, speedX, 400, 4600));
		}

	}

	start(): void {
		this.engine.backgroundColor = this.sceneBackgroundColor; // set background color
		ex.Physics.acc.setTo(0, 2000);
		this.scene.camera.addStrategy(new ex.LockCameraToActorAxisStrategy(this.player, ex.Axis.X));
		this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));
		this.buildScene();
	}

	dispose(): void {
		this.ground.kill();
	}

	private buildScene = () => {

		// add actors
		this.scene.add(this.ground);
		this.scene.add(this.player);
		let that = this;
		this.cannibales.forEach(function (b) {
			that.scene.add(b);
		});

		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}

	randomIntFromInterval(min: number, max: number): number {
		let t: number = Math.floor(Math.random() * (max - min + 1) + min);
		return t;
	}

}
