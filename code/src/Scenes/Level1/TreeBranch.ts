import * as ex from "excalibur";
import resources from "../../Resources";


export default class TreeBranch extends ex.Actor {
	static readonly BRANCH_WIDTH = 20;
	static readonly BRANCH_LENGTH = 170;
	static readonly IMAGE = resources.level1.tree.asSprite();

	constructor(x: number, y: number) {
		super(x, y, TreeBranch.BRANCH_LENGTH, TreeBranch.BRANCH_WIDTH, ex.Color.Green);
		this.collisionType = ex.CollisionType.Fixed;
	}

	draw(ctx: CanvasRenderingContext2D, delta: number) {
		TreeBranch.IMAGE.draw(ctx, this.getLeft(), this.getTop() - 10);
	}
}
