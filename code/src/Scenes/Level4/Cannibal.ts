import * as ex from "excalibur";
import BasePlayer from "../../Components/BasePlayer";
import resources from "../../Resources";
import { DrawAnimation } from "../../Components/Animations/Framework/DrawAnimation";
import { IEslanAnimations, eslanAnimationFactory } from "../../Components/Animations/Models/EslanAnimation";

export default class Cannibal extends ex.Actor {

	minX: number;
	maxX: number;
	speedX: number;
	private animation: DrawAnimation<IEslanAnimations>;
	players: BasePlayer[];

	constructor(x: number, y: number, w: number, h: number, speedX: number, minX: number, maxX: number, players: BasePlayer[]) {
		super(x, y, w, h, ex.Color.White);

		this.minX = minX;
		this.maxX = maxX;
		this.speedX = speedX;

		this.players = players;

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

		// On collision check if Player and kill if true
		this.on("precollision", this.onPrecollision);
	}

	// raised every frame while colliding
	onPrecollision(ev: any) {
		if (ev.other instanceof BasePlayer) {
			let player: BasePlayer = ev.other;
			player.die("You got hit by a cannibal!");
		}

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

		for (let player of this.players) {
			if (Math.abs(player.getWorldPos().x - this.getWorldPos().x) < 5 && !player.dead) {
				player.state.score += 100;
			}
		}

	}

	randomIntFromInterval(min: number, max: number): number {
		let t: number = Math.floor(Math.random() * (max - min + 1) + min);
		return t;
	}

}
