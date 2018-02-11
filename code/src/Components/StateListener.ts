import { GameEvent } from "excalibur";
import { Class } from "../Class";

interface IStaticStateChangedEvent<T, K extends keyof T = keyof T> extends GameEvent<T> {
	key: K;
	oldValue: T[K];
	newValue: T[K];
}

type IStateChangedEvent<T, K extends keyof IStateListenerEvents<T> = keyof IStateListenerEvents<T>> = IStateListenerEvents<T>[K];

type IStateEvents<T> = {
	[K in keyof T]: IStaticStateChangedEvent<T, K>;
};

interface IAdditionalHandlers<T> {
	"$all": IStaticStateChangedEvent<T, keyof T>;
}

export type IStateListenerEvents<T> = IStateEvents<T> & IAdditionalHandlers<T>;

export default class StateListener<T> extends Class<IStateListenerEvents<T>> {

	private internalState: T;

	constructor(initialState: T) {
		super();
		this.internalState = initialState;
	}

	private emitEvent(e: IStateChangedEvent<T>) {
		this.emit(e.key as any, e as any);
		this.emit("$all", e as any);
	}

	createListenableObject(): T {
		const state = {} as T;
		Object.keys(this.internalState).forEach(t => {
			const key = t as keyof T;
			Object.defineProperty(state, key, {
				get: () => this.internalState[key],
				set: (newValue: T[keyof T]) => {
					const oldValue = this.internalState[key];
					this.internalState[key] = newValue;
					this.emitEvent({
						target: state,
						oldValue,
						newValue,
						key
					});
				},
				enumerable: true,
				configurable: false,
			});
		});
		return state;
	}

}
