import * as ex from "excalibur";
import { Class } from "../../Class";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import { GameBootstrap, IGameElement, IGameElementEvents } from "../../GameBootstrap";
import Ground from "./Ground";
import Player from "./Player";
import Rock from "./Rock";
import RockCreator from "./RockCreator";

export default class Level3 extends Class<IGameElementEvents> implements IGameElement {

	readonly sceneKey: string = "level3";
	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 600);
	readonly sceneBackgroundColor: ex.Color = ex.Color.DarkGray;

	engine: ex.Engine;
	scene: ex.Scene;
	bounds: ex.BoundingBox;

	// actors
	ground: Ground;
	player: Player;

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
		// this.ground = new Ground(this.bounds.left, this.bounds.bottom - 25);
		/* this.ground.anchor.setTo(0, 0.5);
		this.ground.body.useBoxCollision();
		this.ground.rotation = -Math.PI / 360 * 5; */

		this.player = new Player(100, 300, this.levelBounds, this.engine);

		// RockCreator for cyclic generation of new rocks
		this.rocks = [];
		this.rockCreator = new RockCreator(this.engine, this.scene, this.bounds, this.player, this.rocks);

	}

	start(): void {
		this.engine.backgroundColor = this.sceneBackgroundColor; // set background color
		ex.Physics.acc.setTo(0, 2000);
		this.scene.camera.addStrategy(this.player.cameraStrategy);
		this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));
		this.buildScene();

		// camera rotation ?!
		this.scene.camera.rotation += 0.47;
		console.log("cam rot:   " + this.scene.camera.rotation + "   (level3 - start())");
	}

	dispose(): void {
		this.ground.kill();

		this.rockCreator.stop();
		this.rocks.forEach(function (b) {
			if (!b.isKilled) { b.kill(); }
		});
	}

	private buildScene = () => {

		// add actors
		this.scene.add(this.ground);
		this.scene.add(this.player);

		// start rockCreator
		this.rockCreator.start();

		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}

}
