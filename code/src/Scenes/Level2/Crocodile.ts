import * as ex from "excalibur";
import Player from "./Player";

export default class Crocodile extends ex.Actor {

	static readonly crocodileTextureUrl: string = require("./crocodile.jpg");

	crocodileTexture: ex.Texture;
	resources: ex.ILoadable[];
	static readonly size = { w: 200, h: 50 };

	static readonly speedY: number = -30;
	static readonly speedX: number = 10;

	playerCollision: boolean = false;
	collidedPlayer: Player | null = null;

	constructor(x: number, y: number) {
		super(x, y, Crocodile.size.w, Crocodile.size.h, ex.Color.White);

		// Texture
		this.resources = [];
		this.crocodileTexture = new ex.Texture(Crocodile.crocodileTextureUrl);
		this.resources.push(this.crocodileTexture);

		//Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center of the right edge (?)

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Passive;

		this.vel = new ex.Vector(Crocodile.speedX, Crocodile.speedY);

		// On collision check if Player and trapp if true
		this.on('precollision', this.onPrecollision);
	}

	//raised every frame while colliding
	onPrecollision(ev: any) {
		//console.log("precollision event raised");
		//trap player if collided
		if (!this.playerCollision && ev.other.constructor.name == "Player" && !ev.other.trapped) {
			console.log("1st-time PLAYER precollision event raised (Level2 - Crocodile - onPrecollision())");
			this.playerCollision = true;

		}
		//un-trap player if reaching sky
		else if (ev.other.constructor.name == "Sky") {
		}
		//kill bubble when reaching sky
		if (ev.other.constructor.name == "Sky") {
			this.kill();
		}
	}

	draw(ctx: CanvasRenderingContext2D, delta: number) {
		super.draw(ctx, delta);

		// Drawing asset
		let sprite = this.crocodileTexture.asSprite();
		sprite.draw(ctx, this.getLeft() + 100, this.getTop());
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
	}

}
