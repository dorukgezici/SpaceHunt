import * as ex from "excalibur";
import resources from "../../Resources";

export default class Sky extends ex.Actor {

	static readonly width: number = 5000;

	constructor(x: number, y: number) {
		super(x, y, Sky.width, 125);
		this.collisionType = ex.CollisionType.Passive;
	}
}
