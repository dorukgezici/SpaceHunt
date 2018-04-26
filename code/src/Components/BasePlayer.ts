import * as ex from "excalibur";
import { modelSize } from "./Animations/MichaelsonParts";
import { IGameBootstrapState } from "../GameBootstrap";

export default abstract class BasePlayer extends ex.Actor {

	static readonly size = modelSize;
	public state: IGameBootstrapState;

	constructor(x: number, y: number, state: IGameBootstrapState) {
		super(x, y, BasePlayer.size.w, BasePlayer.size.h, ex.Color.Violet);
		this.collisionArea.body.useBoxCollision();
		this.collisionType = ex.CollisionType.Active;
		this.state = state;
	}

}
