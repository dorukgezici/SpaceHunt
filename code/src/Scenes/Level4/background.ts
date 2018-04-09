import * as ex from "excalibur";
import Player from "./Player";
import resources from "../../Resources";

/**
 * Water and sky background moves is not so long to fill the whole level.
 * So it moves relatively to the player and simulates the feeling of perspective.
 */
export default class Background extends ex.Actor {

	static readonly image: ex.Sprite = resources.level4bg.asSprite();
	static readonly bgWidth: number = 1190;
	static readonly bgHeight: number = 604;
	static readonly maxYMovement = 10;
	static readonly ySpeed: number = 0.001;

	bgToLvlRatio: number;
	player: Player;
	minLeft: number;
	lvlLength: number;
	time: number = 0;

	constructor(x: number, y: number, minLeft: number, minRight: number, levelLength: number, player: Player) {
		super(x, y, Background.bgWidth, Background.bgHeight);
		this.player = player;
		this.minLeft = minLeft;
		this.lvlLength = levelLength;
		this.anchor.setTo(0, 0);
		this.bgToLvlRatio = (Background.bgWidth - minLeft - minRight) / (levelLength - minRight);
	}

	update(engine: ex.Engine, delta: number) {
		this.time += delta;
		let bgToPlayerPos = this.bgToLvlRatio * this.player.x;
		this.x = this.player.x - bgToPlayerPos - this.minLeft;
		// this.y = - Math.abs(Math.sin(this.time * Background.ySpeed)) * Background.maxYMovement;
		this.x = this.x < 0 ? 0 : this.x;
		this.x = this.x + Background.bgWidth > this.lvlLength ? this.lvlLength - Background.bgWidth : this.x;
	}

	draw(ctx: CanvasRenderingContext2D, delta: number) {
		Background.image.draw(ctx, this.getLeft(), this.getTop());
	}
}
