import * as ex from "excalibur";
import { modelSize } from "./Animations/MichaelsonParts";
import { IGameBootstrapState } from "../GameBootstrap";
import BaseLevel from "./BaseLevel";
import Ground from "./Ground";

export default abstract class BasePlayer extends ex.Actor {

	static readonly size = modelSize;
	public state: IGameBootstrapState;
	controls: IControlSet;

	cameraStrategy: ex.LockCameraToActorAxisStrategy;

	dead: boolean = false;
	won: boolean = false;

	constructor(x: number, y: number, controlSet: IControlSet, state: IGameBootstrapState) {
		super(x, y, BasePlayer.size.w, BasePlayer.size.h, ex.Color.Violet);
		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Active;
		this.controls = controlSet;
		this.state = state;
		this.cameraStrategy = new ex.LockCameraToActorAxisStrategy(this, ex.Axis.X);
	}

	public die(info: string) {
		if (!this.dead) {
			if (this.state.lives > 1) {
				this.state.lives -= 1;
			} else {
				this.dead = true;
				this.scene.camera.shake(50, 50, 500);
				this.kill();
				this.x = -1000;
				this.emit("death");
			}
		}
	}

	public win(info: string) {
		if (!this.won) {
			this.won = true;
			this.emit("won");
		}
	}

	// check if the player is at ground level
	isGround(): boolean {
		let groundLevel = this.scene.engine.getWorldBounds().bottom - Ground.height;
		if (groundLevel - this.getBottom() <= 5) {
			return true;
		} else {
			return false;
		}
	}

}

const controls1: IControlSet = {
	up: ex.Input.Keys.Up,
	down: ex.Input.Keys.Down,
	left: ex.Input.Keys.Left,
	right: ex.Input.Keys.Right
};

const controls2: IControlSet = {
	up: ex.Input.Keys.W,
	down: ex.Input.Keys.S,
	left: ex.Input.Keys.A,
	right: ex.Input.Keys.D
};

export const controlSets = {
	controls1,
	controls2
};

export interface IControlSet {
	up: ex.Input.Keys;
	down: ex.Input.Keys;
	left: ex.Input.Keys;
	right: ex.Input.Keys;
}
