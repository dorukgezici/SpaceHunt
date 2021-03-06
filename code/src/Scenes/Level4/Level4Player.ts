import * as ex from "excalibur";
import BasePlayer, { controlSets, IControlSet } from "../../Components/BasePlayer";
import Level4 from "./Level4";
import { DrawAnimation } from "../../Components/Animations/Framework/DrawAnimation";
import { playerAnimationFactory, IPlayerAnimations, states, brotherAnimationFactory } from "../../Components/Animations/Models/MikelsonAnimation";
import BaseLevel from "../../Components/BaseLevel";
import Ground from "../../Components/Ground";
import { IGameBootstrapState } from "../../GameBootstrap";

type IStateX = "right" | "left";
type IStateY = "idle" | "walk" | "jump" | "duck";

export default class Level4Player extends BasePlayer {

	static readonly jumpingVelocity: number = -900;
	static readonly speed: number = 8;
	private minX: number;
	private maxX: number;
	private moveDir: number = 0;
	private animation: DrawAnimation<IPlayerAnimations>;

	private posYold: number;
	private stateX: IStateX = "right";
	private stateY: IStateY = "walk";

	private isJumping: boolean = false;

	constructor(x: number, y: number, controlSet: IControlSet, state: IGameBootstrapState, private isFirst: boolean) {
		super(x, y, controlSet, state);
		this.minX = Level4.levelBounds.left + Level4Player.size.w / 2;
		this.maxX = Level4.levelBounds.right - Level4Player.size.w / 2;
		this.anchor.setTo(0.5, 1);
		this.body.useBoxCollision();
		this.y += this.getHeight() / 2;
		this.posYold = this.pos.y;
		if (isFirst)
			this.animation = playerAnimationFactory.attachTo(this);
		else
			this.animation = brotherAnimationFactory.attachTo(this);
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
			let groundLevel = this.scene.engine.getWorldBounds().bottom - Ground.height;
			if (this.stateY === "jump" && this.posYold < (groundLevel - 5)) {
				// just landed
				// console.log("just landed");
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
						// console.log("just turned left");
					}
					if (this.stateY !== "walk") {
						updateStateY("walk");
						// console.log("just started walking");
					}

				} else {

					if (engine.input.keyboard.isHeld(this.controls.right)) {
						this.moveDir = -1;
						if (this.stateX !== "right") {
							updateStateX("right");
							// console.log("just turned right");
						}
						if (this.stateY !== "walk") {
							updateStateY("walk");
							// console.log("just started walking");
						}

					} else {

						this.moveDir = 0;
						if (this.stateY !== "idle") {
							updateStateY("idle");
							// console.log("just entered idle");
						}

					}
				}

			}

			// check if state changed and update animation accordingly
			if (stateChanged)
				this.changeAnimationState(this.stateX, this.stateY);

		}

		// move according to direction of movement
		this.pos.x -= Level4Player.speed * this.moveDir;
		this.pos.x = this.pos.x < this.minX ? this.minX : this.pos.x;
		this.pos.x = this.pos.x > this.maxX ? this.maxX : this.pos.x;

		this.posYold = this.pos.y;
	}

	private jump() {
		if (this.isGround()) {
			this.vel.setTo(this.vel.x, Level4Player.jumpingVelocity);
			if (!this.isJumping && this.animation) {
				this.isJumping = true;
			}
			return true; // returns true to signalise that this.stateY has changed
		}
		return false;
	}

	private goLeft() {
		this.pos.x -= Level4Player.speed;
		this.pos.x = this.pos.x < this.minX ? this.minX : this.pos.x;
	}

	private goRight() {
		this.pos.x += Level4Player.speed;
		this.pos.x = this.pos.x > this.maxX ? this.maxX : this.pos.x;
	}

	declareWinner() {
		this.state.winner = this.isFirst ? this.state.names[0] : this.state.names[1];
	}

	// convert separated states to animation state
	changeAnimationState(stateX: string = this.stateX, stateY: string = this.stateY) {
		const state = stateY + "-" + stateX as IPlayerAnimations;
		// console.log(state);
		this.animation.changeState(state);
	}

}
