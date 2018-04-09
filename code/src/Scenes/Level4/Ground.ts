import * as ex from "excalibur";
import Resources from "../../Resources";

export default class Ground extends ex.Actor {

	static readonly width: number = 5000;

	constructor(x: number, y: number) {
		super(x, y, Ground.width, 50, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		const sprite = Resources.level4.ground.asSprite();
		let offset = 0;

		while(offset < Ground.width) {
			sprite.draw(ctx, this.getLeft() + offset, this.getTop());
			offset += 70;
		}
	}
}
