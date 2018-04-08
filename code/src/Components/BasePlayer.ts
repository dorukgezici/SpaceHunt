import * as ex from "excalibur";
import { modelSize } from "./Animations/MichaelsonParts";

export default abstract class BasePlayer extends ex.Actor {

	static readonly size = modelSize;

	constructor(x: number, y: number) {
		super(x, y, BasePlayer.size.w, BasePlayer.size.h, ex.Color.Violet);
		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Active;
	}

}
