import * as ex from "excalibur";
import Level2Player from "./Level2Player";
import resources from "../../Resources";

export default class Bubble extends ex.Actor {

	static readonly size = { w: 20, h: 20 };
	static readonly sprite: ex.Sprite = resources.level2.bubble.asSprite();

	// no influence on player if over a certain height -> depending on sky height and own size
	static readonly MINCOLLISIONY: number = Bubble.size.h / 2 + 145 + 1;

	static readonly speedY: number = -100;
	static readonly speedX: number = 50;
	static readonly tImbibe: number = 0.5;

	playerCollision: boolean = false;
	playerTrapped: boolean = false;
	collidedPlayer: Level2Player | unset;
	timer: number = -1;

	constructor(x: number, y: number, speedX: number, speedY: number) {
		super(x, y, Bubble.size.w, Bubble.size.h, ex.Color.White);

		// Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center
		Bubble.sprite.anchor.setTo(0.5, 0.5);

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Passive;

		this.vel = new ex.Vector(speedX, speedY);

		// On collision check if Level2Player and trap if true
		this.on("precollision", this.onPrecollision);
	}

	// raised every frame while colliding
	onPrecollision(ev: any) {
		// console.log("precollision event raised");
		// trap player if collided
		// only if player not already in the sky
		if (!this.playerCollision && ev.other.constructor.name === "Level2Player" && !ev.other.trapped && this.y > Bubble.MINCOLLISIONY ) {
			console.log("1st-time PLAYER precollision event raised (Level2 - Bubble - onPrecollision())");
			this.playerCollision = true;
			this.playerTrapped = true;
			this.collidedPlayer = ev.other;
			if (this.collidedPlayer) {
				this.collidedPlayer.trapped = true;
				this.collidedPlayer.vel = this.vel;

				this.collidedPlayer.state.score += 50;

				// player position: to be moved towards the center of the bubble within tImbibe seconds
				// extra velocity for tImbibe seconds
				let dX: number = (this.x - this.collidedPlayer.x);
				let dY: number = (this.y - this.collidedPlayer.y);
				this.collidedPlayer.vel.x = this.collidedPlayer.vel.x + dX / Bubble.tImbibe;
				this.collidedPlayer.vel.y = this.collidedPlayer.vel.y + dY / Bubble.tImbibe;


				let that: Bubble = this;
				this.timer = setTimeout(function () {
					if (that.collidedPlayer) {that.collidedPlayer.vel = that.vel;}
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
		Bubble.sprite.draw(ctx, this.getCenter().x, this.getCenter().y);
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
