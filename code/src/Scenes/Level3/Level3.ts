import * as ex from "excalibur";
import { GameBootstrap, IGameElement, IGameElementEvents, GameElementDoneType } from "../../GameBootstrap";
import Level3Player from "./Level3Player";
import Rock from "./Rock";
import RockCreator from "./RockCreator";
import { controlSets } from "../../Components/BasePlayer";
import BaseLevel from "../../Components/BaseLevel";
import BasePlayer from "../../Components/BasePlayer";
import Resources from "../../Resources";

export default class Level3 extends BaseLevel {

	static readonly sceneKey: string = "level3";
	static readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 600);

	static readonly groundTexture: ex.Texture = Resources.level3.ground;

	public pubPlayers: BasePlayer[];

	// rocks
	rocks: Rock[] = [];
	rockCreator: RockCreator;

	constructor(bootstrap: GameBootstrap) {
		super(
			Level3.sceneKey,
			bootstrap,
			Level3.levelBounds,
			// players[]
			(bootstrap.state.names.length === 2
				? ([new Level3Player(100, 400, controlSets.controls1, bootstrap.state, true), new Level3Player(30, 250, controlSets.controls2, bootstrap.state, false)]) // two players required
				: ([new Level3Player(100, 400, controlSets.controls1, bootstrap.state, true)])), // just one player required
			Level3.groundTexture,
			Resources.level3.bg.asSprite()
		);

		this.state = bootstrap.state;
		this.pubPlayers = this.players;

		// RockCreator for cyclic generation of new rocks
		this.rockCreator = new RockCreator(this.engine, this.scene, this.bounds, this, this.rocks);

		this.buildScene();
	}

	dispose(): void {
		this.rockCreator.stop();
		super.dispose();
	}

	buildScene(): void {
		super.buildScene();
		// start rockCreator
		this.rockCreator.start();
	}

}
