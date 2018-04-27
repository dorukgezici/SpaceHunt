import * as ex from "excalibur";
import Resources from "../../Resources";

export default class Ground extends ex.Actor {

	static readonly width: number = 5100;

	constructor(x: number, y: number) {
		super(x, y, Ground.width, 50, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
		// this.z = -1;
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		super.draw(ctx, delta);
		const sprite = Resources.level3.ground.asSprite();
		let offset = 0;

		
		while(offset < Ground.width) {
			sprite.draw(ctx, this.getLeft() + offset, this.getTop());
			offset += 70;
		}
		
	}
}