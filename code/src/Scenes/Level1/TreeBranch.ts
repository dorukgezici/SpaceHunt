import * as ex from "excalibur";


export default class TreeBranch extends ex.Actor {

	static readonly branchWidth = 20;
	static readonly branchLength = 170;

	constructor(x: number, y: number) {
		super(x, y, TreeBranch.branchLength, TreeBranch.branchWidth, ex.Color.Green);
		this.collisionType = ex.CollisionType.Fixed;
	}

}
