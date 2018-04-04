import * as ex from "excalibur";
import { Class } from "../../Class";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import { GameBootstrap, IGameElement, IGameElementEvents, GameElementDoneType } from "../../GameBootstrap";
import Ground from "./Ground";
import Player from "./Player";
import Cannibale from "./Cannibale";
import Background from "./Background";
import Vine from "../Level1/Vine";
import Princess from "./Princess";
import Pot from "./Pot";

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
	background: Background;
	vine: Vine;
	princess: Princess;
	pot: Pot;

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
		this.player.on("death", () => this.lose());
		this.player.on("won", () => this.win());
		this.player.initAnimations();

		// vine + wife + pot
		this.vine = new Vine (4800, 0, 28, 2, 0.05);
		this.princess = new Princess(this.vine);
		this.pot = new Pot(4800, 550, 5, 5);

		this.background = new Background(0, 0, 400, 400, 5000, this.player);

		// cannibales
		let i = 0;
		let numCannibales = 1;
		for (i; i < numCannibales; i++) {
			let xStart = this.randomIntFromInterval(500, 4500);
			let speedX = this.randomIntFromInterval(100, 200);
			let w = this.randomIntFromInterval(20, 30);
			let h = this.randomIntFromInterval(40, 60);
			this.cannibales.push(new Cannibale(xStart, 600 - 50 - h / 2, w, h, speedX, 400, 4600));
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
		this.scene.add(this.background);
		this.background.z = -1;
		for (let vinePart of this.vine.getAllParts()) {
			this.scene.add(vinePart);
		}
		this.scene.add(this.princess);
		this.scene.add(this.pot);

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

	win = (): void => {
		alert("won - Level4-won()");
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Finished
		});
	}

	lose = (): void => {
		alert("died - Level4-lose()");
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Aborted
		});
	}

}
