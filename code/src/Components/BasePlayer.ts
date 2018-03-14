import * as ex from "excalibur";

export default abstract class BasePlayer extends ex.Actor {

	static readonly size = { w: 15, h: 60 };

	constructor(x: number, y: number) {
		super(x, y, BasePlayer.size.w, BasePlayer.size.h, ex.Color.Violet);
		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Active;
	}
}
