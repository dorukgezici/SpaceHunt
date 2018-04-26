import * as ex from "excalibur";
import resources from "../Resources";

export default class Ground extends ex.Actor {

	static readonly width: number = 5000;
	private grassSprite: ex.Sprite;

	constructor(x: number, y: number) {
		super(x, y, Ground.width, 70, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
		this.grassSprite = resources.level1.ground.asSprite();
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		let offset = 0;

		while (offset < Ground.width) {
			this.grassSprite.draw(ctx, this.getLeft() + offset, this.getTop());
			offset += 413;
		}
	}
}


