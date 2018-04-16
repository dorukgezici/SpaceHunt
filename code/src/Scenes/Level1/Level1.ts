import * as ex from "excalibur";
import {Class} from "../../Class";
import {GameBootstrap, GameElementDoneType, IGameElement, IGameElementEvents} from "../../GameBootstrap";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import Arrow from "./Arrow";
import Background from "../../Components/Background";
import Ground from "../../Components/Ground";
import Level1Player from "./Player";
import TreeBranch from "./TreeBranch";
import VineCreator from "./VineCreator";
import resources from "../../Resources";


export default class Level1 extends Class<IGameElementEvents> implements IGameElement {

	readonly sceneKey: string = "level1";
	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000);

	arrow: Arrow;
	background: Background | any = null;
	bounds: ex.BoundingBox;
	engine: ex.Engine;
	ground: Ground;
	loader: ex.Loader;
	player: Level1Player | any = null;
	scene: ex.Scene;
	treeBranch: TreeBranch;
	vineCreator: VineCreator;

	constructor(bootstrap: GameBootstrap) {
		super();
		this.engine = bootstrap.engine;
		this.scene = new ex.Scene(this.engine);
		this.bounds = this.engine.getWorldBounds();
		this.loader = bootstrap.loader;
		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 35);
		this.vineCreator = new VineCreator(this.levelBounds.left + 400, this.levelBounds.right - 80);
		this.treeBranch = new TreeBranch(
			this.levelBounds.left + TreeBranch.branchLength / 2, this.levelBounds.top + 250);
		this.arrow = new Arrow(this.levelBounds.right - 200, this.levelBounds.top + 200);
		this.registerResources();
	}

	init(bootstrap: GameBootstrap): void {
		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 35);
	}

	start(): void {
		this.player = new Level1Player(this.levelBounds.left + 100, this.levelBounds.top + 199, this.levelBounds.right);
		this.background = new Background(resources.level1.bg.asSprite(), this.player, 0, 0, 400, 400, 5000);
		this.player.on("fell", this.lose);
		this.player.on("won", this.win);
		ex.Physics.acc.setTo(0, 2000);
		this.scene.camera.addStrategy(this.player.cameraStrategy);
		this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));
		this.buildScene();
	}

	dispose(): void {
		for (let actor of this.scene.actors) {
			actor.kill();
		}
	}

	win = (): void => {
		// alert("You won!");
		this.player.off("won");
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Finished
		});
	}

	lose = (): void => {
		// alert("You fell down and died");
		this.player.off("fell");
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Aborted
		});
	}

	private registerResources() {
		this.loader.addResources(Arrow.resources);
	}

	private buildScene = () => {
		let vines = this.vineCreator.createVines();

		for (let vine of vines) {
			for (let vinePart of vine.getAllParts()) {
				this.scene.add(vinePart);
			}
		}

		this.scene.add(this.ground);
		this.scene.add(this.treeBranch);
		this.scene.add(this.player);

		this.scene.add(this.arrow);
		this.arrow.z = -1;

		this.scene.add(this.background);
		this.background.z = -2;

		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}
}
