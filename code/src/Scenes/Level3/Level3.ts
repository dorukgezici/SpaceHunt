import * as ex from "excalibur";
import { Class } from "../../Class";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import { GameBootstrap, IGameElement, IGameElementEvents, GameElementDoneType } from "../../GameBootstrap";
import Ground from "./Ground";
import Player from "./Player";
import Rock from "./Rock";
import RockCreator from "./RockCreator";
import Background from "./Background";
import { controlSets } from "../../Components/BasePlayer";

export default class Level3 extends Class<IGameElementEvents> implements IGameElement {

	readonly secondPlayer: boolean = false;

	readonly sceneKey: string = "level3";
	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 600);
	readonly sceneBackgroundColor: ex.Color = ex.Color.DarkGray;

	engine: ex.Engine;
	scene: ex.Scene;
	bounds: ex.BoundingBox;

	// actors
	ground: Ground;
	player: Player;
	player2: Player | undefined;
	background: Background;

	// rocks
	rocks: Rock[];
	rockCreator: RockCreator;

	loader: ex.Loader;

	constructor(bootstrap: GameBootstrap) {
		super();

		this.engine = bootstrap.engine;
		this.scene = new ex.Scene(this.engine);

		this.bounds = this.engine.getWorldBounds();
		this.loader = bootstrap.loader;

		// Actor creation
		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 25);

		this.player = new Player(100, 300, this.levelBounds, this.engine, controlSets.controls1);
		this.player.on("death", () => this.lose());
		this.player.on("won", () => this.win());
		this.player.initAnimations();

		if (this.secondPlayer) {
			this.player2 = new Player(50, 350, this.levelBounds, this.engine, controlSets.controls2);
			this.player2.on("death", () => this.lose());
			this.player2.on("won", () => this.win());
			this.player2.initAnimations();
		}

		// RockCreator for cyclic generation of new rocks
		this.rocks = [];
		this.rockCreator = new RockCreator(this.engine, this.scene, this.bounds, this.player, this.rocks);

		this.background = new Background(0, 0, this.engine.drawWidth / 2, this.engine.drawWidth / 2, 5000, this.player);

	}

	start(): void {
		this.engine.backgroundColor = this.sceneBackgroundColor; // set background color
		ex.Physics.acc.setTo(0, 2000);
		this.scene.camera.addStrategy(this.player.cameraStrategy);
		this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));
		this.buildScene();
	}

	dispose(): void {
		this.ground.kill();

		this.rockCreator.stop();
		this.rocks.forEach(function (b) {
			if (!b.isKilled) { b.kill(); }
		});
	}

	private buildScene(): void {

		// add actors
		if (this.player2) this.scene.add(this.player2);
		this.scene.add(this.ground);
		this.scene.add(this.player);
		this.scene.add(this.background);
		this.background.z = -1;

		// start rockCreator
		this.rockCreator.start();

		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}

	win = (): void => {
		this.player.kill();
		alert("won - Level3-won()");
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Finished
		});
	}

	lose = (): void => {
		alert("died - Level3-lose()");
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Aborted
		});
	}

}
