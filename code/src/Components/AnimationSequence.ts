import { Class } from "../Class";

interface IEvents {
	done: AnimationSequence;
}

interface IAnimation {
	from: number;
	to: number;
	duration: number;
	callback: (value: number) => void;
}

type IPart = IAnimation | AnimationSequence | (() => void);
type ISequence = (IPart | IPart[] | number)[];

export class AnimationSequence extends Class<IEvents> {

	private index: number = -1; // not running if less than 0
	private awaiting = 0;
	private animationFrames: { [key: string]: number } = {};
	private timeoutId = NaN;
	private timestamp = 0;

	constructor(
		private states: ISequence
	) {
		super();
	}

	start() {
		if (this.index >= 0)
			return; // already running
		this.index = -1;
		this.performStep();
	}

	private performStep() {
		this.index++;
		if (this.index >= this.states.length) {
			this.done();
			return;
		}
		let step = this.states[this.index] as IPart | IPart[] | number;
		this.awaiting = 0;
		if (typeof step === "number") {
			this.doDelay(step);
		} else {
			for (let item of Array.isArray(step) ? step : [step]) {
				if (typeof item === "function") {
					const id = Symbol();
					this.awaiting++;
					this.animationFrames[id] = requestAnimationFrame(() => {
						delete this.animationFrames[id];
						(item as Function)();
						this.checkProgress();
					});
				} else if (item instanceof AnimationSequence) {
					this.awaiting++;
					item.start();
					item.once("done", () => this.checkProgress());
				} else {
					this.doAnimation(item);
				}
			}
		}
	}

	private doAnimation(animation: IAnimation) {
		this.awaiting++;
		const id = Symbol();
		const start = this.timestamp = performance.now();
		const end = start + animation.duration;
		const duration = end - start;
		const { from, to, callback } = animation;
		const diff = to - from;
		const render = (delta: number) => {
			if (delta > end) {
				callback(to);
				this.checkProgress();
				delete this.animationFrames[id];
			} else {
				const path = (delta - start) / duration;
				const value = path * diff + from;
				callback(value);
				this.animationFrames[id] = requestAnimationFrame(render);
			}
		};
		this.animationFrames[id] = requestAnimationFrame(render);
	}

	private checkProgress() {
		if (--this.awaiting <= 0)
			this.performStep();
	}

	private doDelay(delay: number) {
		this.timeoutId = setTimeout(() => {
			this.timeoutId = NaN;
			this.performStep();
		}, delay);
	}

	private done() {
		this.index = -1;
		this.emit("done", this);
	}

	cancel() {
		if (!Number.isNaN(this.timeoutId)) {
			clearTimeout(this.timeoutId);
			this.timeoutId = NaN;
		}
		for (let symbol in Object.getOwnPropertySymbols(this.animationFrames))
			cancelAnimationFrame(this.animationFrames[symbol]);
		this.animationFrames = {};
		this.done();
	}

}
