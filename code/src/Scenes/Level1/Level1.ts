import * as ex from "excalibur";
import {Class} from "../../Class";
import {GameBootstrap, IGameElement, IGameElementEvents} from "../../GameBootstrap";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import Ground from "../../Components/Ground";
import Player from "../../Components/Player";
import TreeBranch from "./TreeBranch";
import VineCreator from "./VineCreator";


export default class Level1 extends Class<IGameElementEvents> implements IGameElement {

	readonly sceneKey: string = "level1";
	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000);

	bounds: ex.BoundingBox;
	engine: ex.Engine;
	ground: Ground;
	loader: ex.Loader;
	player: Player;
	scene: ex.Scene;
	treeBranch: TreeBranch;
	vineCreator: VineCreator;

	constructor(bootstrap: GameBootstrap) {
		super();

		this.engine = bootstrap.engine;
		this.scene = new ex.Scene(this.engine);
		this.bounds = this.engine.getWorldBounds();
		this.loader = bootstrap.loader;
		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 25);
		this.vineCreator = new VineCreator(this.levelBounds.right - 400, this.levelBounds.left + 100);
		this.player = new Player(this.levelBounds.right - 50, this.levelBounds.top + 50, this.levelBounds);
		this.treeBranch = new TreeBranch(
			this.levelBounds.right - TreeBranch.branchLength / 2, this.levelBounds.top + 250);
	}

	init(bootstrap: GameBootstrap): void {
		this.registerResources();
	}

	start(): void {
		ex.Physics.acc.setTo(0, 3000);
		this.scene.camera.addStrategy(new ex.LockCameraToActorAxisStrategy(this.player, ex.Axis.X));
		this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));
		this.buildScene();
	}

	dispose(): void {
		this.ground.kill();
	}

	private registerResources() {
		this.loader.addResources(Ground.resources);
	}

	private buildScene = () => {
		this.scene.add(this.ground);
		this.scene.add(this.treeBranch);
		this.scene.add(this.player);

		let vines = this.vineCreator.createVines();

		for(let vine of vines) {
			this.scene.add(vine);
		}

		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}
}
