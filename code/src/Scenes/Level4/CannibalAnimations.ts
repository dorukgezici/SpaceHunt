import { ITransformDrawSetProviderData, createTransformDrawSetProvider, TransformDrawAnimationFactory } from "../../Components/Animations/DrawAnimationFactory";
import { cubicEasing } from "../../Components/Animations/TransformDrawPart";
import { IDrawSetProvider } from "../../Components/Animations/DrawAnimation";
import { PlainDrawSet } from "../../Components/Animations/PlainDrawSet";
import { ITransformDrawState } from "../../Components/Animations/TransformDrawSet";

export type ICannibalAnimations = "walk-left" | "walk-right";

const drawBase = (ctx: CanvasRenderingContext2D) => {
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.lineWidth = 10;
	ctx.strokeStyle = "red";
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

const states: ITransformDrawSetProviderData<ICannibalAnimations> = {
	drawBase,
	selectedState: "walk-right",
	states: {
		"walk-left": createState(left),
		"walk-right": createState(right),
	}
};

export const cannibalAnimationFactory = new TransformDrawAnimationFactory([
	createTransformDrawSetProvider(states)
]);
