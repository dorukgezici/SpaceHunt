import { Texture, Sprite } from "excalibur";

export class CustomTexture {

	image?: HTMLImageElement;

	constructor(
		public src: string
	) { }

	async load() {
		const a = await fetch(this.src);
		const b = await a.blob();
		const c = new Image();
		c.src = URL.createObjectURL(b);
		this.image = c;
		return c;
	}

	exTexture() {
		return new Texture(this.src);
	}

}

export class CustomSprite {

	constructor(
		public texture: { image?: HTMLImageElement },
		public x: number,
		public y: number,
		public width: number,
		public height: number
	) { }

	draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
		if (!this.texture.image)
			throw new Error("Image not loaded.");
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
