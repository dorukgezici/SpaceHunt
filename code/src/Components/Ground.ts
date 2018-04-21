import * as ex from "excalibur";
// import resources from "../Resources";

export default class Ground extends ex.Actor {

	sprite: ex.Sprite;
	static width: number = 5000; // TODO: depending on levelBounds, to be given as a parameter into the constructor?

	constructor(x: number, y: number, texture: ex.Texture, height: number) {
		super(x, y, Ground.width, height, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
		this.sprite = texture.asSprite();
		this.sprite.anchor.setTo(0, 1);
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		let offset = 0;

		while (offset < Ground.width) {
			this.sprite.draw(ctx, this.getLeft() + offset, this.getBottom());
			offset += this.sprite.width;
		}
	}
}
