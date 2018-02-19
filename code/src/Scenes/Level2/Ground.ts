import * as ex from "excalibur";

export default class Ground extends ex.Actor {

	readonly brickTextureUrl: string = require("./seabed.jpg");
	static readonly width: number = 5000;

	brickTexture: ex.Texture;
	resources: ex.ILoadable[];

	constructor(x: number, y: number) {
		super(x, y, Ground.width, 50, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
		this.resources = [];
		this.brickTexture = new ex.Texture(this.brickTextureUrl);
		this.resources.push(this.brickTexture);
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		let sprite = this.brickTexture.asSprite();
		let offset = 0;

		while(offset < Ground.width) {
			sprite.draw(ctx, this.getLeft() + offset, this.getTop());
			offset += 70;
		}
	}
}


