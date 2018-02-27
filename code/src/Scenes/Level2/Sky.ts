import * as ex from "excalibur";
import Player from "./Player";

export default class Sky extends ex.Actor {

	readonly brickTextureUrl: string = require("./cloud.jpg");
	static readonly width: number = 5000;

	brickTexture: ex.Texture;
	resources: ex.ILoadable[];

	playerCollision: boolean = false;
	collidedPlayer: Player;
	playerTrapped: boolean = false;

	constructor(x: number, y: number) {
		super(x, y, Sky.width, 50, ex.Color.Gray);
		this.collisionType = ex.CollisionType.Fixed;
		this.color = ex.Color.fromHex("#59C9FF");
		this.resources = [];
		this.brickTexture = new ex.Texture(this.brickTextureUrl);
		this.resources.push(this.brickTexture);
		this.on('precollision', this.onPrecollision);
	}

	onPrecollision(ev: any) {
		//console.log("precollision event raised");
		//trap player if collided
		if (!this.playerCollision && ev.other.constructor.name == "Player" && !ev.other.trapped) {
			console.log("1st-time PLAYER precollision event raised (Level2 - Bubble - onPrecollision())");
			this.playerCollision = true;
			this.playerTrapped = true;
			this.collidedPlayer = ev.other;
			this.collidedPlayer.trapped = true;
			this.collidedPlayer.vel = this.vel;
			//TODO: correct player position & animation
		}
		//un-trap player if reaching sky
		else if (this.playerTrapped && ev.other.constructor.name == "Sky") {
			this.playerTrapped = false;
			this.collidedPlayer.trapped = false;
		}
		//kill bubble when reaching sky
		if (ev.other.constructor.name == "Sky") {
			this.kill();
		}
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		super.draw(ctx, delta);
		let sprite = this.brickTexture.asSprite();
		let offset = 0;
		let rndm = new ex.Random(47);

		while(offset < Sky.width) {
			sprite.draw(ctx, this.getLeft() + offset, this.getTop());
			offset += rndm.integer(43, 250);//70;
		}
	}

}
