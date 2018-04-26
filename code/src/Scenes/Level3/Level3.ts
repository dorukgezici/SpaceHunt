import * as ex from "excalibur";
import { Class } from "../../Class";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import { GameBootstrap, IGameElement, IGameElementEvents, IGameBootstrapState, GameElementDoneType } from "../../GameBootstrap";
import Ground from "./Ground";
import Player from "./Player";
import Rock from "./Rock";
import RockCreator from "./RockCreator";
import Background from "./Background";

export default class Level3 extends Class<IGameElementEvents> implements IGameElement {

	readonly sceneKey: string = "level3";
	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 600);
	readonly sceneBackgroundColor: ex.Color = ex.Color.DarkGray;

	engine: ex.Engine;
	scene: ex.Scene;
	bounds: ex.BoundingBox;

	state: IGameBootstrapState;

	// actors
	ground: Ground;
	player: Player;
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

		this.state = bootstrap.state;

		// Actor creation
		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 25);
		// this.ground = new Ground(this.bounds.left, this.bounds.bottom - 25);
		/* this.ground.anchor.setTo(0, 0.5);
		this.ground.body.useBoxCollision();
		this.ground.rotation = -Math.PI / 360 * 5; */

		this.player = new Player(100, 300, this.levelBounds, this.engine, this.state);
		this.player.on("death", () => this.lose());
		this.player.on("won", () => this.win());
		this.player.initAnimations();

		// RockCreator for cyclic generation of new rocks
		this.rocks = [];
		this.rockCreator = new RockCreator(this.engine, this.scene, this.bounds, this.player, this.rocks);

		this.background = new Background(0, 0, 400, 400, 5000, this.player);

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
		this.rockCreator.stop();
		this.engine.removeScene(this.sceneKey);
	}

	private buildScene = () => {
		// add actors
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
		if (this.state.lives > 1) {
			this.state.lives -= 1;
		} else {
			this.emit("done", {
				target: this,
				type: GameElementDoneType.Aborted
			});	
		}
	}

}
