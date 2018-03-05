import * as ex from "excalibur";

export default class Ground extends ex.Actor {

	static brickTextureUrl: string = require("../Scenes/MovementTestLevel/brick.jpg");
	static readonly width: number = 5000;
	static resources: ex.ILoadable[] = [new ex.Texture(Ground.brickTextureUrl)];

	brickTexture: ex.Texture;

	constructor(x: number, y: number) {
		super(x, y, Ground.width, 50, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
		this.brickTexture = Ground.resources[0] as ex.Texture;
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		let sprite = this.brickTexture.asSprite();
		let offset = 0;

		while (offset < Ground.width) {
			sprite.draw(ctx, this.getLeft() + offset, this.getTop());
			offset += 70;
		}
	}
}


