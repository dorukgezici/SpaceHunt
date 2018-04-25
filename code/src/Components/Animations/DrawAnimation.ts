import { Actor, IDrawable, Vector } from "excalibur";
import { Class } from "../../Class";
import { IGameEventValue } from "../../GameBootstrap";

export interface IDrawableSet {
	/**
	 * Draws the part onto the canvas.
	 * @param ctx Rendering context.
	 * @param delta Time in milliseconds from the start of animation taking place.
	 */
	draw(ctx: CanvasRenderingContext2D, delta: number, position?: Vector): void;
}

export interface IStateSet<T extends string> {
	changeState(state: T, delta?: number): void;
}

export interface IDrawSet<T extends string> extends IDrawableSet, IStateSet<T> { }
export type IDrawSetProvider<T extends string> = () => IDrawSet<T>;

export class DrawAnimation<T extends string> implements IStateSet<T> {

	private timestamp: number = performance.now();
	get delta() {
		return performance.now() - this.timestamp;
	}

	constructor(
		public readonly drawSets: ReadonlyArray<IDrawSet<T>>
	) { }

	updateDelta() {
		this.timestamp = performance.now();
	}

	draw(ctx: CanvasRenderingContext2D, position?: Vector) {
		performance.now();
		this.drawSets.forEach(t => t.draw(ctx, this.delta, position));
	}

	changeState(state: T, delta: number = this.delta) {
		console.log("Animation state changed:", state);
		this.drawSets.forEach(t => t.changeState(state, delta));
	}

}
