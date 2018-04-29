import * as ex from "excalibur";
import { GameBootstrap } from "../../GameBootstrap";
import Arrow from "./Arrow";
import Level1Player from "./Level1Player";
import TreeBranch from "./TreeBranch";
import VineCreator from "./VineCreator";
import resources from "../../Resources";
import { controlSets } from "../../Components/BasePlayer";
import BaseLevel from "../../Components/BaseLevel";
import Vine from "./Vine";


export default class Level1 extends BaseLevel {

	static readonly sceneKey: string = "level1";
	static readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 800);

	static readonly groundTexture: ex.Texture = resources.level1.ground;

	arrow: Arrow;
	treeBranch: TreeBranch;
	vineCreator: VineCreator;
	vines: Vine[] = [];

	constructor(bootstrap: GameBootstrap) {
		super(
			Level1.sceneKey,
			bootstrap,
			Level1.levelBounds,
			// players[]
			(bootstrap.state.names.length === 2
				? ([new Level1Player(100, 0, Level1.levelBounds.right, controlSets.controls1, bootstrap.state, true),
				new Level1Player(30, 0, Level1.levelBounds.right, controlSets.controls2, bootstrap.state, false)]) // two players required
				: ([new Level1Player(100, 0, Level1.levelBounds.right, controlSets.controls1, bootstrap.state, true)])), // just one player required
			Level1.groundTexture,
			resources.level1.bg.asSprite()
		);

		this.vineCreator = new VineCreator(this.levelBounds.left + 400, this.levelBounds.right - 80);
		this.treeBranch = new TreeBranch(this.levelBounds.left + TreeBranch.BRANCH_LENGTH / 2, this.levelBounds.top + 250);
		this.arrow = new Arrow(this.levelBounds.right - 200, this.levelBounds.top + 200);
		this.players.map(p => { p.on("reset", this.onPlayerReset.bind(this)); });
		this.buildScene();
	}

	dispose() {
		super.dispose();
		(this.players as Level1Player[]).forEach(t => t.dispose());
	}

	buildScene(): void {
		super.buildScene();

		this.vines = this.vineCreator.createVines();
		for (let vine of this.vines) {
			for (let vinePart of vine.getAllParts()) {
				this.scene.add(vinePart);
			}
		}

		this.ground.z = 2;
		this.scene.add(this.treeBranch);
		this.scene.add(this.arrow);
		this.arrow.z = -1;
		this.background.z = -2;
	}

	private onPlayerReset(e: ex.GameEvent<Level1Player>) {
		for (let vine of this.vines) {
			let indexInCollidedList = vine.alreadyCollidedWith.indexOf(e.target);

			if (indexInCollidedList !== -1) {
				vine.alreadyCollidedWith.splice(indexInCollidedList, 1);
			}
		}

		this.state.score = Math.round(this.state.score / 2);
	}
}
