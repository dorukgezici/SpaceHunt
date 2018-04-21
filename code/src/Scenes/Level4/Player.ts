import * as ex from "excalibur";
import BasePlayer, { controlSets, IControlSet } from "../../Components/BasePlayer";
import Level4 from "./Level4";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";
import { playerAnimationFactory, IPlayerAnimations, states } from "../../Components/Animations/MichelsonAnimation";

type IStateX = "right" | "left";
type IStateY = "idle" | "walk" | "jump" | "duck";

export default class Player extends BasePlayer {

	private readonly jumpingVelocity: number = -900;
	static readonly speed: number = 8;
	private minX: number;
	private maxX: number;
	private dead: boolean = false;
	private moveDir: number = 0;
	private animation?: DrawAnimation<IPlayerAnimations>;

	private posYold: number;
	private stateX: IStateX = "right";
	private stateY: IStateY = "walk";

	private isJumping: boolean = false;

	private won: boolean = false;

	constructor(x: number, y: number, levelBounds: ex.BoundingBox, controlSet: IControlSet) {
		super(x, y, controlSet);
		this.minX = levelBounds.left + Player.size.w / 2;
		this.maxX = levelBounds.right - Player.size.w / 2;
		this.anchor.setTo(0.5, 1);
		this.body.useBoxCollision();
		this.y += this.getHeight() / 2;
		this.color = ex.Color.Orange;
		this.posYold = this.pos.y;
		this.on("precollision", this.onPrecollision);
	}

	initAnimations() {
		if (!this.animation)
			this.animation = playerAnimationFactory.attachTo(this);
	}


	update(engine: ex.Engine, delta: number) {

		let stateChanged = false;
		const updateStateX = (x: IStateX) => {
			stateChanged = true;
			this.stateX = x;
		};
		const updateStateY = (y: IStateY) => {
			stateChanged = true;
			this.stateY = y;
		};

		super.update(engine, delta);

		// change movement if not currently in the air
		if (this.isGround()) {

			// just landed
			if (this.stateY === "jump" && this.posYold < (600 - 65)) { // this.vel.y > -1) {
				// just landed
				console.log("just landed");
				updateStateY("walk");
			}

			if (engine.input.keyboard.wasPressed(this.controls.up) && this.stateY !== "jump") {
				if (this.jump()) {
					updateStateY("jump");
				}
			}

			if (this.stateY !== "jump") {

				if (engine.input.keyboard.isHeld(this.controls.left)) {
					this.moveDir = 1;
					if (this.stateX !== "left") {
						updateStateX("left");
						console.log("just turned left");
					}
					if (this.stateY !== "walk") {
						updateStateY("walk");
						console.log("just started walking");
					}

				} else {

					if (engine.input.keyboard.isHeld(this.controls.right)) {
						this.moveDir = -1;
						if (this.stateX !== "right") {
							updateStateX("right");
							console.log("just turned right");
						}
						if (this.stateY !== "walk") {
							updateStateY("walk");
							console.log("just started walking");
						}

					} else {

						this.moveDir = 0;
						if (this.stateY !== "idle") {
							updateStateY("idle");
							console.log("just entered idle");
						}

					}
				}

			}

			// check if state changed and update animation accordingly
			if (stateChanged)
				this.changeAnimationState(this.stateX, this.stateY);

		}

		// move according to direction of movement
		this.pos.x -= Player.speed * this.moveDir;
		this.pos.x = this.pos.x < this.minX ? this.minX : this.pos.x;
		this.pos.x = this.pos.x > this.maxX ? this.maxX : this.pos.x;

		this.posYold = this.pos.y;
	}

	private jump() {
		if (this.isGround()) {
			this.vel.setTo(this.vel.x, this.jumpingVelocity);
			// console.log(this.vel);
			if (!this.isJumping && this.animation) {
				this.isJumping = true;
				// this.animation.changeState("jump-right");
			}
			return true; // returns true to signalise that this.stateY has changed
		}
		return false;
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

			this.dead = true;

			this.collisionArea.body.useBoxCollision();

			this.scene.camera.shake(50, 50, 500);

			let player: Player = this;
			// setTimeout(() => {

			player.kill();
			this.emit("death");

			// }, 550);
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

	onPrecollision(ev: any) {
		// console.log("precollision event raised");
		if (ev.other.constructor.name === "Princess" && !this.won) {
			this.won = true;
			console.log("onPrecollision event of player colliding with princess");
			this.emit("won");
		}

	}

	// convert seperated states to animation state
	changeAnimationState(stateX: string = this.stateX, stateY: string = this.stateY) {
		const state = stateY + "-" + stateX as IPlayerAnimations;
		console.log(state);
		if (this.animation)
			this.animation.changeState(state);
	}

}
