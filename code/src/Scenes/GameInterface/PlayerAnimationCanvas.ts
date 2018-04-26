import { IPlayerAnimations, animationProviders } from "../../Components/Animations/MichelsonAnimation";
import { IDrawSet } from "../../Components/Animations/DrawAnimation";
import { Vector } from "excalibur";

export default class PlayerAnimationCanvas {

	protected drawSets: IDrawSet<IPlayerAnimations>[];
	protected context: CanvasRenderingContext2D;
	private animationFrame = NaN;

	constructor(
		public readonly canvas: HTMLCanvasElement,
		public location?: Vector
	) {
		this.drawSets = animationProviders.map(t => t());
		this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
	}

	changeState(state: IPlayerAnimations) {
		this.drawSets.forEach(t => t.changeState(state));
	}

	private draw(delta: number) {
		const { context, canvas, location } = this;
		context.clearRect(0, 0, canvas.width, canvas.height);
		this.drawSets.forEach(t =>
			t.draw(context, delta, location)
		);
	}

	start() {
		if (Number.isNaN(this.animationFrame)) {
			const loop = (delta: number) => {
				this.draw(delta);
				this.animationFrame = requestAnimationFrame(loop);
			};
			this.animationFrame = requestAnimationFrame(loop);
		}
	}

	stop() {
		if (!Number.isNaN(this.animationFrame)) {
			cancelAnimationFrame(this.animationFrame);
			this.animationFrame = NaN;
		}
	}

}
