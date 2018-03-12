import { ITransformDrawSetProviderData, createTransformDrawSetProvider, TransformDrawAnimationFactory } from "./DrawAnimationFactory";
import { cubicEasing } from "./TransformDrawPart";
import { IDrawSetProvider } from "./DrawAnimation";
import { PlainDrawSet } from "./PlainDrawSet";

export type IPlayerAnimations = "idle" | "walk" | "jump" | "duck";
type IPA = IPlayerAnimations;

const baseArmTransform = {
	translateY: -60
};

const rightArmData: ITransformDrawSetProviderData<IPA> = {
	states: {
		idle: {
			duration: 1000,
			start: { rotate: -0.1, ...baseArmTransform },
			end: { rotate: 0.1, ...baseArmTransform },
			transitionDuration: 200
		},
		jump: {
			duration: 800,
			start: { rotate: 2.2, translateX: -5, ...baseArmTransform },
			end: { rotate: 2.5, translateX: -5, ...baseArmTransform },
			transitionDuration: 100
		},
		walk: {
			duration: 400,
			start: { rotate: -0.3, ...baseArmTransform },
			end: { rotate: 0.3, ...baseArmTransform },
			transitionDuration: 200
		},
		duck: {
			duration: 1000,
			start: { rotate: -0.1, translateY: -20 },
			end: { rotate: 0.1, translateY: -20 },
			transitionDuration: 200
		}
	},
	selectedState: "idle",
	drawBase: (ctx) => {
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#efb9a5";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, 30);
		ctx.stroke();
	}
};

const leftArmData: ITransformDrawSetProviderData<IPA> = {
	states: {
		idle: {
			duration: 1000,
			start: { rotate: 0.1, ...baseArmTransform },
			end: { rotate: -0.1, ...baseArmTransform },
			transitionDuration: 200
		},
		jump: {
			duration: 800,
			start: { rotate: 1.9, translateX: -5, ...baseArmTransform },
			end: { rotate: 2.2, translateX: -5, ...baseArmTransform },
			transitionDuration: 100
		},
		walk: {
			duration: 400,
			start: { rotate: 0.3, ...baseArmTransform },
			end: { rotate: -0.3, ...baseArmTransform },
			transitionDuration: 200
		},
		duck: {
			duration: 1000,
			start: { rotate: 0.1, translateY: -20 },
			end: { rotate: -0.1, translateY: -20 },
			transitionDuration: 200
		}
	},
	selectedState: "idle",
	drawBase: (ctx) => {
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#efb9a5";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, 30);
		ctx.stroke();
	}
};

const baseLegTransform = {
	translateY: -35
};

const rightLegData: ITransformDrawSetProviderData<IPA> = {
	states: {
		idle: {
			duration: 1000,
			start: { rotate: 0, ...baseLegTransform },
			end: { rotate: 0, ...baseLegTransform },
			transitionDuration: 200
		},
		jump: {
			duration: 500,
			start: { rotate: -0.4, translateX: 5, ...baseLegTransform },
			end: { rotate: -0.55, translateX: 5, ...baseLegTransform },
			transitionDuration: 200
		},
		walk: {
			duration: 400,
			start: { rotate: 0.3, ...baseLegTransform },
			end: { rotate: -0.3, ...baseLegTransform },
			transitionDuration: 200
		},
		duck: {
			duration: 1000,
			start: { rotate: 0, translateY: 35, ...baseLegTransform },
			end: { rotate: 0, translateY: 35, ...baseLegTransform },
			transitionDuration: 200
		}
	},
	selectedState: "idle",
	drawBase: (ctx) => {
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#2e4aba";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, 30);
		ctx.stroke();
	}
};

const leftLegData: ITransformDrawSetProviderData<IPA> = {
	states: {
		idle: {
			duration: 1000,
			start: { rotate: 0, ...baseLegTransform },
			end: { rotate: 0, ...baseLegTransform },
			transitionDuration: 200
		},
		jump: {
			duration: 500,
			start: { rotate: -0.15, translateX: 5, ...baseLegTransform },
			end: { rotate: -0.3, translateX: 5, ...baseLegTransform },
			transitionDuration: 200
		},
		walk: {
			duration: 400,
			start: { rotate: -0.3, ...baseLegTransform },
			end: { rotate: 0.3, ...baseLegTransform },
			transitionDuration: 200
		},
		duck: {
			duration: 1000,
			start: { rotate: 0, ...baseLegTransform },
			end: { rotate: 0, ...baseLegTransform },
			transitionDuration: 200
		}
	},
	selectedState: "idle",
	drawBase: (ctx) => {
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#2e4aba";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, 30);
		ctx.stroke();
	}
};

const baseTorsoTransform = {
	translateY: -50
};

const torsoData: ITransformDrawSetProviderData<IPA> = {
	states: {
		idle: {
			duration: 1000,
			start: { rotate: 0, ...baseTorsoTransform },
			end: { rotate: 0, ...baseTorsoTransform },
			transitionDuration: 200
		},
		jump: {
			duration: 1000,
			start: { rotate: -0.2, ...baseTorsoTransform },
			end: { rotate: -0.2, ...baseTorsoTransform },
			transitionDuration: 200
		},
		walk: {
			duration: 1000,
			start: { rotate: 0, ...baseTorsoTransform },
			end: { rotate: 0, ...baseTorsoTransform },
			transitionDuration: 200
		},
		duck: {
			duration: 1000,
			start: { rotate: 0, translateY: -70 },
			end: { rotate: 0, translateY: -70 },
			transitionDuration: 200
		}
	},
	selectedState: "idle",
	drawBase: (ctx) => {
		ctx.fillStyle = "#ba402e";
		ctx.fillRect(-10, -20, 20, 40);
	}
};

const head = new PlainDrawSet<IPA>(function (ctx, delta, position, state) {
	if (!position) return;
	const { x, y } = position;

	ctx.save();

	ctx.translate(x, y - 70);

	ctx.fillStyle = "#efb9a5";
	ctx.beginPath();
	ctx.arc(0, 0, 20, Math.PI, 0);
	ctx.fill();

	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(7, -6, 2.5, 0, 2 * Math.PI);
	ctx.arc(-7, -6, 2.5, 0, 2 * Math.PI);
	ctx.fill();

	ctx.restore();
}, "idle");

const animationProviders: IDrawSetProvider<IPA>[] = [
	() => head,
	createTransformDrawSetProvider(leftLegData),
	createTransformDrawSetProvider(leftArmData),
	createTransformDrawSetProvider(torsoData),
	createTransformDrawSetProvider(rightLegData),
	createTransformDrawSetProvider(rightArmData),
];

export const playerAnimationFactory = new TransformDrawAnimationFactory(animationProviders);
