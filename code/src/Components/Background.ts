import * as ex from "excalibur";

/**
 * Dynamic background which moves with the player but on slower pace
 * creating sort of a 2.5D effect
 */
export default class Background extends ex.Actor {
	static readonly bgWidth: number = 1600;
	static readonly bgHeight: number = 600;
	static readonly maxYMovement = 10;

	ySpeed?: number;

	bgToLvlRatio: number;
	image: ex.Sprite;
	lvlLength: number;
	minLeft: number;
	player: ex.Actor;
	time: number = 0;

	constructor(image: ex.Sprite, player: ex.Actor, x: number, y: number, minLeft: number, minRight: number, lvlLen: number, ySpeed?: number) {
		super(x, y, Background.bgWidth, Background.bgHeight);

		this.anchor.setTo(0, 0);
		this.bgToLvlRatio = (Background.bgWidth - minLeft - minRight) / (lvlLen - minLeft - minRight);
		this.image = image;
		this.lvlLength = lvlLen;
		this.minLeft = minLeft;
		this.player = player;

		if (ySpeed) this.ySpeed = ySpeed;
	}

	update(engine: ex.Engine, delta: number) {
		this.time += delta;
		let bgToPlayerPos = - this.bgToLvlRatio * (this.player.getWorldPos().x - 400);
		this.x = this.player.getWorldPos().x + bgToPlayerPos - this.minLeft;
		this.x = this.x < 0 ? 0 : this.x;
		this.x = this.x + Background.bgWidth > this.lvlLength ? this.lvlLength - Background.bgWidth : this.x;

		if (this.ySpeed) this.y = - Math.abs(Math.sin(this.time * this.ySpeed)) * Background.maxYMovement;
	}

	draw(ctx: CanvasRenderingContext2D, delta: number) {
		this.image.draw(ctx, this.getLeft(), this.getTop());
	}
}
