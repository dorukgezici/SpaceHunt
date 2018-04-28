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
	private animationStateHandler: AnimationStateHandler<IPlayerAnimations>;

	constructor(x: number, y: number, levelLength: number, controlSet: IControlSet, state: IGameBootstrapState, isFirst: boolean) {
		super(x, y, controlSet, state);
		this.on("precollision", this.onPrecollision);
		this.on("postcollision", this.onPostcollision);
		const animation = attachPlayerAnimations(this, !isFirst);
		this.animationStateHandler = new AnimationStateHandler<IPlayerAnimations>(selectedState, animation);
		this.levelLength = levelLength;
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
		const { animationStateHandler: ash } = this;

		if (engine.input.keyboard.wasPressed(this.controls.up)) {
			this.jump();
			ash.changeState("jump-right");
		}

		if (!this.onVine && engine.input.keyboard.wasReleased(this.controls.left)) {
			if(this.onBranch) {
				ash.changeState("idle-left");
			}
		}

		if (!this.onVine && engine.input.keyboard.wasReleased(this.controls.right)) {
			if(this.onBranch) {
				ash.changeState("idle-right");
			}
		}

		if (engine.input.keyboard.isHeld(this.controls.left)) {
			this.moveLeft();

			if(this.onBranch) {
				ash.changeState("walk-left");
			}
		}

		if (engine.input.keyboard.isHeld(this.controls.right)) {
			this.moveRight();

			if(this.onBranch) {
				ash.changeState("walk-right");
			}
		}

		if (this.getWorldPos().x > this.levelLength + 10) {
			this.emit("won");
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

	attachToVine(vine: Vine) {
		let vineRoot = vine.getRoot();

		if(vineRoot.alreadyCollidedWith.indexOf(this) !== -1) {
			return;
		}

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
}
