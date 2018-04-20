import * as ex from "excalibur";
import resources from "../Resources";

export default class Ground extends ex.Actor {

	static grassTexture: ex.Texture = resources.level1.ground;
	static readonly width: number = 5000;

	constructor(x: number, y: number) {
		super(x, y, Ground.width, 70, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		let sprite = Ground.grassTexture.asSprite();
		let offset = 0;

		while (offset < Ground.width) {
			sprite.draw(ctx, this.getLeft() + offset, this.getTop());
			offset += 413;
		}
	}
}


