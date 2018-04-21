import * as ex from "excalibur";
import { GameBootstrap, IGameElement, IGameElementEvents, GameElementDoneType } from "../../GameBootstrap";
import Sky from "./Sky";
import Level2Player from "./Level2Player";
import Bubble from "./Bubble";
import BubbleCreator from "./BubbleCreator";
import Crocodile from "./Crocodile";
import CrocodileCreator from "./CrocodileCreator";
import { controlSets } from "../../Components/BasePlayer";
import BaseLevel from "../../Components/BaseLevel";
import Resources from "../../Resources";

export default class Level2 extends BaseLevel {

	static readonly sceneKey: string = "level2";
	static readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 600);

	static readonly groundTexture: ex.Texture = Resources.seaBed;

	// players
	level2Players: Level2Player[];

	// sky
	sky: Sky;

	// bubbles
	bubbles: Bubble[];
	bubbleCreator: BubbleCreator;

	// Crocodiles
	crocodiles: Crocodile[];
	crocodileCreator: CrocodileCreator;

	constructor(bootstrap: GameBootstrap) {
		super(
			Level2.sceneKey,
			bootstrap,
			Level2.levelBounds,
			// players[]
			(bootstrap.state.names.length === 2
				? ([new Level2Player(100, 400, controlSets.controls1,
					new ex.Label("Oxygen Level: 100/100", Level2.levelBounds.left + 30, Level2.levelBounds.top + 50)
				), new Level2Player(30, 250, controlSets.controls2,
					new ex.Label("Oxygen Level: 100/100", Level2.levelBounds.left + 530, Level2.levelBounds.top + 50)
				)]) // two players required
				: ([new Level2Player(100, 400, controlSets.controls1,
					new ex.Label("Oxygen Level: 100/100", Level2.levelBounds.left + 30, Level2.levelBounds.top + 50)
				)])), // just one player required
			Level2.groundTexture,
			Resources.level3.bg.asSprite(),
			0.001 // background y movement speed
		);

		// reset physics
		ex.Physics.acc.setTo(0, 0);

		this.level2Players = this.players as Level2Player[];
		for (let p of this.level2Players) {
			// p.initAnimations();
		}


		// Actor creation
		this.sky = new Sky(this.bounds.left + 2500, this.bounds.top + 62);

		this.bubbles = [];
		this.crocodiles = [];

		// BubbleCreator for cyclic generation of new bubbles
		this.bubbleCreator = new BubbleCreator(this.engine, this.scene, this.bounds, this.level2Players, this.bubbles);

		// CrocodileCreator for generation of new crocodiles
		this.crocodileCreator = new CrocodileCreator(bootstrap, this.scene, this.bounds, this, this.crocodiles);

		this.buildScene();
	}

	buildScene(): void {
		super.buildScene();

		// add actors
		this.scene.add(this.sky);
		for (let p of this.level2Players) {
			this.scene.addUIActor(p.oxygenMeter);
		}

		// start bubbleCreator and crocodileCreator
		this.bubbleCreator.start();
		this.crocodileCreator.start();
	}

	dispose(): void {
		this.bubbleCreator.stop();
		this.crocodileCreator.stop();
		super.dispose();
	}

}
