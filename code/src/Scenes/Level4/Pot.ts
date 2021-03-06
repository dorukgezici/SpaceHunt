import * as ex from "excalibur";
import resources from "../../Resources";

export default class Pot extends ex.Actor {

	private sprite: ex.Sprite;

	constructor(x: number, y: number, w:number, l:number) {
		super(x, y, w, l, ex.Color.Black);
		this.anchor.setTo(0.5, 1);
		this.y = y;

		this.collisionType = ex.CollisionType.PreventCollision;
		this.sprite = resources.level4.pot.asSprite();
		this.sprite.anchor.setTo(0.5, 1);
		
	}

	draw(ctx: any, delta: any) {
		this.sprite.draw(ctx, this.getCenter().x, this.getBottom());
	}

}
