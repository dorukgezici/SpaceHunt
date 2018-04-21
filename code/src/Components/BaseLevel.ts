import * as ex from "excalibur";
import { Class } from "../Class";
import { GameBootstrap, IGameElement, IGameElementEvents, GameElementDoneType } from "../GameBootstrap";
import Ground from "./Ground";
import Background from "./Background";
import BasePlayer from "./BasePlayer";
import LockLevelCameraStrategy from "./LockLevelCameraStrategy";


export default abstract class BaseLevel extends Class<IGameElementEvents> implements IGameElement {

	readonly levelBounds: ex.BoundingBox = new ex.BoundingBox(0, 0, 5000, 600);
	static groundHeight: number = 40;
	engine: ex.Engine;
	scene: ex.Scene;
	bounds: ex.BoundingBox;
	loader: ex.Loader;

	// actors
	// actors: ex.Actor[] = []; // array of all actors for joint adding & disposal?
	ground: Ground;
	background: Background;

	// players
	protected players: BasePlayer[];
	frontPlayer: BasePlayer;


	constructor(bootstrap: GameBootstrap, players: BasePlayer[], groundTexture: ex.Texture, background: ex.Sprite) {
		// TODO: throw error if players.length === 0 ?
		super();

		this.engine = bootstrap.engine;
		this.scene = new ex.Scene(this.engine);
		this.bounds = this.engine.getWorldBounds();
		this.loader = bootstrap.loader;

		this.players = players;

		// extend update method of the scene to let the camera focus the player in front -> extra function to be called after construction (and after players have been added to the array)
		this.frontPlayer = this.players[0];
		const baseUpdateMethod = this.scene.update;
		const scene = this.scene;
		const level = this;
		this.scene.update = function () {
			
			for (let p of level.players) {
				if (p.x > level.frontPlayer.x) {
					scene.camera.removeStrategy(level.frontPlayer.cameraStrategy);
					level.frontPlayer = p;
					scene.camera.addStrategy(level.frontPlayer.cameraStrategy);
					scene.camera.addStrategy(new LockLevelCameraStrategy(level.bounds, level.levelBounds));
					level.background.player = level.frontPlayer;
				}
			}
			baseUpdateMethod.apply(scene, arguments);
		};
		// end of extended update method

		this.ground = new Ground(this.levelBounds.right / 2, this.bounds.bottom - BaseLevel.groundHeight / 2, groundTexture, BaseLevel.groundHeight);
		this.background = new Background(background, this.players[0], 0, 0, this.engine.drawWidth / 2, this.engine.drawWidth / 2, 5000);

	}

	start(): void {
		ex.Physics.acc.setTo(0, 2000);
		this.scene.camera.addStrategy(this.players[0].cameraStrategy);
		this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));

		for (let p of this.players) {
			p.on("death", () => this.lose());
			p.on("won", () => this.win());
		}
	}

	buildBaseScene(): void {
		// add base actors
		this.scene.add(this.ground);
		this.scene.add(this.background);
		this.background.z = -1;
		for (let p of this.players) {
			this.scene.add(p);
		}
	}

	dispose(): void {
		// something can be done here, instead of just getting rid of TSlint
		// TODO: just cancel open timeouts?
		// &:
		// this.engine.removeScene(this.sceneKey);
	}

	win = (): void => {
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Finished
		});
	}

	lose = (): void => {
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Aborted
		});
	}

	randomIntFromInterval(min: number, max: number): number {
		let t: number = Math.floor(Math.random() * (max - min + 1) + min);
		return t;
	}

}
