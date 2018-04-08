import { Texture, Sprite } from "Index";

export class CustomSprite {

	constructor(
		public texture: Texture,
		public x: number,
		public y: number,
		public width: number,
		public height: number
	) { }

	draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx.drawImage(
			this.texture.image,
			this.x,
			this.y,
			this.width,
			this.height,
			x,
			y,
			this.width,
			this.height
		);
	}

	debugDraw(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx.save();
		ctx.strokeStyle = "red";
		ctx.lineWidth = 2;
		ctx.strokeRect(x, y, this.height, this.width);
		ctx.restore();
	}

}
