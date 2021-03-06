import * as ex from "excalibur";
import { Class } from "../Class";
import { GameBootstrap, IGameElement, IGameElementEvents, IGameBootstrapState, GameElementDoneType } from "../GameBootstrap";
import Ground from "./Ground";
import Background from "./Background";
import BasePlayer from "./BasePlayer";
import LockLevelCameraStrategy from "./LockLevelCameraStrategy";


export default abstract class BaseLevel extends Class<IGameElementEvents> implements IGameElement {

	sceneKey: string;

	levelBounds: ex.BoundingBox;
	engine: ex.Engine;
	scene: ex.Scene;
	bounds: ex.BoundingBox;
	loader: ex.Loader;
	state: IGameBootstrapState;

	// actors
	ground: Ground;
	background: Background;

	// players
	protected players: BasePlayer[];
	followedPlayer: BasePlayer;
	frontPlayer: BasePlayer;

	constructor(sceneKey: string, bootstrap: GameBootstrap, levelBounds: ex.BoundingBox, players: BasePlayer[], groundTexture: ex.Texture, background: ex.Sprite, backgroundYSpeed?: number) {
		super();

		this.sceneKey = sceneKey;
		this.engine = bootstrap.engine;
		this.scene = new ex.Scene(this.engine);
		this.bounds = this.engine.getWorldBounds();
		this.loader = bootstrap.loader;
		this.levelBounds = levelBounds;
		this.state = bootstrap.state;

		this.players = players;

		this.followedPlayer = this.players[0];
		this.frontPlayer = this.players[0];

		const baseUpdateMethod = this.scene.update;
		const scene = this.scene;
		this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));

		this.scene.update = (engine: ex.Engine, delta: number) => {
			for(let p of this.players) {
				if(p.getWorldPos().x > this.frontPlayer.getWorldPos().x) {
					this.frontPlayer = p;
				}
			}

			if(engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
				for(let p of this.players) {
					if(p !== this.followedPlayer) {
						scene.camera.removeStrategy(this.followedPlayer.cameraStrategy);
						scene.camera.addStrategy(p.cameraStrategy);
						this.followedPlayer = p;
						this.background.player = this.followedPlayer;
						this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));
						break;
					}
				}
			}

			baseUpdateMethod.apply(scene, [engine, delta]);
		};
		// end of extended update method

		// ground & background
		this.ground = new Ground(this.levelBounds.right / 2, this.bounds.bottom - Ground.height / 2, groundTexture, levelBounds.getWidth());
		this.background = new Background(background, this.players[0], 0, 0, this.engine.drawWidth / 2 + 100, this.engine.drawWidth / 2 + 100, 5000, backgroundYSpeed);

		// further scene properties
		ex.Physics.acc.setTo(0, 2000);
		this.scene.camera.addStrategy(this.players[0].cameraStrategy);
		this.scene.camera.addStrategy(new LockLevelCameraStrategy(this.bounds, this.levelBounds));

		// wiring general player events
		for (let p of this.players) {
			p.on("death", () => this.lose());
			p.on("won", () => this.win());
		}

	}

	buildScene(): void {
		// add base actors
		this.scene.add(this.ground);
		this.scene.add(this.background);
		this.background.z = -1;
		for (let p of this.players) {
			this.scene.add(p);
		}
		this.engine.addScene(this.sceneKey, this.scene);
		this.engine.goToScene(this.sceneKey);
	}

	dispose(): void {
		this.engine.removeScene(this.sceneKey);
	}

	winners: number = 0;
	win = (): void => {
		// count and only emit done if all players finished the game? // same for lose?? -> only in last level
		this.winners++;
		if(this.winners >= this.players.length)
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
