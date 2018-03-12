import * as ex from "excalibur";

export default class Vine extends ex.Actor {
	static readonly partLength = 20;
	static readonly partWidth = 4;

	speed: number;
	maxRotation: number;
	time: number = 0;

	nextPart: Vine | null = null;
	prevPart: Vine | null = null;

	constructor(x: number, y: number, length: number, speed: number, maxRotation: number) {
		super(x, y, Vine.partWidth, Vine.partLength, ex.Color.Yellow);

		this.collisionType = ex.CollisionType.Passive;
		this.anchor.setTo(1, 0.2);
		this.body.useCircleCollision(4, new ex.Vector(0, 7));
		this.speed = speed;
		this.maxRotation = maxRotation / 10;

		if(length - 1 > 0) {
			this.nextPart = new Vine(this.x, Vine.partLength - 3 + this.y, length - 1, speed, maxRotation);
			this.nextPart.prevPart = this;
		}
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
		this.rotation = Math.sin(this.time * this.speed) * this.maxRotation;

		this.isOffScreen = this.prevPart ? !(!this.prevPart.isOffScreen || !this.isOffScreen) : this.isOffScreen;
		this.rotation += this.prevPart ? this.prevPart.rotation : 0;
		this.time += delta / 1000;

		if(this.prevPart) {
			let posDiff = new ex.Vector(0, Vine.partLength - 3);
			posDiff = posDiff.rotate(this.prevPart.rotation, new ex.Vector(1, 1));
			this.pos.x = this.prevPart.x + posDiff.x;
			this.pos.y = this.prevPart.y + posDiff.y - 1;
		}
	}

	getAllParts(): Vine[] {
		let root: Vine = this;
		let vineParts: Vine[] = [];

		while(root.nextPart) {
			vineParts.push(root);
			root = root.nextPart;
		}

		return vineParts;
	}

	getRoot(): Vine {
		let root: Vine = this;

		while(root.prevPart) {
			root = root.prevPart;
		}

		return root;
	}
}
