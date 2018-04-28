import * as ex from "excalibur";
import BasePlayer, { controlSets, IControlSet } from "../../Components/BasePlayer";
import { DrawAnimation } from "../../Components/Animations/Framework/DrawAnimation";
import { playerAnimationFactory, IPlayerAnimations, states as maStates, brotherAnimationFactory } from "../../Components/Animations/Models/MikelsonAnimation";
import Level3 from "./Level3";
import BaseLevel from "../../Components/BaseLevel";
import Ground from "../../Components/Ground";
import { IGameBootstrapState } from "../../GameBootstrap";
import { modelDuckSize, modelSize } from "../../Components/Animations/Models/MikelsonParts";

const states = {
	default: maStates.walkRight,
	slow: maStates.walkSlowRight,
	fast: maStates.walkFastRight,
	jump: maStates.jumpRight,
	duck: maStates.duckRight
};

export default class Level3Player extends BasePlayer {

	ducked: boolean = false;
	jumpFlag: boolean = false;
	private animation: DrawAnimation<IPlayerAnimations>;

	private posYold: number;

	private jumpingVelocity: number = -600;

	private speed: number;
	private speedAcc: number = 300;
	private speedNormal: number = 200;
	private speedDec: number = 100;
	private speedDucked: number = 50;

	private minX: number;
	private maxX: number;
	private animationState: IPlayerAnimations = states.default;

	constructor(x: number, y: number, controlSet: IControlSet, state: IGameBootstrapState, isFirst: boolean) {
		super(x, y, controlSet, state);
		(this as any).$a = controlSet === controlSets.controls1 ? "first p" : "second p";

		this.anchor.setTo(0.5, 1); // set anchor to the center of the bottom edge
		this.collisionArea.body.useBoxCollision();

		this.minX = Level3.levelBounds.left + BasePlayer.size.w / 2;
		this.maxX = Level3.levelBounds.right - BasePlayer.size.w / 2;
		this.speed = this.speedNormal;

		this.posYold = this.pos.y;

		if (isFirst)
			this.animation = playerAnimationFactory.attachTo(this);
		else
			this.animation = brotherAnimationFactory.attachTo(this);
		this.animation.changeState("walk-right");
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		let stateChanged = false;
		const updateState = (animationState: IPlayerAnimations) => {
			stateChanged = true;
			this.animationState = animationState;
		};

		// change movement if not currently in the air
		if (this.isGround()) {

			// just landed
			let groundLevel = this.scene.engine.getWorldBounds().bottom - Ground.height;
			if (this.animationState === states.jump && this.posYold < (groundLevel - 5)) {
				console.log("just landed");
				updateState(states.default);
			}

			if (engine.input.keyboard.wasPressed(this.controls.up) && this.animationState !== states.jump) {
				this.jump();
				this.ducked = false;
				updateState(states.jump);
			}

			if (this.animationState !== states.jump) {

				if (engine.input.keyboard.isHeld(this.controls.down)) {
					this.duck();
					updateState(states.duck);
				}

				if (engine.input.keyboard.wasReleased(this.controls.down)) {
					this.unDuck();
					updateState(states.default);
				}

			}

			if (this.animationState !== states.jump && this.animationState !== states.duck) {

				// X movement
				if (engine.input.keyboard.isHeld(this.controls.left)) {
					this.speed = this.speedDec;
					updateState(states.slow);
				}

				if (engine.input.keyboard.isHeld(this.controls.right)) {
					this.speed = this.speedAcc;
					updateState(states.fast);
				}

				if (engine.input.keyboard.wasReleased(this.controls.left)) {
					if (engine.input.keyboard.isHeld(this.controls.right)) {
						this.speed = this.speedAcc;
						updateState(states.fast);
					} else {
						this.speed = this.speedNormal;
						updateState(states.default);
					}
				}

				if (engine.input.keyboard.wasReleased(this.controls.right)) {
					if (engine.input.keyboard.isHeld(this.controls.left)) {
						this.speed = this.speedDec;
						updateState(states.slow);
					} else {
						this.speed = this.speedNormal;
						updateState(states.default);
					}
				}

				if (engine.input.keyboard.isHeld(this.controls.left) && engine.input.keyboard.isHeld(this.controls.right)) {
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
			this.win("won level3 by reaching the end");
		}

		this.posYold = this.pos.y;

		if (stateChanged)
			this.animation.changeState(this.animationState);

	}

	private jump() {
		this.vel.y = this.jumpingVelocity;
	}

	private duck() {
		if (this.ducked)
			return; // already ducked
		this.ducked = true;
		this.setHeight(modelDuckSize.h);
		this.collisionArea.body.useBoxCollision();
	}

	private unDuck() {
		if (!this.ducked)
			return; // already unducked
		this.ducked = false;
		this.setHeight(modelSize.h);
		this.collisionArea.body.useBoxCollision();
	}

}
