import * as ex from "excalibur";
import { Class } from "../../Class";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import { GameBootstrap, IGameElement, IGameElementEvents, GameElementDoneType } from "../../GameBootstrap";
import Ground from "./Ground";
import Player from "./Player";
import Cannibal from "./Cannibal";
import Background from "./Background";
import Vine from "../Level1/Vine";
import Princess from "./Princess";
import Pot from "./Pot";
import { modelSize } from "../../Components/Animations/EslanParts";
import { controlSets } from "../../Components/BasePlayer";
import BaseLevel from "../../Components/BaseLevel";
import Resources from "../../Resources";

export default class Level4 extends BaseLevel {

	// readonly secondPlayer: boolean = true;

	readonly numCannibals: number = 3;
	readonly sceneKey: string = "level4";
	static readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 600);

	cannibals: Cannibal[] = [];
	vine: Vine;
	princess: Princess;
	pot: Pot;

	// static players: Player[] = [new Player(100, 400, Level4.levelBounds, controlSets.controls1)];

	level4Players: Player[];

	static groundTexture: ex.Texture = Resources.level4.ground;

	constructor(bootstrap: GameBootstrap) {
		// check for 
		super(
			bootstrap, 
			(bootstrap.state.names.length === 2
				? ([new Player(100, 400, Level4.levelBounds, controlSets.controls1), new Player(50, 350, Level4.levelBounds, controlSets.controls2)])
				: ([new Player(100, 400, Level4.levelBounds, controlSets.controls1)])),
				Level4.groundTexture, Resources.level4.bg.asSprite());
		this.level4Players = this.players as Player[];

		// vine + wife + pot
		this.vine = new Vine(4800, 0, 28, 2, 0.05);
		this.princess = new Princess(this.vine);
		this.pot = new Pot(4800, 550, 5, 5);

		// cannibals
		for (let i = 0; i < this.numCannibals; i++) {
			const xStart = this.randomIntFromInterval(500, 4500);
			const speedX = this.randomIntFromInterval(100, 200);
			const { w, h } = modelSize;
			this.cannibals.push(new Cannibal(xStart, this.bounds.bottom - BaseLevel.groundHeight - h / 2, w, h, speedX, 400, 4600));
		}

		for (let p of this.level4Players) {
			p.initAnimations();
		}
	}

	start(): void {
		super.start();
		this.buildScene();
	}

	dispose(): void {
		super.dispose();
		this.ground.kill();
	}

	private buildScene(): void {
		this.buildBaseScene();
		// add scene specific actors
		for (let vinePart of this.vine.getAllParts()) {
			this.scene.add(vinePart);
		}
		this.scene.add(this.princess);
		this.scene.add(this.pot);

		for (let b of this.cannibals) {
			this.scene.add(b);
		}

		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}

}
