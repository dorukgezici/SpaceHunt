import * as ex from "excalibur";
import BasePlayer, { controlSets, IControlSet } from "../../Components/BasePlayer";
import { GameBootstrap } from "../../GameBootstrap";
import { playerAnimationFactory, IPlayerAnimations } from "../../Components/Animations/MichelsonAnimation";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";
import { modelSize, modelDuckSize } from "../../Components/Animations/MichaelsonParts";

export default class Player extends BasePlayer {
	static readonly size = modelSize;
	static readonly duckSize = modelDuckSize;
	static readonly speed: number = 8;
	private minX: number;
	private maxX: number;
	private ducked: boolean = false;
	private jumping: boolean = false;
	private walking: boolean = false;
	private animation: DrawAnimation<IPlayerAnimations>;
	private left = false;
	private change = false;

	constructor(x: number, y: number, levelBounds: ex.BoundingBox, private readonly bootstrap: GameBootstrap, controlSet: IControlSet) {
		super(x, y, controlSet);
		this.minX = levelBounds.left + Player.size.w / 2;
		this.maxX = levelBounds.right - Player.size.w / 2;
		this.anchor.setTo(0.5, 1); // set anchor to the center of the bottom edge
		this.y += this.getHeight() / 2;
		this.collisionArea.body.useBoxCollision();
		this.animation = playerAnimationFactory.attachTo(this);
	}

	initAnimations(): void { }

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		const { keyboard } = engine.input;
		const { Keys } = ex.Input;
		const groundLevel = this.scene.engine.getWorldBounds().bottom - 50;
		const jumpPressed = keyboard.wasPressed(Keys.Space);
		const leftHeld = keyboard.isHeld(Keys.Left);
		const rightHeld = keyboard.isHeld(Keys.Right);
		const duckPressed = keyboard.wasPressed(Keys.Down);
		const duckReleased = keyboard.wasReleased(Keys.Down);
		const ducked = this.ducked;

		if (jumpPressed)
			this.jump();
		if (leftHeld)
			this.goLeft();
		if (rightHeld)
			this.goRight();
		if (duckPressed)
			this.duck();
		if (duckReleased)
			this.unDuck();

		const jumping = jumpPressed || (groundLevel - this.getBottom() >= 1);
		const walking = leftHeld || rightHeld;

		let change = this.change || (jumping !== this.jumping) || (walking !== this.walking) || (this.ducked !== ducked);
		if (change) {
			this.jumping = jumping;
			this.walking = walking;
			this.change = false;

			if (jumping)
				this.animation.changeState("jump-" + (this.left ? "left" : "right") as IPlayerAnimations);
			else if (this.ducked)
				this.animation.changeState("duck-" + (this.left ? "left" : "right") as IPlayerAnimations);
			else if (walking)
				this.animation.changeState("walk-" + (this.left ? "left" : "right") as IPlayerAnimations);
			else
				this.animation.changeState("idle-" + (this.left ? "left" : "right") as IPlayerAnimations);
		}

	}

	private jump() {
		const groundLevel = this.scene.engine.getWorldBounds().bottom - 50;

		if (groundLevel - this.getBottom() < 15) {
			this.vel.y = -1500;
		}
	}

	private goLeft() {
		if (!this.left) {
			this.left = true;
			this.change = true;
		}
		this.pos.x -= Player.speed;
		this.pos.x = this.pos.x < this.minX ? this.minX : this.pos.x;
	}

	private goRight() {
		if (this.left) {
			this.left = false;
			this.change = true;
		}
		this.pos.x += Player.speed;
		this.pos.x = this.pos.x > this.maxX ? this.maxX : this.pos.x;
	}

	private duck() {
		if (this.ducked)
			return; // already ducked
		this.ducked = true;
		this.setHeight(Player.duckSize.h);
		this.collisionArea.body.useBoxCollision();
	}

	private unDuck() {
		if (!this.ducked)
			return; // already ducked
		this.ducked = false;
		this.setHeight(Player.size.h);
		this.collisionArea.body.useBoxCollision();
	}

}
