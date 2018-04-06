import { ITransformDrawSetProviderData, createTransformDrawSetProvider, TransformDrawAnimationFactory } from "../../Components/Animations/DrawAnimationFactory";
import { cubicEasing } from "../../Components/Animations/TransformDrawPart";
import { IDrawSetProvider } from "../../Components/Animations/DrawAnimation";
import { PlainDrawSet } from "../../Components/Animations/PlainDrawSet";
import { ITransformDrawState } from "../../Components/Animations/TransformDrawSet";

export type IPlayerAnimations = "slow" | "default" | "fast" | "jump" | "duck";
type IPA = IPlayerAnimations;

const drawBase = (ctx: CanvasRenderingContext2D) => {
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.lineWidth = 10;
	ctx.moveTo(0, -20);
	ctx.lineTo(0, 20);
	ctx.moveTo(15, 5);
	ctx.lineTo(0, 20);
	ctx.moveTo(-15, 5);
	ctx.lineTo(0, 20);
	ctx.stroke();
};

const right = -Math.PI / 2;
const left = Math.PI / 2;
const up = -Math.PI;
const down = 0;

const createState = (angle: number, scale = 1): ITransformDrawState => ({
	start: { rotate: angle - 0.1, scaleX: scale, scaleY: scale, translateY: -20 },
	end: { rotate: angle + 0.1, scaleX: scale, scaleY: scale, translateY: -20 },
	duration: 1000,
	transitionDuration: 200
});

const states: ITransformDrawSetProviderData<IPA> = {
	drawBase,
	selectedState: "default",
	states: {
		default: createState(right),
		slow: createState(right, 0.8),
		fast: createState(right, 1.2),
		jump: createState(up),
		duck: createState(0)
	}
};

export const playerAnimationFactory = new TransformDrawAnimationFactory([
	createTransformDrawSetProvider(states)
]);
