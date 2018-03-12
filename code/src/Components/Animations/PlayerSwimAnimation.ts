import { ITransformDrawSetProviderData, createTransformDrawSetProvider, TransformDrawAnimationFactory } from "./DrawAnimationFactory";
import { cubicEasing } from "./TransformDrawPart";
import { IDrawSetProvider } from "./DrawAnimation";
import { PlainDrawSet } from "./PlainDrawSet";

export type IPlayerSwimAnimations = "slow" | "normal" | "fast";
type IPA = IPlayerSwimAnimations;

const baseArmTransform = {
	translateX: 15
};

const rightArmData: ITransformDrawSetProviderData<IPA> = {
	states: {
		normal: {
			duration: 500,
			start: { rotate: -0.5, ...baseArmTransform },
			end: { rotate: 0.5, ...baseArmTransform },
			transitionDuration: 200
		},
		fast: {
			duration: 300,
			start: { rotate: -0.5, ...baseArmTransform },
			end: { rotate: 0.5, ...baseArmTransform },
			transitionDuration: 200
		},
		slow: {
			duration: 700,
			start: { rotate: -0.5, ...baseArmTransform },
			end: { rotate: 0.5, ...baseArmTransform },
			transitionDuration: 200
		},
	},
	selectedState: "normal",
	drawBase: (ctx) => {
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#efb9a5";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(30, 0);
		ctx.stroke();
	}
};

const leftArmData: ITransformDrawSetProviderData<IPA> = {
	states: {
		normal: {
			duration: 500,
			start: { rotate: 0.5, ...baseArmTransform },
			end: { rotate: -0.5, ...baseArmTransform },
			transitionDuration: 200
		},
		fast: {
			duration: 300,
			start: { rotate: 0.5, ...baseArmTransform },
			end: { rotate: -0.5, ...baseArmTransform },
			transitionDuration: 200
		},
		slow: {
			duration: 700,
			start: { rotate: 0.5, ...baseArmTransform },
			end: { rotate: -0.5, ...baseArmTransform },
			transitionDuration: 200
		},
	},
	selectedState: "normal",
	drawBase: (ctx) => {
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#efb9a5";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(30, 0);
		ctx.stroke();
	}
};

const baseLegTransform = {
	translateX: -20
};

const rightLegData: ITransformDrawSetProviderData<IPA> = {
	states: {
		normal: {
			duration: 500,
			start: { rotate: -0.3, ...baseLegTransform },
			end: { rotate: 0.3, ...baseLegTransform },
			transitionDuration: 200
		},
		fast: {
			duration: 300,
			start: { rotate: -0.3, ...baseLegTransform },
			end: { rotate: 0.3, ...baseLegTransform },
			transitionDuration: 200
		},
		slow: {
			duration: 700,
			start: { rotate: -0.3, ...baseLegTransform },
			end: { rotate: 0.3, ...baseLegTransform },
			transitionDuration: 200
		},
	},
	selectedState: "normal",
	drawBase: (ctx) => {
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#efb9a5";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(-30, 0);
		ctx.stroke();
	}
};

const leftLegData: ITransformDrawSetProviderData<IPA> = {
	states: {
		normal: {
			duration: 500,
			start: { rotate: 0.3, ...baseLegTransform },
			end: { rotate: -0.3, ...baseLegTransform },
			transitionDuration: 200
		},
		fast: {
			duration: 300,
			start: { rotate: 0.3, ...baseLegTransform },
			end: { rotate: -0.3, ...baseLegTransform },
			transitionDuration: 200
		},
		slow: {
			duration: 700,
			start: { rotate: 0.3, ...baseLegTransform },
			end: { rotate: -0.3, ...baseLegTransform },
			transitionDuration: 200
		},
	},
	selectedState: "normal",
	drawBase: (ctx) => {
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#efb9a5";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(-30, 0);
		ctx.stroke();
	}
};

const torso = new PlainDrawSet<IPA>(function (ctx, delta, position, state) {
	if (!position) return;
	const { x, y } = position;

	ctx.save();

	ctx.translate(x, y);

	ctx.fillStyle = "#ba402e";
	ctx.fillRect(-20, -10, 40, 20);

	ctx.restore();
}, "normal");

const deg90 = Math.PI / 2;

const baseHeadTransform = {
	translateX: 22
};

const headData: ITransformDrawSetProviderData<IPA> = {
	states: {
		normal: {
			duration: 500,
			start: { rotate: deg90 + 0.2, ...baseHeadTransform },
			end: { rotate: deg90 - 0.2, ...baseHeadTransform },
			transitionDuration: 200
		},
		fast: {
			duration: 300,
			start: { rotate: deg90 + 0.2, ...baseHeadTransform },
			end: { rotate: deg90 - 0.2, ...baseHeadTransform },
			transitionDuration: 200
		},
		slow: {
			duration: 700,
			start: { rotate: deg90 + 0.2, ...baseHeadTransform },
			end: { rotate: deg90 - 0.2, ...baseHeadTransform },
			transitionDuration: 200
		},
	},
	selectedState: "normal",
	drawBase: (ctx) => {
		ctx.fillStyle = "#efb9a5";
		ctx.beginPath();
		ctx.arc(0, 0, 20, Math.PI, 0);
		ctx.fill();

		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(7, -6, 2.5, 0, 2 * Math.PI);
		ctx.arc(-7, -6, 2.5, 0, 2 * Math.PI);
		ctx.fill();
	}
};

const head = new PlainDrawSet<IPA>(function (ctx, delta, position, state) {
	if (!position) return;
	const { x, y } = position;

	ctx.save();



	ctx.restore();
}, "normal");

const animationProviders: IDrawSetProvider<IPA>[] = [
	createTransformDrawSetProvider(leftLegData),
	createTransformDrawSetProvider(leftArmData),
	() => torso,
	createTransformDrawSetProvider(headData),
	createTransformDrawSetProvider(rightLegData),
	createTransformDrawSetProvider(rightArmData),
];

export const playerSwimAnimationFactory = new TransformDrawAnimationFactory(animationProviders);
