import { ITransformDrawSetProviderData, createTransformDrawSetProvider, TransformDrawAnimationFactory } from "../../Components/Animations/DrawAnimationFactory";
import { cubicEasing } from "../../Components/Animations/TransformDrawPart";
import { IDrawSetProvider } from "../../Components/Animations/DrawAnimation";
import { PlainDrawSet } from "../../Components/Animations/PlainDrawSet";
import { ITransformDrawState } from "../../Components/Animations/TransformDrawSet";

export type IPlayerAnimations = "idle-left" | "idle-right" | "walk-left" | "walk-right" | "duck-left" | "duck-right" | "jump-left" | "jump-right";
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

const createState = (angle: number, scale = 1): ITransformDrawState => ({
	start: { rotate: angle - 0.1, scaleX: scale, scaleY: scale, translateY: -20 },
	end: { rotate: angle + 0.1, scaleX: scale, scaleY: scale, translateY: -20 },
	duration: 1000,
	transitionDuration: 200
});

const right = -Math.PI / 2;
const left = Math.PI / 2;
const upRight = -Math.PI * 3 / 4;
const upLeft = Math.PI * 3 / 4;
const downRight = -Math.PI / 4;
const downLeft = Math.PI / 4;

const states: ITransformDrawSetProviderData<IPA> = {
	drawBase,
	selectedState: "idle-right",
	states: {
		"idle-left": createState(left, 0.5),
		"idle-right": createState(right, 0.5),
		"walk-left": createState(left),
		"walk-right": createState(right),
		"duck-left": createState(downLeft),
		"duck-right": createState(downRight),
		"jump-left": createState(upLeft),
		"jump-right": createState(upRight),
	}
};

export const playerAnimationFactory = new TransformDrawAnimationFactory([
	createTransformDrawSetProvider(states)
]);
