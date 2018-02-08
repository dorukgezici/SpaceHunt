import * as ex from "excalibur";

export default class Player extends ex.Actor {

	static readonly size = {w: 25, h: 100};

	constructor(x: number, y: number) {
		super(x, y, Player.size.w, Player.size.h, ex.Color.Azure);
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
		this.pos.x -= 8;
	}

	private goRight() {
		this.pos.x += 8;
	}
}
