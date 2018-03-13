import { Vector, IDrawable } from "excalibur";
import { IDrawableBase } from "./DrawAnimation";

export interface ITransformation {
	rotate?: number;
	translateX?: number;
	translateY?: number;
	scaleX?: number;
	scaleY?: number;
}

export type IDrawBase = (this: TransformDrawPart, ctx: CanvasRenderingContext2D, path: number, position: Vector | undefined, delta: number, transformation: ITransformation) => void;

/** 
 * Represents animation easing.
 * @param {number} delta A number from interval [0, 1].
 * @returns {number} A number from interval [0, 1] (can exceed bounds).
 */
export type IEasing = (delta: number) => number;
export const linearEasing: IEasing = delta => delta;
export const cubicEasing: IEasing = delta => delta ** 3;

export class TransformDrawPart implements IDrawableBase {

	protected tmpDuration = 0;
	protected tmpEasing: IEasing | null = null;
	protected tmpTransformation?: ITransformation | null = null;
	protected timestamp = 0;

	constructor(
		public startTransformation: ITransformation,
		public endTransformation: ITransformation,
		public duration: number,
		public easing?: IEasing,
		public anchor?: Vector
	) { }

	private static getTransformValue(start: number | undefined, end: number | undefined, path: number): number | undefined {
		if (typeof start !== "number" || typeof end !== "number")
			return;
		return (end - start) * path + start;
	}

	/**
	 * Number from interval [0, 1] indicating state of the animation.
	 * @param delta Milliseconds since the animation has started.
	 */
	getPath(delta: number) {
		const { tmpDuration, duration, timestamp } = this;

		let d = tmpDuration || duration;
		if (tmpDuration && (delta > timestamp + tmpDuration)) {
			this.clearTmp();
			d = duration;
		}

		const path = (d - Math.abs((delta - this.timestamp) % (2 * d) - d)) / d;

		if (this.tmpEasing)
			return this.tmpEasing(path);
		else if (this.easing)
			return this.easing(path);
		return path;
	}

	/**
	 * Gets transformation of the two given objects.
	 * @param start Starting transformation.
	 * @param end Ending transformation.
	 * @param path Number from interval [0, 1] indicating state of the animation.
	 */
	static getTransformation(start: ITransformation, end: ITransformation, path: number): ITransformation {
		const rotate = TransformDrawPart.getTransformValue(start.rotate, end.rotate, path);
		const scaleX = TransformDrawPart.getTransformValue(start.scaleX, end.scaleX, path);
		const scaleY = TransformDrawPart.getTransformValue(start.scaleY, end.scaleY, path);
		const translateX = TransformDrawPart.getTransformValue(start.translateX, end.translateX, path);
		const translateY = TransformDrawPart.getTransformValue(start.translateY, end.translateY, path);

		return {
			translateX,
			translateY,
			scaleX,
			scaleY,
			rotate
		};
	}

	/**
	 * Gets current transformation based on given path.
	 * @param path Number from interval [0, 1] indicating state of the animation.
	 */
	getTransformation(path: number) {
		let t = TransformDrawPart.getTransformation(this.startTransformation, this.endTransformation, path);
		if (this.tmpTransformation)
			t = TransformDrawPart.getTransformation(this.tmpTransformation, t, path);
		return t;
	}

	resetDelta(delta: number) {
		this.timestamp = delta;
	}

	makeTransition(startTransformation: ITransformation, endTransformation: ITransformation, delta: number, duration?: number, easing?: IEasing) {
		this.tmpTransformation = this.getTransformation(this.getPath(delta));
		this.tmpDuration = duration || 0;
		this.tmpEasing = easing || null;
		this.resetDelta(delta);

		this.startTransformation = startTransformation;
		this.endTransformation = endTransformation;
	}

	protected clearTmp() {
		this.tmpDuration = 0;
		this.tmpEasing = null;
		this.tmpTransformation = null;
	}

	/**
	 * Should draw the base shape at coordinate system origin (0, 0).
	 * @param ctx Canvas drawing context.
	 * @param path Number from interval [0, 1] indicating state of the animation.
	 * @param delta Milliseconds since the animation has started.
	 * @param transformation Transformation already applied.
	 */
	drawBase(ctx: CanvasRenderingContext2D, path: number, position: Vector | undefined, delta: number, transformation: ITransformation) {
		ctx.fillStyle = "red";
		ctx.fillRect(0, 0, 50, 50);
	}

	/**
	 * Handles transformations and calls `drawBase()`.
	 * @param ctx Canvas drawing context.
	 * @param delta Milliseconds since the animation has started.
	 */
	draw(ctx: CanvasRenderingContext2D, delta: number, position?: Vector) {
		const path = this.getPath(delta);
		const t = this.getTransformation(path);

		ctx.save();

		if (position || this.anchor || t.translateX || t.translateY) {
			let x = t.translateX || 0;
			let y = t.translateY || 0;
			if (this.anchor) {
				x += this.anchor.x;
				y += this.anchor.y;
			}
			if (position) {
				x += position.x;
				y += position.y;
			}
			ctx.translate(x, y);
		}

		if (t.rotate)
			ctx.rotate(t.rotate);

		if (typeof t.scaleX === "number" || typeof t.scaleY === "number")
			ctx.scale(t.scaleX || 1, t.scaleY || 1);

		this.drawBase(ctx, path, position, delta, t);

		ctx.restore();
	}

}
