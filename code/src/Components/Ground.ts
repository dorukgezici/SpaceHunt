import * as ex from "excalibur";
// import resources from "../Resources";

export default class Ground extends ex.Actor {

	sprite: ex.Sprite; // = resources.level1.ground;
	static width: number = 5000; // TODO: depending on levelBounds, to be given as a parameter into the constructor?

	constructor(x: number, y: number, texture: ex.Texture, height: number) {
		super(x, y, Ground.width, height, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
		this.sprite = texture.asSprite();
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		let offset = 0;

		while (offset < Ground.width) {
			this.sprite.draw(ctx, this.getLeft() + offset, this.getTop());
			// offset += 413;
			offset += this.sprite.width;
		}
	}
}
