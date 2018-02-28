import * as ex from "excalibur";
import Player from "./Player";

export default class Bubble extends ex.Actor {

	static readonly size = { w: 50, h: 50 };

	static readonly speedY: number = -100;
	static readonly speedX: number = 50;
	static readonly tImbibe: number = 0.5;

	playerCollision: boolean = false;
	playerTrapped: boolean = false;
	collidedPlayer: Player | undefined;
	timer: number = -1;

	constructor(x: number, y: number, speedX: number, speedY: number) {
		super(x, y, Bubble.size.w, Bubble.size.h, ex.Color.White);

		// Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Passive;

		this.vel = new ex.Vector(speedX, speedY);

		// On collision check if Player and trap if true
		this.on("precollision", this.onPrecollision);
	}

	// raised every frame while colliding
	onPrecollision(ev: any) {
		// console.log("precollision event raised");
		// trap player if collided
		if (!this.playerCollision && ev.other.constructor.name === "Player" && !ev.other.trapped) {
			console.log("1st-time PLAYER precollision event raised (Level2 - Bubble - onPrecollision())");
			this.playerCollision = true;
			this.playerTrapped = true;
			this.collidedPlayer = ev.other;
			if (this.collidedPlayer) {
				this.collidedPlayer.trapped = true;
				this.collidedPlayer.vel = this.vel;

				// player position: to be moved towards the center of the bubble within tImbibe seconds
				// extra velocity for tImbibe seconds
				let dX: number = (this.x - this.collidedPlayer.x);
				let dY: number = (this.y - this.collidedPlayer.y);
				this.collidedPlayer.vel.x = this.collidedPlayer.vel.x + dX / Bubble.tImbibe;
				this.collidedPlayer.vel.y = this.collidedPlayer.vel.y + dY / Bubble.tImbibe;


				let that: Bubble = this;
				this.timer = setTimeout(function () {
					if (that.collidedPlayer /*&& !that.isKilled()*/) {that.collidedPlayer.vel = that.vel;}
					that.timer = -1;
				}, Bubble.tImbibe * 1000);

			}
		}
		// kill bubble when reaching sky
		if (ev.other.constructor.name === "Sky") {
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

	kill() {
		// clear timeout if necessary and free player
		if (this.timer !== -1) {
			clearTimeout(this.timer);
		}
		this.playerTrapped = false;
		if (this.collidedPlayer) {
			this.collidedPlayer.trapped = false;
			this.collidedPlayer.vel = new ex.Vector(0, 0);
		}
		super.kill();
	}

}
