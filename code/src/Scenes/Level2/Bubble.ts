import * as ex from "excalibur";
import Player from "./Player";

export default class Bubble extends ex.Actor {

	static readonly size = { w: 50, h: 50 };

	static readonly speedY: number = -100;
	static readonly speedX: number = 50;

	playerCollision: boolean = false;
	playerTrapped: boolean = false;
	collidedPlayer: Player;

	constructor(x: number, y: number, speedX: number, speedY: number) {
		super(x, y, Bubble.size.w, Bubble.size.h, ex.Color.White);

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
		//console.log("precollision event raised");
		//trap player if collided
		if (!this.playerCollision && ev.other.constructor.name == "Player" && !ev.other.trapped) {
			console.log("1st-time PLAYER precollision event raised (Level2 - Bubble - onPrecollision())");
			this.playerCollision = true;
			this.playerTrapped = true;
			this.collidedPlayer = ev.other;
			this.collidedPlayer.trapped = true;
			this.collidedPlayer.vel = this.vel;
			//TODO: correct player position & animation
		}
		//un-trap player if reaching sky
		else if (this.playerTrapped && ev.other.constructor.name == "Sky") {
			this.playerTrapped = false;
			this.collidedPlayer.trapped = false;
		}
		//kill bubble when reaching sky
		if (ev.other.constructor.name == "Sky") {
			this.kill();
		}
	}

	draw(ctx: any, delta: any) {
		// Optionally call original 'base' method
		// ex.Actor.prototype.draw.call(this, ctx, delta)

		// Custom draw code
		ctx.fillStyle = this.color.toString();
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, 35, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
	}

}
