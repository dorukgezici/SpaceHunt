import * as ex from "excalibur";
import Vine from "../Level1/Vine";
import resources from "../../Resources";

export default class Princess extends ex.Actor {

	private vine: Vine;
	private vLast: Vine;
	private sprite: ex.Sprite;

	constructor(vine: Vine) {
		super(0, 0, 50, 50, ex.Color.Chartreuse);
		this.anchor.setTo(0.5, 0.5);
		this.vine = vine;
		this.vLast = this.vine.getAllParts()[this.vine.getAllParts().length - 1];
		this.collisionType = ex.CollisionType.Passive;
		this.sprite = resources.princess.asSprite();
		this.sprite.anchor.setTo(0.5, 0.5);
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
		this.x = this.vLast.x;
		this.y = this.vLast.y;
		this.rotation = this.vLast.rotation;
	}

	draw(ctx: any, delta: any) {
		// Optionally call original 'base' method
		// ex.Actor.prototype.draw.call(this, ctx, delta);
		this.sprite.rotation = this.rotation;
		this.sprite.draw(ctx, this.getCenter().x, this.getCenter().y);

	}

}
