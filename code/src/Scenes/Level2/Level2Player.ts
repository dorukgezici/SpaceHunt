import * as ex from "excalibur";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";
import { modelSwimSize } from "../../Components/Animations/MichaelsonParts";
import { IPlayerAnimations, playerAnimationFactory } from "../../Components/Animations/MichelsonAnimation";
import BasePlayer, { IControlSet } from "../../Components/BasePlayer";
import { IGameBootstrapState } from "../../GameBootstrap";
import Level2 from "./Level2";

export default class Level2Player extends BasePlayer {

	// static speed: number = 8; //to be changed for normal/slower/faster swimming movement
	static readonly speedY: number = 2;
	static readonly speedAcc: number = 200;
	static readonly speedNormal: number = 100;
	static readonly speedDec: number = 50;

	private minX: number;
	private maxX: number;
	private minY: number;
	private maxY: number;

	private animation: DrawAnimation<IPlayerAnimations>;

	private speedX: number = Level2Player.speedNormal;

	public trapped: boolean = false; // for disabling controls in case of being trapped by a bubble
	public dead: boolean = false;

	public oxygenMeter: ex.Label;
	public oxygenLevel: number = 100;

	constructor(x: number, y: number, controlSet: IControlSet, oxygenMeter: ex.Label, state: IGameBootstrapState) {
		super(x, y, controlSet, state);
		this.minX = Level2.levelBounds.left + modelSwimSize.w / 2;
		this.maxX = Level2.levelBounds.right - modelSwimSize.w / 2;
		this.minY = Level2.levelBounds.top + modelSwimSize.h / 2;
		this.maxY = Level2.levelBounds.bottom - modelSwimSize.h / 2;

		this.oxygenMeter = oxygenMeter;
		this.oxygenMeter.fontSize = 30;

		this.setWidth(modelSwimSize.w);
		this.setHeight(modelSwimSize.h);

		// Anchor
		this.anchor.setTo(0.5, 0.5); // set anchor to the center

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Active;
		this.on("precollision", this.onPrecollision);

		this.animation = playerAnimationFactory.attachTo(this);
		this.animation.changeState("swim-right");
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
				this.animation.changeState("swim-right");
			else if (this.speedX === Level2Player.speedAcc)
				this.animation.changeState("swim-right-fast");
			else if (this.speedX === Level2Player.speedDec)
				this.animation.changeState("swim-right-slow");
		}

		if (this.getWorldPos().x > 4950) {
			this.win("won by reaching the level end");
		}

	}

	public die(info: string) {
		if (!this.dead) {
			if (this.state.lives > 1) {
				this.dead = true;
				this.state.lives -= 1;
				var fake_this = this;
				setTimeout(function () { fake_this.dead = false; }, 1000);
			} else {
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
