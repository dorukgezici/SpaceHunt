import * as ex from "excalibur";
import { modelSize } from "./Animations/MichaelsonParts";

export default abstract class BasePlayer extends ex.Actor {

	static readonly size = modelSize;

	controls: IControlSet;

	cameraStrategy: ex.LockCameraToActorAxisStrategy;

	constructor(x: number, y: number, controlSet: IControlSet) {
		super(x, y, BasePlayer.size.w, BasePlayer.size.h, ex.Color.Violet);
		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Active;
		this.controls = controlSet;

		this.cameraStrategy = new ex.LockCameraToActorAxisStrategy(this, ex.Axis.X);
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
