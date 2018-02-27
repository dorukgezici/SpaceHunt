import * as ex from "excalibur";
import { Class } from "../../Class";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import { GameBootstrap, IGameElement, IGameElementEvents } from "../../GameBootstrap";
import Ground from "./Ground";
import Sky from "./Sky";
import Player from "./Player";
import Bubble from "./Bubble";
import BubbleCreator from "./BubbleCreator";
import Crocodile from "./Crocodile";
import CrocodileCreator from "./CrocodileCreator";

export default class Level2 extends Class<IGameElementEvents> implements IGameElement {

	readonly sceneKey: string = "level2";
	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000);
	readonly sceneBackgroundColor: ex.Color = ex.Color.Azure;

	engine: ex.Engine;
	scene: ex.Scene;
	bounds: ex.BoundingBox;

	//actors
	ground: Ground;
	sky: Sky;
	player: Player;
	crocodile: Crocodile;

	//bubbles
	bubbles: Bubble[];
	bubbleCreator: BubbleCreator;

	// Crocodiles
	crocodiles: Crocodile[];
	crocodileCreator: CrocodileCreator;

	loader: ex.Loader;

	init(bootstrap: GameBootstrap): void {
		this.engine = bootstrap.engine;
		this.scene = new ex.Scene(this.engine);
		this.bounds = this.engine.getWorldBounds();
		this.loader = bootstrap.loader;

		//Actor creation
		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 25);
		this.player = new Player(0, this.bounds.bottom / 2, this.levelBounds);
		this.sky = new Sky(this.bounds.left + 2500, this.bounds.top + 25);
		this.crocodile = new Crocodile(0, 0);
		this.bubbles = [];
		this.crocodiles = [];

		//BubbleCreator for cyclic generation of new bubbles
		this.bubbleCreator = new BubbleCreator(this.engine, this.scene, this.bounds, this.player, this.bubbles);

		this.crocodileCreator = new CrocodileCreator(this.engine, this.scene, this.bounds, this.player, this.crocodiles);

		this.registerResources();
	}

	start(): void {
		this.engine.backgroundColor = this.sceneBackgroundColor; //set background color
		ex.Physics.acc.setTo(0, 0);
		this.scene.camera.addStrategy(new ex.LockCameraToActorAxisStrategy(this.player, ex.Axis.X));
		this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));
		this.buildScene();
	}

	dispose(): void {
		this.ground.kill();
		this.sky.kill();

		this.bubbleCreator.stop();
		this.bubbles.forEach(function (b) {
			if (!b.isKilled) { b.kill(); }
		});

		this.crocodileCreator.stop();
		this.crocodiles.forEach(function (b) {
			if (!b.isKilled) { b.kill(); }
		});
	}

	private registerResources() {
		this.loader.addResources(this.ground.resources);
		this.loader.addResources(this.sky.resources);
		this.loader.addResources(this.crocodile.resources);
	}

	private buildScene = () => {

		//add actors
		this.scene.add(this.ground);
		this.scene.add(this.player);
		this.scene.add(this.sky);

		//start bubbleCreator
		this.bubbleCreator.start();

		this.crocodileCreator.start();

		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}

}
