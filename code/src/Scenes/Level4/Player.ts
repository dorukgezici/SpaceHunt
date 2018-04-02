import * as ex from "excalibur";
import BasePlayer from "../../Components/BasePlayer";


export default class Player extends BasePlayer {
	static readonly speed: number = 8;
	private minX: number;
	private maxX: number;
	dead: boolean = false;
	private moveDir: number = 0;

	constructor(x: number, y: number, levelBounds: ex.BoundingBox) {
		super(x, y);
		this.minX = levelBounds.left + Player.size.w / 2;
		this.maxX = levelBounds.right - Player.size.w / 2;
		this.anchor.setTo(0.5, 1);
		this.body.useBoxCollision();
		this.y += this.getHeight() / 2;
		this.color = ex.Color.Orange;
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		// change direction of movement if not currently jumping
		if (this.isGround()) {

			if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
				this.jump();
			}

			this.moveDir = 0;
			if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
				// this.goLeft();
				this.moveDir = 1;
			}

			if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
				// this.goRight();
				this.moveDir = -1;
			}
		}

		// move according to direction of movement
		this.pos.x -= Player.speed * this.moveDir;
		this.pos.x = this.pos.x < this.minX ? this.minX : this.pos.x;
		this.pos.x = this.pos.x > this.maxX ? this.maxX : this.pos.x;

	}

	private jump() {
		if (this.isGround()) {
			this.vel.setTo(this.vel.x, -700);
			// console.log(this.vel);
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

	public die(info: string) {
		if (!this.dead) {

			// console.log("cam rot: "+this.scene.camera.rotation + "   (level3 - player - die)"); // proof that rotation is not influenced by anything else

			this.dead = true;

			// this.setHeight(this.getHeight() / 4);
			this.collisionArea.body.useBoxCollision();

			this.scene.camera.shake(50, 50, 500);

			let player: Player = this;
			setTimeout(function () {

				player.kill();
				alert(info);

			}, 550);
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
