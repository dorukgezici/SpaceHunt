import * as ex from "excalibur";
import Player from "./Player";

export default class Crocodile extends ex.Actor {

	static readonly crocodileTextureUrl: string = require("./cloud.jpg");
	crocodileTexture: ex.Texture;
	resources: ex.ILoadable[];
	
	static readonly size = { w: 200, h: 50 };
	static readonly speedY: number = -30;
	static readonly speedX: number = 10;

	constructor(x: number, y: number, speedX: number, speedY: number) {
		super(x, y, Crocodile.size.w, Crocodile.size.h, ex.Color.Green);

		// Texture
		this.resources = [];
		this.crocodileTexture = new ex.Texture(Crocodile.crocodileTextureUrl);
		this.resources.push(this.crocodileTexture);

		//Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center of the right edge (?)

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Passive;

		this.vel = new ex.Vector(speedX, speedY);

		// On collision check if Player and trapp if true
		this.on('precollision', this.onPrecollision);
	}

	//raised every frame while colliding
	onPrecollision(ev: any) {
		// Trap player if collided
		if (ev.other.constructor.name == "Player") {
			let player: Player = ev.other;
			console.log("1st-time PLAYER precollision event raised (Level2 - Crocodile - onPrecollision())");
			player.die("You got eaten by a crocodile!");
		}
	}

	draw(ctx: CanvasRenderingContext2D, delta: number) {
		super.draw(ctx, delta);
		// Drawing asset
		// let sprite = this.crocodileTexture.asSprite();
		// sprite.draw(ctx, this.getRight(), this.getCenter().y);
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
	}

}
