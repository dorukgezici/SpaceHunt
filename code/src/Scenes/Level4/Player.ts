import * as ex from "excalibur";
import BasePlayer from "../../Components/BasePlayer";
import Level4 from "./Level4";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";
import { playerAnimationFactory, IPlayerAnimations } from "./PlayerAnimations";

export default class Player extends BasePlayer {
	static readonly speed: number = 8;
	private minX: number;
	private maxX: number;
	dead: boolean = false;
	private moveDir: number = 0;
	private animation?: DrawAnimation<"idle-right" | "idle-left" | "walk-left" | "walk-right" | "jump-left" | "jump-right" | "duck-left" | "duck-right">;

	private stateY: String;
	private stateX: String;

	private posYold: number;

	private isJumping: boolean = false;


	constructor(x: number, y: number, levelBounds: ex.BoundingBox) {
		super(x, y);
		this.minX = levelBounds.left + Player.size.w / 2;
		this.maxX = levelBounds.right - Player.size.w / 2;
		this.anchor.setTo(0.5, 1);
		this.body.useBoxCollision();
		this.y += this.getHeight() / 2;
		this.color = ex.Color.Orange;
		this.posYold = this.pos.y;
		this.on("precollision", this.onPrecollision);
		this.stateY = "idle";
		this.stateX = "right";
	}

	initAnimations() {
		if (!this.animation)
			this.animation = playerAnimationFactory.attachTo(this);
	}


	private stateChanged: boolean = false;
	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		// change movement if not currently in the air
		if (this.isGround()) {

			// just landed
			if (this.stateY === "jump" && this.posYold < (600 - 65)) { // this.vel.y > -1) {
				// just landed
				this.stateY = "not jumping";
				console.log("just landed");
				this.stateChanged = true;
			}


			if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space) && this.stateY !== "jump") {
				this.jump();
			}



			if (this.stateY !== "jump") {

				if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
					this.moveDir = 1;
					if (this.stateX !== "left") {
						this.stateX = "left";
						console.log("just turned left");
						this.stateChanged = true;
					}
					if (this.stateY !== "walk") {
						this.stateY = "walk";
						console.log("just started walking");
						this.stateChanged = true;
					}

				} else {

					if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
						this.moveDir = -1;
						if (this.stateX !== "right") {
							this.stateX = "right";
							console.log("just turned right");
							this.stateChanged = true;
						}
						if (this.stateY !== "walk") {
							this.stateY = "walk";
							console.log("just started walking");
							this.stateChanged = true;
						}

					} else {

						this.moveDir = 0;
						if (this.stateY !== "idle") {
							this.stateY = "idle";
							console.log("just entered idle");
							this.stateChanged = true;
						}

					}
				}

			}

			// check if state changed and update animation accordingly
			if (this.stateChanged) {
				this.changeAnimationState(this.stateX, this.stateY);
				this.stateChanged = false;
			}

		}

		// move according to direction of movement
		this.pos.x -= Player.speed * this.moveDir;
		this.pos.x = this.pos.x < this.minX ? this.minX : this.pos.x;
		this.pos.x = this.pos.x > this.maxX ? this.maxX : this.pos.x;

		this.posYold = this.pos.y;
	}

	private jump() {
		if (this.isGround()) {
			this.vel.setTo(this.vel.x, -700);
			// console.log(this.vel);
			this.stateY = "jump";
			this.stateChanged = true;
			console.log("just jumped");
			if (!this.isJumping && this.animation) {
				this.isJumping = true;
				// this.animation.changeState("jump-right");
			}
		}
	}

	private goLeft() {
		this.pos.x -= Player.speed;
		this.pos.x = this.pos.x < this.minX ? this.minX : this.pos.x;
	}

	private goRight() {
		this.pos.x += Player.speed;
		this.pos.x = this.pos.x > this.maxX ? this.maxX : this.pos.x;
	}

	public die(info: string) {
		if (!this.dead) {

			// console.log("cam rot: "+this.scene.camera.rotation + "   (level3 - player - die)"); // proof that rotation is not influenced by anything else

			this.dead = true;

			this.collisionArea.body.useBoxCollision();

			this.scene.camera.shake(50, 50, 500);

			let player: Player = this;
			setTimeout(() => {

				player.kill();
				this.emit("death");

			}, 550);
		}
	}

	private isGround(): boolean {
		let groundLevel = this.scene.engine.getWorldBounds().bottom - 50;
		if (groundLevel - this.getBottom() < 15) {
			return true;
		} else {
			return false;
		}
	}

	private won: boolean = false;
	onPrecollision(ev: any) {
		// console.log("precollision event raised");
		if (ev.other.constructor.name === "Princess" && !this.won) {
			this.won = true;
			console.log("onPrecollision event of player colliding with princess");
			this.emit("won");
		}

	}


	// convert seperated states to animation state
	changeAnimationState(stateX: String, stateY: String) {
		switch (stateY + "-" + stateX) {
			case "idle-right":
				if (this.animation) this.animation.changeState("idle-right");
				console.log("idle-right");
				break;
			case "idle-left":
				if (this.animation) this.animation.changeState("idle-left");
				console.log("idle-left");
				break;
			case "walk-left":
				if (this.animation) this.animation.changeState("walk-left");
				console.log("walk-left");
				break;
			case "walk-right":
				if (this.animation) this.animation.changeState("walk-right");
				console.log("walk-right");
				break;
			case "jump-left":
				if (this.animation) this.animation.changeState("jump-left");
				console.log("jump-left");
				break;
			case "jump-right":
				if (this.animation) this.animation.changeState("jump-right");
				console.log("jump-right");
				break;
			case "duck-left":
				if (this.animation) this.animation.changeState("duck-left");
				console.log("duck-left");
				break;
			case "duck-right":
				if (this.animation) this.animation.changeState("duck-right");
				console.log("duck-right");
				break;
		}
	}

}
