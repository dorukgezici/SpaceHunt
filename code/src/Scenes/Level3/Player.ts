import * as ex from "excalibur";
import BasePlayer from "../../Components/BasePlayer";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";
import { playerAnimationFactory, IPlayerAnimations, states as maStates } from "../../Components/Animations/MichelsonAnimation";

const states = {
	default: maStates.walkRight,
	slow: maStates.walkSlowRight,
	fast: maStates.walkFastRight,
	jump: maStates.jumpRight,
	duck: maStates.duckRight
};

export default class Player extends BasePlayer {

	cameraStrategy: ex.LockCameraToActorStrategy;
	dead: boolean = false;
	ducked: boolean = false;
	engine: ex.Engine;
	jumpFlag: boolean = false;
	private animation?: DrawAnimation<IPlayerAnimations>;

	private posYold: number;

	private speed: number;
	private speedAcc: number = 300;
	private speedNormal: number = 200;
	private speedDec: number = 100;
	private speedDucked: number = 50;

	private minX: number;
	private maxX: number;


	private state: IPlayerAnimations = states.default;

	constructor(x: number, y: number, levelBounds: ex.BoundingBox, engine: ex.Engine) {
		super(x, y);

		this.anchor.setTo(0.5, 1); // set anchor to the center of the bottom edge
		// this.y += this.getHeight();
		this.collisionArea.body.useBoxCollision();

		this.cameraStrategy = new ex.LockCameraToActorAxisStrategy(this, ex.Axis.X);
		// this.cameraStrategy = new ex.LockCameraToActorStrategy(this);
		this.minX = levelBounds.left + Player.size.w / 2;
		this.maxX = levelBounds.right - Player.size.w / 2;
		this.speed = this.speedNormal;

		this.posYold = this.pos.y;

		// touch pointer events
		this.engine = engine;
		engine.input.pointers.primary.on("down", this.pointerDown);
	}

	initAnimations() {
		if (!this.animation) {
			this.animation = playerAnimationFactory.attachTo(this);
			this.animation.changeState("walk-right");
		}
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		let stateChanged = false;
		const updateState = (state: IPlayerAnimations) => {
			stateChanged = true;
			this.state = state;
		};

		// change movement if not currently in the air
		if (this.isGround()) {

			// just landed
			if (this.state === states.jump && this.posYold < (600 - 65)) {
				console.log("just landed");
				updateState(states.default);
			}

			if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space) && this.state !== states.jump) {
				this.jump();
				this.ducked = false;
				updateState(states.jump);
			}

			if (this.state !== states.jump) {

				if (engine.input.keyboard.isHeld(ex.Input.Keys.D)) {
					this.duck();
					updateState(states.duck);
				}

				if (engine.input.keyboard.wasReleased(ex.Input.Keys.D)) {
					this.unDuck();
					updateState(states.default);
				}

			}

			if (this.state !== states.jump && this.state !== states.duck) {

				// X movement
				if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) { // if (engine.input.keyboard.wasPressed(ex.Input.Keys.Left)) {
					this.speed = this.speedDec;
					updateState(states.slow);
				}

				if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) { // if (engine.input.keyboard.wasPressed(ex.Input.Keys.Right)) {
					this.speed = this.speedAcc;
					updateState(states.fast);
				}

				if (engine.input.keyboard.wasReleased(ex.Input.Keys.Left)) {
					if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
						this.speed = this.speedAcc;
						updateState(states.fast);
					} else {
						this.speed = this.speedNormal;
						updateState(states.default);
					}
				}

				if (engine.input.keyboard.wasReleased(ex.Input.Keys.Right)) {
					if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
						this.speed = this.speedDec;
						updateState(states.slow);
					} else {
						this.speed = this.speedNormal;
						updateState(states.default);
					}
				}

				if (engine.input.keyboard.isHeld(ex.Input.Keys.Left) && engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
					this.speed = this.speedNormal;
					updateState(states.default);
				}

			}

		}

		if (!this.ducked) {
			this.pos.x += this.speed * delta / 1000;
		} else {
			this.pos.x += this.speedDucked * delta / 1000;
		}

		if (this.getWorldPos().x > 4950) {
			this.emit("won");
		}

		this.posYold = this.pos.y;

		if (stateChanged && this.animation)
			this.animation.changeState(this.state);

	}

	private jump() {
		this.vel.y = -450;
	}

	private duck() {
		if (this.ducked)
			return; // already ducked
		this.ducked = true;
		this.setHeight(this.getHeight() / 2);
		this.collisionArea.body.useBoxCollision();
	}

	private unDuck() {
		if (!this.ducked)
			return; // already unducked
		this.ducked = false;
		this.setHeight(this.getHeight() * 2);
		this.collisionArea.body.useBoxCollision();
	}

	public die(info: string) {
		if (!this.dead) {

			// console.log("cam rot: "+this.scene.camera.rotation + "   (level3 - player - die)"); // proof that rotation is not influenced by anything else

			this.dead = true;

			// this.rotation = Math.PI / 2;
			this.setHeight(this.getHeight() / 4);
			this.collisionArea.body.useBoxCollision();

			this.scene.camera.shake(50, 50, 500);

			let player: Player = this;
			setTimeout(() => {

				player.kill();
				this.emit("death");

			}, 550);
		}
	}

	pointerDown(pe: any) {
		if (pe.pointerType === ex.Input.PointerType.Touch) {
			// this alert works, jumping doesn't :'(
			alert("touch pointer down");
			this.jump();
			this.jumpFlag = true;
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

}
