import {BoundingBox, Engine, Loader, Physics, Scene} from "excalibur";
import {Class} from "../../Class";
import {GameBootstrap, IGameElement, IGameElementEvents} from "../../GameBootstrap";
import Ground from "./Ground";
import Player from "./Player";

export default class MovementTestLevel extends Class<IGameElementEvents> implements IGameElement {

	readonly sceneKey: string = "movementtestlevel";

	engine: Engine;
	scene: Scene;
	bounds: BoundingBox;
	ground: Ground;
	player: Player;
	loader: Loader;

	init(bootstrap: GameBootstrap): void {
		this.engine = bootstrap.engine;
		this.scene = new Scene(this.engine);
		this.bounds = this.engine.getWorldBounds();

		this.ground = new Ground(this.bounds.left + 2500, this.bounds.bottom - 25);
		this.player = new Player(this.bounds.right / 2, this.bounds.bottom - 100);
		this.loadResources();
	}

	start(): void {
		Physics.acc.setTo(0, 3000);
		let that = this;

		this.loader.load().then(function() {
			that.scene.add(that.ground);
			that.scene.add(that.player);
			that.engine.addScene(that.sceneKey, that.scene);
			that.engine.goToScene(that.sceneKey);
		});

	}

	dispose(): void {
		this.ground.kill();
	}

	private loadResources() {
		this.loader = new Loader();
		this.loader.addResources(this.ground.resources);
	}
}
