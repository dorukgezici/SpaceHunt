import * as ex from "excalibur";

export default class Sky extends ex.Actor {

	readonly brickTextureUrl: string = require("./cloud.jpg");
	static readonly width: number = 5000;

	brickTexture: ex.Texture;
	resources: ex.ILoadable[];

	constructor(x: number, y: number) {
		super(x, y, Sky.width, 50, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Passive;
		this.color = ex.Color.fromHex("#59C9FF");
		this.resources = [];
		this.brickTexture = new ex.Texture(this.brickTextureUrl);
		this.resources.push(this.brickTexture);
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		super.draw(ctx, delta);
		let sprite = this.brickTexture.asSprite();
		let offset = 0;
		let rndm = new ex.Random(47);

		while(offset < Sky.width) {
			sprite.draw(ctx, this.getLeft() + offset, this.getTop());
			offset += rndm.integer(43, 250);// 70;
		}
	}

}
