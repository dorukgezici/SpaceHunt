import * as ex from "excalibur";
import Player from "./Player";
import resources from "../../Resources";

export const Rocktypes = { "small": 1, "big": 2 };

export default class Rock extends ex.Actor {

	d: number;
	yVelBounce: number;
	typ: number;
	sprite: ex.Sprite;
	rotationTime: number = 0;
	numberOfRotationsPerSecond: number;

	static readonly types: { "small": 1, "big": 2 };

	constructor(x: number, y: number, d: number, speedX: number, accY: number, yVelBounce: number, typ: number) {
		super(x, y, d, d, ex.Color.White);

		this.d = d;

		// this.z = -1;

		// Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Passive;

		this.acc.y = accY;

		this.vel.x = speedX;

		this.numberOfRotationsPerSecond = speedX / (2 * Math.PI * d / Math.sqrt(2));


		this.yVelBounce = yVelBounce;

		this.typ = typ;
		if (typ === Rocktypes.small) {
			this.sprite = resources.smallRock.asSprite();
		} else {
			this.sprite = resources.bigRock.asSprite();
		}
		this.sprite.anchor.setTo(0.5, 0.5);

		// On collision check if Player and trap if true
		this.on("precollision", this.onPrecollision);
	}

	// raised every frame while colliding
	onPrecollision(ev: any) {
		// console.log("precollision event raised");
		if (ev.other.constructor.name === "Ground") {
			this.vel.y = this.yVelBounce;
			// alternatively more random bouncing for big rocks?
			if (this.typ === Rocktypes.big) {
				this.vel.y = this.yVelBounce * (this.randomIntFromInterval(90, 110) / 100);
			}
		} else {
			if (ev.other.constructor.name === "Player") {
				console.log("onPrecollision event of Rock colliding with player");
				let player: Player = ev.other;
				player.die("You got hit by the rock!");
			}
		}

	}

	draw(ctx: any, delta: any) {
		// Optionally call original 'base' method
		// ex.Actor.prototype.draw.call(this, ctx, delta);

		// Custom draw code
		/*
		ctx.fillStyle = this.color.toString();
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, Math.trunc(Math.sqrt((this.d * this.d)/4.0))+1, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		*/
		// TODO: calculate rotation
		this.rotationTime += delta / 1000;

		this.rotation = ((this.rotationTime * this.numberOfRotationsPerSecond) % 1) * 2 * Math.PI;

		this.sprite.rotation = this.rotation;

		this.sprite.draw(ctx, this.getCenter().x, this.getCenter().y);

	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		// TODO: kill when far behind player

	}

	kill() {
		super.kill();
	}

	randomIntFromInterval(min: number, max: number): number {
		let t: number = Math.floor(Math.random() * (max - min + 1) + min);
		return t;
	}

}