import * as ex from "excalibur";
import Level2Player from "./Level2Player";
import resources from "../../Resources";
import { GameBootstrap } from "../../GameBootstrap";

export default class Crocodile extends ex.Actor {

	static readonly size = { w: 202, h: 50 };
	static readonly speedY: number = -30;
	static readonly speedX: number = 10;
	private readonly bootstrap: GameBootstrap;

	constructor(bootstrap: GameBootstrap, x: number, y: number, speedX: number, speedY: number) {
		super(x, y, Crocodile.size.w, Crocodile.size.h, ex.Color.Green);

		this.bootstrap = bootstrap;

		// Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center of the right edge (?)

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Active;

		this.vel = new ex.Vector(speedX, speedY);

		// On collision check if Level2Player and trapp if true
		this.on("precollision", this.onPrecollision);

		// Sprite drawings
		const spriteSheet = new ex.SpriteSheet(resources.level2.crocodile, 1, 8, Crocodile.size.w, Crocodile.size.h);
		const animation = spriteSheet.getAnimationForAll(bootstrap.engine, 100);
		this.addDrawing("idle", animation as any);
	}

	// raised every frame while colliding
	onPrecollision(ev: any) {
		// Trap player if collided
		if (ev.other.constructor.name === "Level2Player") {
			let player: Level2Player = ev.other;
			player.die("You got eaten by a crocodile!");
		}
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
	}

}
