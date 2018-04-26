import * as ex from "excalibur";
import Resources from "../../Resources";

export default class Arrow extends ex.Actor {

	static readonly size = { w: 210, h: 200 };

	sprite: ex.Sprite;

	constructor(x: number, y: number) {
		super(x, y, Arrow.size.w, Arrow.size.h);
		this.collisionType = ex.CollisionType.PreventCollision;
		this.sprite = Resources.level1.arrow.asSprite();
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		this.sprite.draw(ctx, this.getLeft(), this.getTop());
	}
}
