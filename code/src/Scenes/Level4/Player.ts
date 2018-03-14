import * as ex from "excalibur";
import BasePlayer from "../../Components/BasePlayer";

export default class Level1Player extends BasePlayer {

	inJump: boolean = false;
	onVine: boolean = false;
	cameraStrategy: ex.LockCameraToActorAxisStrategy;

	constructor(x: number, y: number) {
		super(x, y);
		this.cameraStrategy = new ex.LockCameraToActorAxisStrategy(this, ex.Axis.X);
		this.color = ex.Color.Orange;
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
	}
}
