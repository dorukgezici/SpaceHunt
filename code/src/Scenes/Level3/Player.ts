import * as ex from "excalibur";
import BasePlayer from "../../Components/BasePlayer";

export default class Player extends BasePlayer {

	cameraStrategy: ex.LockCameraToActorStrategy;
	dead: boolean = false;
	ducked: boolean = false;
	engine: ex.Engine;
	jumpFlag: boolean = false;

	speed: number;
	speedAcc: number = 300;
	speedNormal: number = 200;
	speedDec: number = 100;
	speedDucked: number = 50;

	minX: number;
	maxX: number;

	constructor(x: number, y: number, levelBounds: ex.BoundingBox, engine: ex.Engine) {
		super(x, y);
		
		this.anchor.setTo(0.5, 1); // set anchor to the center of the bottom edge
		this.y += this.getHeight();
		this.collisionArea.body.useBoxCollision();
		
		this.cameraStrategy = new ex.LockCameraToActorAxisStrategy(this, ex.Axis.X);
		// this.cameraStrategy = new ex.LockCameraToActorStrategy(this);
		this.minX = levelBounds.left + Player.size.w / 2;
		this.maxX = levelBounds.right - Player.size.w / 2;
		this.speed = this.speedNormal;

		// touch pointer events
		this.engine = engine;
		engine.input.pointers.primary.on("down", this.pointerDown);
	}


	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
			this.jump();
		}
		
		if (this.jumpFlag) {
			this.jumpFlag = false;
			this.jump();
		}
		

		// X movement
		if (engine.input.keyboard.wasPressed(ex.Input.Keys.Left)) {
			this.speed = this.speedDec;
		}

		if (engine.input.keyboard.wasPressed(ex.Input.Keys.Right)) {
			this.speed = this.speedAcc;
		}

		if (engine.input.keyboard.wasReleased(ex.Input.Keys.Left)) {
			if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
				this.speed = this.speedAcc;
			} else {
				this.speed = this.speedNormal;
			}
		}

		if (engine.input.keyboard.wasReleased(ex.Input.Keys.Right)) {
			if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
				this.speed = this.speedDec;
			} else {
				this.speed = this.speedNormal;
			}
		}

		if (engine.input.keyboard.isHeld(ex.Input.Keys.Left) && engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
			this.speed = this.speedNormal;
		}

		
		if (engine.input.keyboard.wasPressed(ex.Input.Keys.D)) {
			this.duck();
		}

		if (engine.input.keyboard.wasReleased(ex.Input.Keys.D)) {
			this.unDuck();
		}

		if(!this.ducked) {
			this.pos.x += this.speed * delta / 1000;
		} else {
			this.pos.x += this.speedDucked * delta / 1000;
		}
	}


	private jump() {
		let groundLevel = this.scene.engine.getWorldBounds().bottom - 50;

		if (groundLevel - this.getBottom() < 15) {
			this.vel.y = -450;
		}
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

	public die(info: string) {
		if (!this.dead) {

			// console.log("cam rot: "+this.scene.camera.rotation + "   (level3 - player - die)"); // proof that rotation is not influenced by anything else

			this.dead = true;

			// this.rotation = Math.PI / 2;
			this.setHeight(this.getHeight() / 4);
			this.collisionArea.body.useBoxCollision();

			this.scene.camera.shake(50, 50, 500);			

			let player: Player = this;
			setTimeout(function() {

				player.kill();
				alert(info);

			}, 550);
		}
	}

	pointerDown(pe:any) {
		if(pe.pointerType === ex.Input.PointerType.Touch) {
			// this alert works, jumping doesn't :'(
			alert("touch pointer down");
			this.jump();
			this.jumpFlag = true;
		}
	}
}
