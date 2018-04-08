import * as ex from "excalibur";
import BasePlayer from "../../Components/BasePlayer";
import { GameBootstrap } from "../../GameBootstrap";
import { playerAnimationFactory, IPlayerAnimations } from "./PlayerAnimations";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";


export default class Player extends BasePlayer {
	static readonly size = { w: 40, h: 120 };
	static readonly speed: number = 8;
	private minX: number;
	private maxX: number;
	private ducked: boolean = false;
	private jumping: boolean = false;
	private walking: boolean = false;
	private animationsInited: boolean = false;
	private animation: DrawAnimation<IPlayerAnimations> | null = null;

	constructor(x: number, y: number, levelBounds: ex.BoundingBox, private readonly bootstrap: GameBootstrap) {
		super(x, y);
		this.minX = levelBounds.left + Player.size.w / 2;
		this.maxX = levelBounds.right - Player.size.w / 2;
		this.anchor.setTo(0.5, 1); // set anchor to the center of the bottom edge
		this.y += this.getHeight() / 2;
		playerAnimationFactory.attachTo(this);
	}

	initAnimations() {
		if (!this.animationsInited) {
			this.animationsInited = true;
			this.animation = playerAnimationFactory.attachTo(this);
		}
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		const { keyboard } = engine.input;
		const { Keys } = ex.Input;
		const groundLevel = this.scene.engine.getWorldBounds().bottom - 50;
		const jumpPressed = keyboard.wasPressed(Keys.Space);
		const leftHeld = keyboard.isHeld(Keys.Left);
		const rightHeld = keyboard.isHeld(Keys.Right);
		const duckPressed = keyboard.wasPressed(Keys.D);
		const duckReleased = keyboard.wasReleased(Keys.D);

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

		if (this.animationsInited && this.animation) {
			const jumping = jumpPressed || (groundLevel - this.getBottom() >= 1);
			const walking = leftHeld || rightHeld;
			const ducked = (this.ducked && !duckReleased) || (!this.ducked && duckPressed);

			let change = (jumping !== this.jumping) || (walking !== this.walking) || (this.ducked !== ducked);
			if (change) {
				this.jumping = jumping;
				this.walking = walking;

				if (jumping)
					this.animation.changeState("jump");
				else if (ducked)
					this.animation.changeState("duck");
				else if (walking)
					this.animation.changeState("walk");
				else
					this.animation.changeState("idle");
			}
		}

	}

	private jump() {
		const groundLevel = this.scene.engine.getWorldBounds().bottom - 50;

		if (groundLevel - this.getBottom() < 15) {
			this.vel.y = -1500;
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

	private duck() {
		if (this.ducked)
			return; // already ducked
		this.ducked = true;
		this.setHeight(this.getHeight() / 2);
		this.collisionArea.body.useBoxCollision();
	}

	private unDuck() {
		if (!this.ducked)
			return; // already ducked
		this.ducked = false;
		this.setHeight(this.getHeight() * 2);
		this.collisionArea.body.useBoxCollision();
	}

}
