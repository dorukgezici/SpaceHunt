import * as ex from "excalibur";
import { Class } from "../../Class";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import { GameBootstrap, IGameElement, IGameElementEvents, GameElementDoneType } from "../../GameBootstrap";
import Ground from "./Ground";
import Sky from "./Sky";
import Player from "./Player";
import Bubble from "./Bubble";
import BubbleCreator from "./BubbleCreator";
import Crocodile from "./Crocodile";
import CrocodileCreator from "./CrocodileCreator";
import Background from "./Background";
import { controlSets } from "../../Components/BasePlayer";

export default class Level2 extends Class<IGameElementEvents> implements IGameElement {

	// create second player?
	readonly secondPlayer: boolean = true;
	player2: Player | undefined;
	oxygenMeter2: ex.Label | undefined; // TODO: create second oxygenMeter also on screen (this one here doesn't really work as supposed? :D)
	players: Player[] = []; // to be passed to the bubbleCreator

	readonly sceneKey: string = "level2";
	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 600);
	readonly sceneBackgroundColor: ex.Color = ex.Color.Azure;

	engine: ex.Engine;
	scene: ex.Scene;
	bounds: ex.BoundingBox;

	// actors
	ground: Ground;
	sky: Sky;
	player: Player;
	oxygenMeter: ex.Label;
	background: Background;

	// bubbles
	bubbles: Bubble[];
	bubbleCreator: BubbleCreator;

	// Crocodiles
	crocodiles: Crocodile[];
	crocodileCreator: CrocodileCreator;

	loader: ex.Loader;

	constructor(bootstrap: GameBootstrap) {
		super();

		this.engine = bootstrap.engine;
		this.scene = new ex.Scene(this.engine);
		this.bounds = this.engine.getWorldBounds();
		this.loader = bootstrap.loader;

		// Actor creation
		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 25);
		this.sky = new Sky(this.bounds.left + 2500, this.bounds.top + 62);
		this.oxygenMeter = new ex.Label("Oxygen Level: 100/100", this.bounds.left + 30, this.bounds.top + 50);
		this.oxygenMeter.fontSize = 30;

		this.player = new Player(0, this.bounds.bottom / 2, this.levelBounds, this.oxygenMeter, controlSets.controls1);
		this.player.on("win", this.win.bind(this));
		this.player.on("death", this.lose.bind(this));
		this.players.push(this.player);

		if (this.secondPlayer) {
			this.oxygenMeter2 = new ex.Label("Oxygen Level 2: 100/100", this.bounds.left + 230, this.bounds.top + 50);
			this.oxygenMeter2.fontSize = 30;

			this.player2 = new Player(0, this.bounds.bottom / 2 - 100, this.levelBounds, this.oxygenMeter2, controlSets.controls2);
			this.player2.on("win", this.win.bind(this));
			this.player2.on("death", this.lose.bind(this));
			this.players.push(this.player2);
		}

		this.background = new Background(0, 0, this.engine.drawWidth / 2, this.engine.drawWidth / 2, 5000, this.player);

		this.bubbles = [];
		this.crocodiles = [];

		// BubbleCreator for cyclic generation of new bubbles
		this.bubbleCreator = new BubbleCreator(this.engine, this.scene, this.bounds, this.players, this.bubbles);

		// CrocodileCreator for generation of new crocodiles
		this.crocodileCreator = new CrocodileCreator(bootstrap, this.scene, this.bounds, this.player, this.crocodiles);

		this.engine.backgroundColor = this.sceneBackgroundColor; // set background color
		ex.Physics.acc.setTo(0, 0);
		this.scene.camera.addStrategy(new ex.LockCameraToActorAxisStrategy(this.player, ex.Axis.X));
		this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));
		this.buildScene();
	}

	private buildScene = () => {
		// add actors
		this.scene.add(this.ground);
		this.scene.add(this.sky);
		this.scene.add(this.player);
		if (this.player2) this.scene.add(this.player2);
		this.scene.add(this.background);

		this.background.z = -1;
		this.scene.addUIActor(this.oxygenMeter);
		if(this.oxygenMeter2)this.scene.addUIActor(this.oxygenMeter2);
		// start bubbleCreator and crocodileCreator
		this.bubbleCreator.start();
		this.crocodileCreator.start();

		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}

	dispose(): void {
		this.engine.removeScene(this.sceneKey);
		this.bubbleCreator.stop();
		this.crocodileCreator.stop();
	}

	win() {
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Finished
		});
	}

	lose() {
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Aborted
		});
	}

}
