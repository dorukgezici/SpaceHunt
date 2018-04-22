import * as ex from "excalibur";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import { GameBootstrap, IGameElement, IGameElementEvents, GameElementDoneType } from "../../GameBootstrap";
import Level4Player from "./Level4Player";
import Cannibal from "./Cannibal";
import Vine from "../Level1/Vine";
import Princess from "./Princess";
import Pot from "./Pot";
import { modelSize } from "../../Components/Animations/EslanParts";
import { controlSets } from "../../Components/BasePlayer";
import BaseLevel from "../../Components/BaseLevel";
import Resources from "../../Resources";

export default class Level4 extends BaseLevel {

	readonly numCannibals: number = 2;
	static readonly sceneKey: string = "level4";
	static readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 600);
	static readonly groundTexture: ex.Texture = Resources.level4.ground;

	cannibals: Cannibal[] = [];
	vine: Vine;
	princess: Princess;
	pot: Pot;

	level4Players: Level4Player[];

	constructor(bootstrap: GameBootstrap) {
		super(
			Level4.sceneKey,
			bootstrap,
			Level4.levelBounds,
			(bootstrap.state.names.length === 2
				? ([new Level4Player(100, 400, controlSets.controls1), new Level4Player(30, 250, controlSets.controls2)]) // two players required
				: ([new Level4Player(100, 400, controlSets.controls1)])), // just one player required
			Level4.groundTexture,
			Resources.level4.bg.asSprite()
		);

		// vine + wife + pot
		this.vine = new Vine(4800, 0, 28, 2, 0.05);
		this.princess = new Princess(this.vine);
		this.pot = new Pot(4800, 550, 150, 150);

		// cannibals
		for (let i = 0; i < this.numCannibals; i++) {
			const xStart = this.randomIntFromInterval(500, 4500);
			const speedX = this.randomIntFromInterval(100, 200);
			const { w, h } = modelSize;
			this.cannibals.push(new Cannibal(xStart, this.bounds.bottom - Level4.groundHeight - h / 2, w, h, speedX, 400, 4600));
		}

		// player handling - init level-specific animations
		this.level4Players = this.players as Level4Player[];
		for (let p of this.level4Players) {
			p.initAnimations();
		}

		// add actors to scene
		this.buildScene();
	}

	buildScene(): void {
		super.buildScene();

		// add scene specific actors
		for (let vinePart of this.vine.getAllParts()) {
			this.scene.add(vinePart);
		}
		this.scene.add(this.princess);
		this.scene.add(this.pot);
		for (let b of this.cannibals) {
			this.scene.add(b);
		}
	}

	dispose(): void {
		super.dispose();
		// & cancel open timeouts if any
	}

}
