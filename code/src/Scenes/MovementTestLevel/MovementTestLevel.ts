import * as ex from "excalibur";
import {Class} from "../../Class";
import LockLevelCameraStrategy from "../../Components/LockLevelCameraStrategy";
import {GameBootstrap, IGameElement, IGameElementEvents} from "../../GameBootstrap";
import Ground from "../../Components/Ground";
import Player from "./Player";
import { playerAnimationFactory } from "./PlayerAnimations";

export default class MovementTestLevel extends Class<IGameElementEvents> implements IGameElement {

	readonly sceneKey: string = "movementtestlevel";
	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000);

	engine: ex.Engine;
	scene: ex.Scene;
	bounds: ex.BoundingBox;
	ground: Ground;
	player: Player;
	loader: ex.Loader;

	constructor(bootstrap: GameBootstrap) {
		super();
		
		this.engine = bootstrap.engine;
		this.scene = new ex.Scene(this.engine);
		this.bounds = this.engine.getWorldBounds();
		this.loader = bootstrap.loader;

		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 25);
		this.player = new Player(this.bounds.right / 2, this.bounds.bottom - 100, this.levelBounds, bootstrap);
	}

	init(bootstrap: GameBootstrap): void {
		this.player.initAnimations();
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

	private buildScene = () => {
		this.scene.add(this.ground);
		this.scene.add(this.player);
		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}
}
