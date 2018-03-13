import { IDrawableBase, IDrawSet } from "./DrawAnimation";
import { ITransformation, IEasing, TransformDrawPart } from "./TransformDrawPart";
import { Vector } from "Index";

export interface ITransformDrawState {
	enabled?: boolean;
	start: ITransformation;
	end: ITransformation;
	duration?: number;
	transitionDuration?: number;
	easing?: IEasing;
	transitionEasing?: IEasing;
}

export type ITransformDrawStateCollection<T extends string> = {
	[K in T]?: ITransformDrawState
};

export type ITransformDrawPartProvider = () => TransformDrawPart;

export class TransformDrawSet<T extends string> implements IDrawableBase, IDrawSet<T> {

	public readonly transformDrawPart: TransformDrawPart;
	private _selectedState: T;
	private _enabled: boolean = false;
	get selectedState() {
		return this._selectedState;
	}

	constructor(
		private readonly states: ITransformDrawStateCollection<T>,
		selectedState: T,
		transformDrawPartProvider: ITransformDrawPartProvider
	) {
		this._selectedState = selectedState;
		const state = states[selectedState];
		this._enabled = state && state.enabled !== false;
		this.transformDrawPart = transformDrawPartProvider();
	}

	changeState(state: ITransformDrawState, delta: number): void;
	changeState(state: T, delta: number): void;
	changeState(state: T | ITransformDrawState | undefined, delta: number): void {
		if (typeof state === "string")
			state = this.states[state];
		state = state as ITransformDrawState;

		const wasEnabled = this._enabled;
		this._enabled = !!(state && state.enabled !== false);

		if (this._enabled) {
			if (state.transitionDuration && wasEnabled) {
				this.transformDrawPart.makeTransition(
					state.start,
					state.end,
					delta,
					state.transitionDuration,
					state.transitionEasing
				);
			} else {
				this.transformDrawPart.startTransformation = state.start;
				this.transformDrawPart.endTransformation = state.end;
			}

			if (state.easing)
				this.transformDrawPart.easing = state.easing;
			if (state.duration)
				this.transformDrawPart.duration = state.duration;
		}
	}

	draw(ctx: CanvasRenderingContext2D, delta: number, position?: Vector) {
		if (this._enabled)
			this.transformDrawPart.draw(ctx, delta, position);
	}

}
