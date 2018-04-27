import * as ex from "excalibur";

export default class Sky extends ex.Actor {

	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
		this.collisionType = ex.CollisionType.Passive;
	}
}
