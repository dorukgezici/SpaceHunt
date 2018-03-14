import * as ex from "excalibur";
import Player from "./Player";

export default class Rock extends ex.Actor {

	d: number;

	constructor(x: number, y: number, d: number, speedX: number) {
		super(x, y, d, d, ex.Color.White);

		this.d = d;

		// Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Passive;

		this.acc.y = 1000;

		this.vel.x = speedX;

		// On collision check if Player and trap if true
		this.on("precollision", this.onPrecollision);
	}

	// raised every frame while colliding
	onPrecollision(ev: any) {
		// console.log("precollision event raised");
		if (ev.other.constructor.name === "Ground"){
			this.vel.y = -200;
		}

	}

	draw(ctx: any, delta: any) {
		// Optionally call original 'base' method
		// ex.Actor.prototype.draw.call(this, ctx, delta)

		// Custom draw code
		ctx.fillStyle = this.color.toString();
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, Math.trunc(Math.sqrt((this.d * this.d)/4.0))+1, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		// TODO: kill when far behind player

	}

	kill() {
		super.kill();
	}

}
