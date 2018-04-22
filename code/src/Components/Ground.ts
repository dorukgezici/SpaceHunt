import * as ex from "excalibur";
// import resources from "../Resources";

export default class Ground extends ex.Actor {

	sprite: ex.Sprite;
	width: number;
	
	constructor(x: number, y: number, texture: ex.Texture, width: number, height: number) {
		super(x, y, width, height, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
		this.sprite = texture.asSprite();
		this.sprite.anchor.setTo(0, 1);
		this.width = width;
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		let offset = 0;

		while (offset < this.width) {
			this.sprite.draw(ctx, this.getLeft() + offset, this.getBottom());
			offset += this.sprite.width;
		}
	}
}
