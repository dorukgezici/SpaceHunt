import { DrawAnimation } from "./DrawAnimation";

export default class AnimationStateHandler<T extends string> {

	private _state: T;
	private _animation: DrawAnimation<T> | undefined;
	private _intermediateState: T;
	private changeMode = false;

	private get state() {
		return this._state;
	}

	private get intermediateState() {
		return this._intermediateState;
	}

	private get animation() {
		return this._animation;
	}

	private set animation(animation: DrawAnimation<T> | unset) {
		this._animation = animation || undefined;
		if (animation)
			animation.changeState(this._state);
	}

	constructor(
		defaultState: T,
		animation?: DrawAnimation<T>
	) {
		this._state = defaultState;
		this._intermediateState = defaultState;
		this._animation = animation;
	}

	enableChangeMode() {
		this.changeMode = true;
	}

	changeState(state: T) {
		if (this.changeMode)
			this._intermediateState = state;
		else
			this.applyState(state);
	}

	apply() {
		if (this.changeMode) {
			this.changeMode = false;
			this.applyState(this._intermediateState);
		}
	}

	private applyState(state: T) {
		if (this._state === state)
			return;
		this._state = state;
		if (this.animation)
			this.animation.changeState(state);
	}

}
