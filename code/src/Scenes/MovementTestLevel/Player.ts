import * as ex from "excalibur";

export default class Player extends ex.Actor {

	static readonly size = {w: 25, h: 100};
	static readonly speed: number = 8;
	private minX: number;
	private maxX: number;

	constructor(x: number, y: number, levelBounds: ex.BoundingBox) {
		super(x, y, Player.size.w, Player.size.h, ex.Color.Azure);
		this.minX = levelBounds.left + Player.size.w / 2;
		this.maxX = levelBounds.right - Player.size.w / 2;
		this.collisionType = ex.CollisionType.Active;
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		if(engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
			this.jump();
		}

		if(engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
			this.goLeft();
		}

		if(engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
			this.goRight();
		}
	}

	private jump() {
		let groundLevel = this.scene.engine.getWorldBounds().bottom - 50;

		if(groundLevel - this.getBottom() < 15) {
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
}
