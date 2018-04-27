import * as ex from "excalibur";
import { Class } from "../../Class";
import { GameBootstrap, GameElementDoneType, IGameElement, IGameElementEvents } from "../../GameBootstrap";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import Arrow from "./Arrow";
import Background from "../../Components/Background";
import Ground from "../../Components/Ground";
import Level1Player from "./Level1Player";
import TreeBranch from "./TreeBranch";
import VineCreator from "./VineCreator";
import resources from "../../Resources";
import { controlSets } from "../../Components/BasePlayer";
import BaseLevel from "../../Components/BaseLevel";


export default class Level1 extends BaseLevel {

	static readonly sceneKey: string = "level1";
	static readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 800);

	static readonly groundTexture: ex.Texture = resources.level1.ground;

	arrow: Arrow;
	treeBranch: TreeBranch;
	vineCreator: VineCreator;

	constructor(bootstrap: GameBootstrap) {
		super(
			Level1.sceneKey,
			bootstrap,
			Level1.levelBounds,
			// players[]
			(bootstrap.state.names.length === 2
				? ([new Level1Player(100, 0, Level1.levelBounds.right, controlSets.controls1, bootstrap.state),
				new Level1Player(30, 0, Level1.levelBounds.right, controlSets.controls2, bootstrap.state)]) // two players required
				: ([new Level1Player(100, 0, Level1.levelBounds.right, controlSets.controls1, bootstrap.state)])), // just one player required
			Level1.groundTexture,
			resources.level1.bg.asSprite()
		);

		this.vineCreator = new VineCreator(this.levelBounds.left + 400, this.levelBounds.right - 80);
		this.treeBranch = new TreeBranch(this.levelBounds.left + TreeBranch.BRANCH_LENGTH / 2, this.levelBounds.top + 250);
		this.arrow = new Arrow(this.levelBounds.right - 200, this.levelBounds.top + 200);

		this.buildScene();
	}

	buildScene(): void {
		super.buildScene();

		let vines = this.vineCreator.createVines();
		for (let vine of vines) {
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
}
