import * as ex from "excalibur";
import Vine from "../Level1/Vine";
import { modelSize } from "../../Components/Animations/Models/PrincessParts";
import { princessAnimationFactory } from "../../Components/Animations/Models/PrincessAnimation";
import BasePlayer from "../../Components/BasePlayer";

export default class Princess extends ex.Actor {

	private vine: Vine;
	private vLast: Vine;
	static size = modelSize;

	constructor(vine: Vine) {
		super(0, 0, 50, 50, ex.Color.Chartreuse);
		this.anchor.setTo(0.5, 0.5);
		this.vine = vine;
		this.vLast = this.vine.getAllParts()[this.vine.getAllParts().length - 1];
		this.collisionType = ex.CollisionType.Passive;
		princessAnimationFactory.attachTo(this);
		this.on("precollision", this.onPrecollision);
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
		this.x = this.vLast.x;
		this.y = this.vLast.y;
		this.rotation = this.vLast.rotation;
	}

	onPrecollision(ev: any) {
		if (ev.other instanceof BasePlayer) {
			let player: BasePlayer = ev.other;
			player.win("you won by saving the princess");
		}
	}

}
