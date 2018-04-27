import { Vector } from "Index";
import { IDrawSet, IDrawableSet } from "./DrawAnimation";
import { IEasing, ITransformation, TransformDrawPart } from "./TransformDrawPart";

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

export type ITransformDrawPartProvider<T extends string> = () => TransformDrawPart<T>;

export class TransformDrawSet<T extends string> implements IDrawableSet, IDrawSet<T> {

	private _selectedState: T;
	private _enabled: boolean = false;
	get selectedState() {
		return this._selectedState;
	}

	constructor(
		private readonly states: ITransformDrawStateCollection<T>,
		selectedState: T,
		public readonly transformDrawPart: TransformDrawPart<T>
	) {
		this._selectedState = selectedState;
		const state = states[selectedState];
		this._enabled = state && state.enabled !== false;
	}

	changeState(state: T, delta: number): void {
		if (state === this._selectedState)
			return;
		this._selectedState = state;
		const st = this.states[state] as ITransformDrawState;

		const wasEnabled = this._enabled;
		this._enabled = !!(st && st.enabled !== false);

		if (this._enabled) {
			if (st.transitionDuration && wasEnabled) {
				this.transformDrawPart.makeTransition(
					st.start,
					st.end,
					delta,
					st.transitionDuration,
					st.transitionEasing
				);
			} else {
				this.transformDrawPart.startTransformation = st.start;
				this.transformDrawPart.endTransformation = st.end;
			}

			if (st.easing)
				this.transformDrawPart.easing = st.easing;
			if (st.duration)
				this.transformDrawPart.duration = st.duration;
		}
	}

	draw(ctx: CanvasRenderingContext2D, delta: number, position?: Vector) {
		if (this._enabled)
			this.transformDrawPart.draw(ctx, delta, position, this._selectedState);
	}

}
