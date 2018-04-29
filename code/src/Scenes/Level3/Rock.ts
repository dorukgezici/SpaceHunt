import * as ex from "excalibur";
import BasePlayer from "../../Components/BasePlayer";
import resources from "../../Resources";

export const Rocktypes = { "small": 1, "big": 2 };

export default class Rock extends ex.Actor {

	d: number;
	yVelBounce: number;
	typ: number;
	sprite: ex.Sprite;
	rotationTime: number = 0;
	numberOfRotationsPerSecond: number;
	players: BasePlayer[];

	static readonly types: { "small": 1, "big": 2 };

	constructor(x: number, y: number, d: number, speedX: number, accY: number, yVelBounce: number, typ: number, players: BasePlayer[]) {
		super(x, y, d, d, ex.Color.White);

		this.players = players;

		this.d = d;

		this.anchor.setTo(0.5, 0.5); // set anchor to the center

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Passive;

		this.acc.y = accY;

		this.vel.x = speedX;

		this.numberOfRotationsPerSecond = speedX / (2 * Math.PI * d / Math.sqrt(2));


		this.yVelBounce = yVelBounce;

		this.typ = typ;
		if (typ === Rocktypes.small) {
			this.sprite = resources.level3.smallRock.asSprite();
		} else {
			this.sprite = resources.level3.bigRock.asSprite();
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
			if (ev.other instanceof BasePlayer) {
				let player: BasePlayer = ev.other;
				player.die("You got hit by the rock!");
			}
		}

	}

	draw(ctx: any, delta: any) {
		this.rotationTime += delta / 1000;
		this.rotation = ((this.rotationTime * this.numberOfRotationsPerSecond) % 1) * 2 * Math.PI;
		this.sprite.rotation = this.rotation;
		this.sprite.draw(ctx, this.getCenter().x, this.getCenter().y);
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		for (let player of this.players) {
			if (Math.abs(player.getWorldPos().x - this.getWorldPos().x) < 5 && !player.dead) {
				if (this.typ == Rocktypes.big)
					player.state.score += 50;
				else
					player.state.score += 25;
			}
		}
		// TODO: kill when far behind player ?

	}

	randomIntFromInterval(min: number, max: number): number {
		let t: number = Math.floor(Math.random() * (max - min + 1) + min);
		return t;
	}

}
