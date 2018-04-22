import * as ex from "excalibur";
import Sky from "./Sky";
import Level2 from "./Level2";
import { playerSwimAnimationFactory, IPlayerSwimAnimations } from "./PlayerSwimAnimation";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";
import BasePlayer, { controlSets, IControlSet } from "../../Components/BasePlayer";
import BaseLevel from "../../Components/BaseLevel";

export default class Level2Player extends BasePlayer {

	static readonly size = { w: 100, h: 50 }; // changed for swimming movement

	// to be changed for normal/slower/faster swimming movement
	static readonly speedY: number = 2;
	static readonly speedAcc: number = 200;
	static readonly speedNormal: number = 100;
	static readonly speedDec: number = 50;

	private minX: number;
	private maxX: number;
	private minY: number;
	private maxY: number;

	private speedX: number = Level2Player.speedNormal;

	public trapped: boolean = false; // for disabling controls in case of being trapped by a bubble
	public dead: boolean = false;

	public oxygenMeter: ex.Label;
	public oxygenLevel: number = 100;

	private animation: DrawAnimation<IPlayerSwimAnimations>;

	constructor(x: number, y: number, controlSet: IControlSet, oxygenMeter: ex.Label) {
		super(x, y, controlSet);
		this.minX = Level2.levelBounds.left + Level2Player.size.w / 2;
		this.maxX = Level2.levelBounds.right - Level2Player.size.w / 2;
		this.minY = Level2.levelBounds.top + Level2Player.size.h / 2;
		this.maxY = Level2.levelBounds.bottom - Level2Player.size.h / 2;

		this.oxygenMeter = oxygenMeter;
		this.oxygenMeter.fontSize = 30;

		this.setWidth(Level2Player.size.w);
		this.setHeight(Level2Player.size.h);

		// Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center

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
		} else if (ev.other.constructor.name === "Bubble" && !this.trapped) { // Bubbles add 20 oxygen points
			this.oxygenLevel = (this.oxygenLevel + 20) < 100 ? this.oxygenLevel + 20 : 100;
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
			if (engine.input.keyboard.wasPressed(this.controls.left)) {
				this.speedX = Level2Player.speedDec;
			}

			if (engine.input.keyboard.wasPressed(this.controls.right)) {
				this.speedX = Level2Player.speedAcc;
			}

			if (engine.input.keyboard.wasReleased(this.controls.left)) {
				if (engine.input.keyboard.isHeld(this.controls.right)) {
					this.speedX = Level2Player.speedAcc;
				} else {
					this.speedX = Level2Player.speedNormal;
				}
			}

			if (engine.input.keyboard.wasReleased(this.controls.right)) {
				if (engine.input.keyboard.isHeld(this.controls.left)) {
					this.speedX = Level2Player.speedDec;
				} else {
					this.speedX = Level2Player.speedNormal;
				}
			}

			if (engine.input.keyboard.isHeld(this.controls.left) && engine.input.keyboard.isHeld(this.controls.right)) {
				this.speedX = Level2Player.speedNormal;
			}

			this.vel.x = this.speedX;

			if (this.pos.x > this.maxX)
				this.emit("win");

			// Y movement
			if (engine.input.keyboard.isHeld(this.controls.up)) {
				this.moveUp();
			}

			if (engine.input.keyboard.isHeld(this.controls.down)) {
				this.moveDown();
			}
		}

		if (this.speedX !== oldSpeedX) {
			if (this.speedX === Level2Player.speedNormal)
				this.animation.changeState("normal");
			else if (this.speedX === Level2Player.speedAcc)
				this.animation.changeState("fast");
			else if (this.speedX === Level2Player.speedDec)
				this.animation.changeState("slow");
		}

		if (this.getWorldPos().x > 4950) {
			this.win("won by reaching the level end");
		}

	}

	private moveUp() {
		// to not move too far into the sky
		if (this.pos.y > (this.minY + 100)) {
			this.pos.y -= Level2Player.speedY;
		}
	}

	private moveDown() {
		if (this.pos.y < this.maxY) {
			this.pos.y += Level2Player.speedY;
		}
	}
}
