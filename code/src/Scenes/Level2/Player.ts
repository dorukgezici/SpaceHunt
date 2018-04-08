import * as ex from "excalibur";
import Sky from "./Sky";
import Level2 from "./Level2";
import { playerSwimAnimationFactory, IPlayerSwimAnimations } from "./PlayerSwimAnimation";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";

export default class Player extends ex.Actor {

	static readonly size = { w: 100, h: 20 }; // changed for swimming movement

	// static speed: number = 8; //to be changed for normal/slower/faster swimming movement
	static readonly speedY: number = 2;
	static readonly speedAcc: number = 200;
	static readonly speedNormal: number = 100;
	static readonly speedDec: number = 50;

	private minX: number;
	private maxX: number;
	private minY: number;
	private maxY: number;

	private speedX: number = Player.speedNormal;

	public trapped: boolean = false; // for disabling controls in case of being trapped by a bubble
	public dead: boolean = false;

	public oxygenMeter: ex.Label;
	public oxygenLevel: number = 100;

	private animation: DrawAnimation<IPlayerSwimAnimations>;

	constructor(x: number, y: number, levelBounds: ex.BoundingBox, oxygenMeter: ex.Label) {
		super(x, y, Player.size.w, Player.size.h, ex.Color.DarkGray);
		this.minX = levelBounds.left + Player.size.w / 2;
		this.maxX = levelBounds.right - Player.size.w / 2;
		this.minY = levelBounds.top + Player.size.h / 2;
		this.maxY = levelBounds.bottom - Player.size.h / 2;

		this.oxygenMeter = oxygenMeter;

		// Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center of the right edge (?)
		// this.y += this.getHeight() / 2;

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Active;
		this.on("precollision", this.onPrecollision);

		this.animation = playerSwimAnimationFactory.attachTo(this);
	}

	onPrecollision(ev: any) {
		// Reset Oxygen Level to 100
		if (ev.other.constructor.name === "Sky") {

			// refill oxygen
			this.oxygenLevel = 100;

			// free if trapped??
			// if (this.trapped) {
			// this.trapped = false;
			// this.vel.x = 0;
			// }

		}
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		const oldSpeedX = this.speedX;

		// Decrease Oxygen Level and drown if no oxygen is left
		this.oxygenLevel -= 0.12;
		this.oxygenMeter.text = "Oxygen Level: " + Math.round(this.oxygenLevel) + "/100";
		if (this.oxygenLevel <= 0) {
			this.die("You drowned!");
		}

		if (!this.trapped) {
			// X movement
			if (engine.input.keyboard.wasPressed(ex.Input.Keys.Left)) {
				this.speedX = Player.speedDec;
			}

			if (engine.input.keyboard.wasPressed(ex.Input.Keys.Right)) {
				this.speedX = Player.speedAcc;
			}

			if (engine.input.keyboard.wasReleased(ex.Input.Keys.Left)) {
				if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
					this.speedX = Player.speedAcc;
				} else {
					this.speedX = Player.speedNormal;
				}
			}

			if (engine.input.keyboard.wasReleased(ex.Input.Keys.Right)) {
				if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
					this.speedX = Player.speedDec;
				} else {
					this.speedX = Player.speedNormal;
				}
			}

			if (engine.input.keyboard.isHeld(ex.Input.Keys.Left) && engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
				this.speedX = Player.speedNormal;
			}

			this.vel.x = this.speedX;
			// check for Level ending -> better raise event in case of collision with level ending?

			// Y movement
			if (engine.input.keyboard.isHeld(ex.Input.Keys.Up)) {
				this.moveUp();
			}

			if (engine.input.keyboard.isHeld(ex.Input.Keys.Down)) {
				this.moveDown();
			}
		}

		if (this.speedX !== oldSpeedX) {
			if (this.speedX === Player.speedNormal)
				this.animation.changeState("normal");
			else if (this.speedX === Player.speedAcc)
				this.animation.changeState("fast");
			else if (this.speedX === Player.speedDec)
				this.animation.changeState("slow");
		}

		if (this.getWorldPos().x > 4950) {
			this.emit("won");
		}

	}

	public die(info: string) {
		if (!this.dead) {
			this.dead = true;
			this.kill();
			this.emit("death");
			/*
			alert(info);
			let restartLabel = new ex.Label("Game Over.", (this.minX + this.maxX) / 2, (this.minY + this.maxY) / 2);
			restartLabel.fontSize = 30;
			this.scene.addUIActor(restartLabel);
			*/
		}
	}


	private moveUp() {
		// to not move too far into the sky
		if (this.pos.y > (this.minY + 25)) {
			this.pos.y -= Player.speedY;
		}
	}

	private moveDown() {
		if (this.pos.y < this.maxX) {
			this.pos.y += Player.speedY;
		}
	}
}
