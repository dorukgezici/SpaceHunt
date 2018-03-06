import * as ex from "excalibur";
import resources from "../../Resources";

export default class Sky extends ex.Actor {

	static readonly width: number = 5000;

	constructor(x: number, y: number) {
		super(x, y, Sky.width, 50, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Passive;
		this.color = ex.Color.fromHex("#59C9FF");
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		super.draw(ctx, delta);
		let sprite = resources.sky.asSprite();
		let offset = 0;
		let rndm = new ex.Random(47);

		while (offset < Sky.width) {
			sprite.draw(ctx, this.getLeft() + offset, this.getTop());
			offset += rndm.integer(43, 250);// 70;
		}
	}

}
