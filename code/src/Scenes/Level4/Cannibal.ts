import * as ex from "excalibur";
import Player from "./Player";
import resources from "../../Resources";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";
import { IEslanAnimations, eslanAnimationFactory } from "../../Components/Animations/EslanAnimation";

export default class Cannibal extends ex.Actor {

	// sprite: ex.Sprite;
	minX: number;
	maxX: number;
	speedX: number;
	private animation: DrawAnimation<IEslanAnimations>;

	constructor(x: number, y: number, w: number, h: number, speedX: number, minX: number, maxX: number) {
		super(x, y, w, h, ex.Color.White);

		this.minX = minX;
		this.maxX = maxX;
		this.speedX = speedX;

		// Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Passive;

		this.animation = eslanAnimationFactory.attachTo(this);

		if (this.randomIntFromInterval(1, 2) > 1) {
			this.vel.x = speedX;
			this.animation.changeState("walk-right");
		} else {
			this.vel.x = -speedX;
			this.animation.changeState("walk-left");
		}

		// On collision check if Player and trap if true
		this.on("precollision", this.onPrecollision);
	}

	// raised every frame while colliding
	onPrecollision(ev: any) {
		// console.log("precollision event raised");
		if (ev.other.constructor.name === "Player") {
			console.log("onPrecollision event of cannibal colliding with player");
			let player: Player = ev.other;
			player.die("You got hit by a cannibal!");
		}

	}

	draw(ctx: any, delta: any) {
		// Optionally call original 'base' method
		ex.Actor.prototype.draw.call(this, ctx, delta);

		// this.sprite.draw(ctx, this.getCenter().x, this.getCenter().y);

	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		// check for minX/maxX
		if (this.pos.x - this.getWidth() < this.minX) {
			this.vel.x = this.speedX;
			this.animation.changeState("walk-right");
		}
		if (this.pos.x + this.getWidth() > this.maxX) {
			this.vel.x = - this.speedX;
			this.animation.changeState("walk-left");
		}

	}

	kill() {
		super.kill();
	}

	randomIntFromInterval(min: number, max: number): number {
		let t: number = Math.floor(Math.random() * (max - min + 1) + min);
		return t;
	}

}