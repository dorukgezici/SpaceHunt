import { Vector } from "Index";
import { IDrawSet, IDrawableSet } from "./DrawAnimation";

export type IDrawHandler<T extends string> = (
	this: PlainDrawSet<T>,
	ctx: CanvasRenderingContext2D,
	delta: number,
	position: Vector | undefined,
	state: T
) => void;

export class PlainDrawSet<T extends string> implements IDrawableSet, IDrawSet<T> {

	constructor(
		public drawHandler: IDrawHandler<T>,
		public currentState: T
	) { }

	changeState(state: T, delta: number): void {
		this.currentState = state;
	}

	draw(ctx: CanvasRenderingContext2D, delta: number, position?: Vector | undefined): void {
		this.drawHandler(ctx, delta, position, this.currentState);
	}

}
