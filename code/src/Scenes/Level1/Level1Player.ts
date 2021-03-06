import * as ex from "excalibur";
import BasePlayer, { IControlSet } from "../../Components/BasePlayer";
import { attachPlayerAnimations } from "./PlayerAnimations";
import Vine from "./Vine";
import { IGameBootstrapState } from "../../GameBootstrap";
import { IPlayerAnimations, selectedState } from "../../Components/Animations/Models/MikelsonAnimation";
import AnimationStateHandler from "../../Components/Animations/Framework/AnimationStateHandler";

export default class Level1Player extends BasePlayer {
	static readonly MOVEMENT_SPEED = 8;
	static readonly SCREEN_END_X = 5;

	inJump: boolean = false;
	onBranch: boolean = true;
	levelLength: number;
	onVine: boolean = false;
	timeOnVine: number = 500;
	timer: number = NaN;
	private animationStateHandler: AnimationStateHandler<IPlayerAnimations>;
	private originalPosition: ex.IAbsolutePosition;

	constructor(x: number, y: number, levelLength: number, controlSet: IControlSet, state: IGameBootstrapState, isFirst: boolean) {
		super(x, y, controlSet, state);
		this.on("precollision", this.onPrecollision);
		this.on("postcollision", this.onPostcollision);
		const animation = attachPlayerAnimations(this, !isFirst);
		this.animationStateHandler = new AnimationStateHandler<IPlayerAnimations>(selectedState, animation);
		this.levelLength = levelLength;
		this.originalPosition = { left: x, top: y };
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
		const { animationStateHandler: ash } = this;

		if (engine.input.keyboard.wasPressed(this.controls.up)) {
			this.jump();
			ash.changeState("jump-right");
		}

		if (!this.onVine && engine.input.keyboard.wasReleased(this.controls.left)) {
			if (this.onBranch) {
				ash.changeState("idle-left");
			}
		}

		if (!this.onVine && engine.input.keyboard.wasReleased(this.controls.right)) {
			if (this.onBranch) {
				ash.changeState("idle-right");
			}
		}

		if (engine.input.keyboard.isHeld(this.controls.left)) {
			this.moveLeft();

			if (this.onBranch) {
				ash.changeState("walk-left");
			}
		}

		if (engine.input.keyboard.isHeld(this.controls.right)) {
			this.moveRight();

			if (this.onBranch) {
				ash.changeState("walk-right");
			}
		}

		if (this.getWorldPos().x > this.levelLength + 10) {
			this.win("won by reaching the level ending");
		}
	}

	jump() {
		this.onBranch = false;

		if (!this.inJump) {
			if (this.onVine) {
				let parent = this.parent;
				this.parent.remove(this);
				this.scene.add(this);
				this.pos.setTo(parent.pos.x, parent.pos.y);
				this.collisionType = ex.CollisionType.Active;
				this.cameraStrategy.target = this;
			}

			this.vel.setTo(600, -500);
			this.rotation = - Math.PI / 6;
			this.inJump = true;
			this.onVine = false;
		}
	}

	onPrecollision(e: any | ex.PreCollisionEvent) {
		if (e.other.constructor.name === "Vine" && !this.onVine) {
			this.attachToVine(e.other as Vine);
		}
	}

	onPostcollision(e: any | ex.PostCollisionEvent) {
		if (e.other.constructor.name === "Ground") {
			this.die("died by falling on the ground");
		}
	}

	public dispose() {
		if (!Number.isNaN(this.timer))
			clearInterval(this.timer);
	}

	attachToVine(vine: Vine) {
		let vineRoot = vine.getRoot();

		if (vineRoot.alreadyCollidedWith.indexOf(this) !== -1) {
			return;
		}

		this.state.score += Math.round(50000 / this.timeOnVine); // Max 100, min 10 points
		console.log(this.timeOnVine);
		this.timeOnVine = 500;
		if (!Number.isNaN(this.timer))
			clearInterval(this.timer);
		this.timer = setInterval(this.addTimeOnVine.bind(this), 500);

		this.inJump = false;
		vineRoot.alreadyCollidedWith.push(this);
		this.scene.remove(this);
		vine.add(this);

		this.onVine = true;
		this.pos.y = 20 + Level1Player.size.h / 2;
		this.pos.x = 0;
		this.vel.setTo(0, 0);
		this.rotation = 0;
		this.cameraStrategy.target = vine;
		this.animationStateHandler.changeState("grab-right");
	}

	private moveLeft() {
		if (this.onBranch) {
			let newPos = this.pos.x - Level1Player.MOVEMENT_SPEED;
			newPos = newPos < Level1Player.SCREEN_END_X ? Level1Player.SCREEN_END_X : newPos;
			this.pos.x = newPos;
		}
	}

	private moveRight() {
		if (this.onBranch) {
			this.pos.x += Level1Player.MOVEMENT_SPEED;
		}
	}

	addTimeOnVine() {
		this.timeOnVine += 150;
		if (this.timeOnVine > 5000)
			this.timeOnVine = 5000;
	}

	die(info: string) {
		if (!this.dead && this.state.lives > 1) {
			this.reset();
		}
		super.die(info);
	}

	private reset() {
		this.inJump = false;
		this.onVine = false;
		this.onBranch = true;
		this.x = this.originalPosition.left as number;
		this.y = this.originalPosition.top as number;
		this.vel.setTo(0, 0);
		this.animationStateHandler.changeState("idle-right");

		let event = new ex.GameEvent<Level1Player>();
		event.target = this;

		this.emit("reset", event);
	}
}
