import { Vector } from "excalibur";
import { IPlayerAnimations, animationProviders } from "../../Components/Animations/MichelsonAnimation";
import { IKeyInterface } from "./NameEnquiry";
import PlayerAnimationCanvas from "./PlayerAnimationCanvas";

type IPlayerState = "idle" | "jump" | "walk" | "duck";
type IPlayerDir = "left" | "right";

export default class PlayerAnimationMovementCanvas extends PlayerAnimationCanvas {

	private listening = false;
	public get isListening() { return this.listening; }
	private dir: IPlayerDir = "right";
	private state: IPlayerState = "idle";
	private keyStates = {
		down: false,
		up: false,
		left: false,
		right: false
	};

	constructor(
		public readonly canvas: HTMLCanvasElement,
		public keys: IKeyInterface,
		public location?: Vector
	) {
		super(canvas, location);
		this.drawSets = animationProviders.map(t => t());
		this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
	}

	private updateState(state: IPlayerState = this.state, dir: IPlayerDir = this.dir) {
		if (state !== this.state || dir !== this.dir) {
			this.state = state;
			this.dir = dir;
			super.changeState(`${state}-${dir}` as IPlayerAnimations)
		}
	}

	private updateKey(k: number, pressed: boolean) {
		const { keyStates } = this;
		const key = Object.entries(this.keys).find(t => t[1] === k);
		if (!key) return;
		const keyName = key[0] as keyof IKeyInterface;
		keyStates[keyName] = pressed;

		let state: IPlayerState = this.state;
		let dir: IPlayerDir = this.dir;
		if (keyStates.right && !keyStates.left)
			dir = "right";
		else if (keyStates.left && !keyStates.right)
			dir = "left";
		if (keyStates.up)
			state = "jump";
		else if (keyStates.down)
			state = "duck";
		else if (keyStates.right || keyStates.left)
			state = "walk";
		else
			state = "idle";

		this.updateState(state, dir);
	}

	private onKeyDown = (e: KeyboardEvent) => {
		this.updateKey(e.keyCode, true);
	}

	private onKeyUp = (e: KeyboardEvent) => {
		this.updateKey(e.keyCode, false);
	}

	startListening() {
		if (this.listening) return;
		document.addEventListener("keydown", this.onKeyDown);
		document.addEventListener("keyup", this.onKeyUp);
		this.listening = true;
	}

	stopListening() {
		if (!this.listening) return;
		document.removeEventListener("keydown", this.onKeyDown);
		document.removeEventListener("keyup", this.onKeyUp);
		this.updateState("idle");
		this.listening = false;
	}

}
