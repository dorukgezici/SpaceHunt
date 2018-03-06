import * as ex from "excalibur";
import {Class} from "../../Class";
import {GameBootstrap, IGameElement, IGameElementEvents} from "../../GameBootstrap";
import Ground from "../../Components/Ground";
import Vine from "./Vine";

export default class Level1 extends Class<IGameElementEvents> implements IGameElement {

	readonly sceneKey: string = "level1";
	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000);

	engine: ex.Engine;
	scene: ex.Scene;
	bounds: ex.BoundingBox;
	ground: Ground;
	loader: ex.Loader;
	vine: Vine;

	constructor(bootstrap: GameBootstrap) {
		super();

		this.engine = bootstrap.engine;
		this.scene = new ex.Scene(this.engine);
		this.bounds = this.engine.getWorldBounds();
		this.loader = bootstrap.loader;
		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 25);
		this.vine = new Vine(this.bounds.right / 2, this.bounds.top, 20, 2.5, 0.9);
	}

	init(bootstrap: GameBootstrap): void {
		this.registerResources();
	}

	start(): void {
		ex.Physics.acc.setTo(0, 3000);
		this.buildScene();
	}

	dispose(): void {
		this.ground.kill();
	}

	private registerResources() {
		this.loader.addResources(Ground.resources);
	}

	private buildScene = () => {
		this.scene.add(this.vine);
		this.scene.add(this.ground);
		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}
}
