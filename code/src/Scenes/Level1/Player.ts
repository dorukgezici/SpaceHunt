import * as ex from "excalibur";
import BasePlayer from "../../Components/BasePlayer";
import Vine from "./Vine";
import { DrawAnimation } from "../../Components/Animations/DrawAnimation";
import { attachPlayerAnimations, ITarzanAnimations } from "./PlayerAnimations";

export default class Level1Player extends BasePlayer {

	inJump: boolean = false;
	onVine: boolean = false;
	cameraStrategy: ex.LockCameraToActorAxisStrategy;
	private animation: DrawAnimation<ITarzanAnimations>;
	private hasStarted = false;

	constructor(x: number, y: number) {
		super(x, y);
		this.cameraStrategy = new ex.LockCameraToActorAxisStrategy(this, ex.Axis.X);
		this.on("precollision", this.onPrecollision);
		this.on("postcollision", this.onPostcollision);
		this.animation = attachPlayerAnimations(this);
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
			this.jump();
			if (!this.hasStarted) {
				this.hasStarted = true;
				this.animation.changeState("jump");
			}
		}

		if (this.getWorldPos().x < -10) {
			this.emit("won");
		}
	}

	jump() {
		if (!this.inJump) {
			if (this.onVine) {
				let parent = this.parent;
				this.parent.remove(this);
				this.scene.add(this);
				this.pos.setTo(parent.pos.x, parent.pos.y);
				this.collisionType = ex.CollisionType.Active;
				this.cameraStrategy.target = this;
			}

			this.vel.setTo(-600, -500);
			this.rotation = - Math.PI / 6;
			this.inJump = true;
			this.onVine = false;
			this.animation.changeState("jump");
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
			this.emit("fell");
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
		this.pos.x = 2;
		this.pos.y = Level1Player.size.h / 2;
		this.vel.setTo(0, 0);
		this.rotation = 0;
		this.cameraStrategy.target = vine;
		this.animation.changeState("grab");
	}
}
