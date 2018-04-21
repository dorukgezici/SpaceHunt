import * as ex from "excalibur";
import BasePlayer, { controlSets, IControlSet } from "../../Components/BasePlayer";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";
import { attachPlayerAnimations } from "./PlayerAnimations";
import Vine from "./Vine";
import { IPlayerAnimations, selectedState } from "../../Components/Animations/MichelsonAnimation";
import AnimationStateHandler from "../../Components/Animations/AnimationStateHandler";

export default class Level1Player extends BasePlayer {
	static readonly MOVEMENT_SPEED = 8;
	static readonly SCREEN_END_X = 5;

	inJump: boolean = false;
	onBranch: boolean = true;
	levelLength: number;
	onVine: boolean = false;
	// cameraStrategy: ex.LockCameraToActorAxisStrategy;
	private animationStateHandler: AnimationStateHandler<IPlayerAnimations>;

	constructor(x: number, y: number, levelLength: number, controlSet: IControlSet) {
		super(x, y, controlSet);
		// this.cameraStrategy = new ex.LockCameraToActorAxisStrategy(this, ex.Axis.X);
		this.on("precollision", this.onPrecollision);
		this.on("postcollision", this.onPostcollision);
		const animation = attachPlayerAnimations(this);
		this.animationStateHandler = new AnimationStateHandler<IPlayerAnimations>(selectedState, animation);
		this.levelLength = levelLength;
	}

	// initAnimations(): void { }

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
		const { animationStateHandler: ash } = this;

		if (engine.input.keyboard.wasPressed(this.controls.up)) {
			this.jump();
			ash.changeState("jump-right");
		}

		if (!this.onVine && engine.input.keyboard.wasReleased(ex.Input.Keys.Left)) {
			ash.changeState("idle-left");
		}

		if (!this.onVine && engine.input.keyboard.wasReleased(ex.Input.Keys.Right)) {
			ash.changeState("idle-right");
		}

		if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
			this.moveLeft();
			ash.changeState("walk-left");
		}

		if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
			this.moveRight();
			ash.changeState("walk-right");
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
			this.inJump = false;
			this.attachToVine(e.other as Vine);
		}
	}

	onPostcollision(e: any | ex.PostCollisionEvent) {
		if (e.other.constructor.name === "Ground") {
			this.die("died by falling on the ground");
		}
	}

	attachToVine(vine: Vine) {
		this.scene.remove(this);
		vine.add(this);
		let vineRoot = vine.getRoot();

		for (let v of vineRoot.getAllParts()) {
			v.collisionType = ex.CollisionType.PreventCollision;
		}

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
