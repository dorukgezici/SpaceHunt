import * as ex from "excalibur";

export default class Arrow extends ex.Actor {

	static textureUrl: string = require("./Arrow.png");
	static resources: ex.ILoadable[] = [new ex.Texture(Arrow.textureUrl)];
	static readonly size = {w: 210, h: 200};

	texture: ex.Texture;

	constructor(x: number, y: number) {
		super(x, y, Arrow.size.w, Arrow.size.h);
		this.collisionType = ex.CollisionType.PreventCollision;
		this.texture = Arrow.resources[0] as ex.Texture;
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		let sprite = this.texture.asSprite();
		sprite.draw(ctx, this.getLeft(), this.getTop());
	}
}

