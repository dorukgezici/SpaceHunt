import * as ex from "excalibur";

export default class Vine extends ex.Actor {

	static readonly partLength = 20;
	static readonly partWidth = 4;

	speed: number;
	maxRotation: number;
	time: number = 0;

	constructor(x: number, y: number, length: number, speed: number, maxRotation: number) {
		super(x, y, Vine.partWidth, Vine.partLength, ex.Color.Yellow);
		this.collisionType = ex.CollisionType.Passive;
		this.anchor.setTo(0, 0.2);
		this.speed = speed;
		this.maxRotation = maxRotation / 10;

		if(length - 1 > 0) {
			let nextPart = new Vine(0, Vine.partLength - 3, length - 1, speed, maxRotation);
			this.add(nextPart);
		}
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
		this.rotation = Math.sin(this.time * this.speed) * this.maxRotation;
		this.time += delta / 1000;
	}
}
