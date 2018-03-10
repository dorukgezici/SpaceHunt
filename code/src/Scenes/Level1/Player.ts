import * as ex from "excalibur";
import BasePlayer from "../../Components/BasePlayer";
import Vine from "./Vine";

export default class Level1Player extends BasePlayer {

	inJump: boolean = false;
	onVine: boolean = false;

	constructor(x: number, y: number, ) {
		super(x, y);
		this.on("precollision", this.onPrecollision);
		this.on("postcollision", this.onPostcollision);
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
			this.jump();
		}

		// console.log(this.getWorldPos(), this.pos);
	}

	jump() {
		if(!this.inJump) {
			if(this.onVine) {
				this.pos.setTo(this.parent.pos.x, this.parent.pos.y);
				this.parent.remove(this);
				this.collisionType = ex.CollisionType.Active;
				this.scene.camera.strategy.lockToActorAxis(this, ex.Axis.X);
			}

			this.vel.setTo(-600, -500);
			this.rotation = - Math.PI / 6;
			this.inJump = true;
			this.onVine = false;
		}
	}

	onPrecollision(e: any | ex.PreCollisionEvent) {
		if(e.other.constructor.name === "Vine" && !this.onVine) {
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
		vine.add(this);
		let vineRoot = vine.getRoot();

		for(let v of vineRoot.getAllParts()) {
			v.collisionType = ex.CollisionType.PreventCollision;
		}

		this.onVine = true;
		this.pos.x = 2;
		this.pos.y = Level1Player.size.h / 2;
		this.vel.setTo(0, 0);
		this.rotation = 0;
		this.scene.camera.strategy.lockToActorAxis(vineRoot, ex.Axis.X);
	}
}
