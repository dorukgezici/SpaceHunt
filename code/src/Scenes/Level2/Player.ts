import * as ex from "excalibur";

export default class Player extends ex.Actor {

	static readonly size = { w: 100, h: 50 }; //changed for swimming movement

	//static speed: number = 8; //to be changed for normal/slower/faster swimming movement
	static readonly speedY: number = 2;
	static readonly speedAcc: number = 200;
	static readonly speedNormal: number = 100;
	static readonly speedDec: number = 50;

	private minX: number;
	private maxX: number;
	private minY: number;
	private maxY: number;

	private speedX: number = Player.speedNormal;
	//private ducked: boolean = false;

	public trapped: boolean = false; //for disabling controls in case of being trapped by a bubble

	constructor(x: number, y: number, levelBounds: ex.BoundingBox) {
		super(x, y, Player.size.w, Player.size.h, ex.Color.DarkGray);
		this.minX = levelBounds.left + Player.size.w / 2;
		this.maxX = levelBounds.right - Player.size.w / 2;
		this.minY = levelBounds.top + Player.size.h / 2;
		this.maxY = levelBounds.bottom - Player.size.h / 2;

		//Anchor
		this.anchor.setTo(1, 0.5); // set anchor to the center of the right edge (?)
		//this.y += this.getHeight() / 2;

		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Active;
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);

		if (!this.trapped) {
			//X movement
			if (engine.input.keyboard.wasPressed(ex.Input.Keys.Left)) {
				this.speedX = Player.speedDec;
			}

			if (engine.input.keyboard.wasPressed(ex.Input.Keys.Right)) {
				this.speedX = Player.speedAcc;
			}

			if (engine.input.keyboard.wasReleased(ex.Input.Keys.Left)) {
				if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
					this.speedX = Player.speedAcc;
				} else {
					this.speedX = Player.speedNormal;
				}
			}

			if (engine.input.keyboard.wasReleased(ex.Input.Keys.Right)) {
				if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
					this.speedX = Player.speedDec;
				} else {
					this.speedX = Player.speedNormal;
				}
			}

			if (engine.input.keyboard.isHeld(ex.Input.Keys.Left) && engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
				this.speedX = Player.speedNormal;
			}

			this.vel.x = this.speedX;
			//check for Level ending -> better raise event in case of collision with level ending?

			//Y movement
			if (engine.input.keyboard.isHeld(ex.Input.Keys.Up)) {
				this.moveUp();
			}

			if (engine.input.keyboard.isHeld(ex.Input.Keys.Down)) {
				this.moveDown();
			}
		}


	}


	private moveUp() {
		this.pos.y -= Player.speedY;
	}

	private moveDown() {
		this.pos.y += Player.speedY / 2;
	}
}
