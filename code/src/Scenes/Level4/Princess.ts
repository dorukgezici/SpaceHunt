import * as ex from "excalibur";
import Vine from "../Level1/Vine";
import { modelSize } from "../../Components/Animations/PrincessParts";
import { princessAnimationFactory } from "../../Components/Animations/PrincessAnimation";

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
	}

	update(engine: ex.Engine, delta: number) {
		super.update(engine, delta);
		this.x = this.vLast.x;
		this.y = this.vLast.y;
		this.rotation = this.vLast.rotation;
	}

}
