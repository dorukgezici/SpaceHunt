import * as ex from "excalibur";
import resources from "../Resources";

export default class Ground extends ex.Actor {

	static readonly width: number = 5000;

	sprite: ex.Sprite;

	constructor(x: number, y: number) {
		super(x, y, Ground.width, 50, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
		this.sprite = resources.ground.asSprite();
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		let offset = 0;

		while (offset < Ground.width) {
			this.sprite.draw(ctx, this.getLeft() + offset, this.getTop());
			offset += 70;
		}
	}
}


