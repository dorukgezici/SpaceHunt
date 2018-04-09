import { ITransformDrawSetProviderData, createTransformDrawSetProvider, TransformDrawAnimationFactory } from "./DrawAnimationFactory";
import { cubicEasing, IDrawBase, IBeforeDraw } from "./TransformDrawPart";
import { IDrawSetProvider } from "./DrawAnimation";
import { PlainDrawSet } from "./PlainDrawSet";
import { Sprite } from "excalibur";
import { bodyParts, sprites, IBodyParts } from "./EslanParts";
import { ITransformDrawStateCollection } from "./TransformDrawSet";

export const eslanAnimationTypes = [
	"idle-right",
	"idle-left",
	"walk-right",
	"walk-left",
	"jump-right",
	"jump-left",
	"duck-right",
	"duck-left",
	"walk-fast-right",
	"walk-fast-left",
	"walk-slow-right",
	"walk-slow-left"
];

export type IEslanAnimations =
	| "idle-right"
	| "idle-left"
	| "walk-right"
	| "walk-left"
	| "jump-right"
	| "jump-left"
	| "duck-right"
	| "duck-left"
	| "walk-fast-right"
	| "walk-fast-left"
	| "walk-slow-right"
	| "walk-slow-left";

type IEABase =
	| "idle"
	| "walk"
	| "jump"
	| "duck"
	| "walk-fast"
	| "walk-slow";

const _states = {
	idleLeft: "idle-left",
	walkRight: "walk-right",
	walkLeft: "walk-left",
	jumpRight: "jump-right",
	jumpLeft: "jump-left",
	duckRight: "duck-right",
	duckLeft: "duck-left",
	walkFastRight: "walk-fast-right",
	walkFastLeft: "walk-fast-left",
	walkSlowRight: "walk-slow-right",
	walkSlowLeft: "walk-slow-left",
};

export const states = _states as ObjectValueMap<typeof _states, IEslanAnimations>;

type IEA = IEslanAnimations;
type ITData = ITransformDrawSetProviderData<IEA>;
interface IRLData extends ITData {
	baseStates?: ITransformDrawStateCollection<IEABase>;
}

const beforeDrawFactory = (bodyPartRight: IBodyParts, bodyPartLeft: IBodyParts): IBeforeDraw<IEslanAnimations> => {
	const bpr = bodyParts[bodyPartRight];
	const bpl = bodyParts[bodyPartLeft];

	return (ctx, _, position, state) => {
		if (state.includes("right"))
			return { translateX: bpr.modelLocation.x, translateY: bpr.modelLocation.y };
		else
			return { translateX: bpl.modelLocation.x, translateY: bpl.modelLocation.y };
	};
};

const drawBaseFactory = (bodyPartRight: IBodyParts, bodyPartLeft: IBodyParts): IDrawBase<IEslanAnimations> => {
	const spr = sprites[bodyPartRight];
	const spl = sprites[bodyPartLeft];
	const bpr = bodyParts[bodyPartRight].anchor;
	const bpl = bodyParts[bodyPartLeft].anchor;

	return (ctx, _, __, state) => {
		if (state.includes("right"))
			spr.draw(ctx, -bpr.x, -bpr.y);
		else
			spl.draw(ctx, -bpl.x, -bpl.y);
	};
};

const baseDataExtender = (irlData: IRLData) => {
	if (irlData.baseStates)
		Object.entries(irlData.baseStates).forEach(([key, state]) => {
			irlData.states[key + "-right" as IEA] = state;
			irlData.states[key + "-left" as IEA] = state;
		});
	return irlData as ITData;
};

const selectedState = "walk-right";

const armFront: IRLData = {
	selectedState,
	drawBase: drawBaseFactory("armRight", "armLeft"),
	beforeDraw: beforeDrawFactory("armRight", "armLeft"),
	states: {},
	baseStates: {
		idle: {
			duration: 1000,
			start: { rotate: -0.1 },
			end: { rotate: 0.1 },
			transitionDuration: 200
		},
		walk: {
			duration: 400,
			start: { rotate: -0.3 },
			end: { rotate: 0.3 },
			transitionDuration: 200
		},
		"walk-fast": {
			duration: 250,
			start: { rotate: -0.3 },
			end: { rotate: 0.3 },
			transitionDuration: 200
		},
		"walk-slow": {
			duration: 600,
			start: { rotate: -0.3 },
			end: { rotate: 0.3 },
			transitionDuration: 200
		},
		duck: {
			duration: 1000,
			start: { rotate: -0.1, translateY: 20 },
			end: { rotate: 0.1, translateY: 20 },
			transitionDuration: 200
		}
	}
};

const armBack: IRLData = {
	selectedState,
	drawBase: drawBaseFactory("armRight", "armLeft"),
	beforeDraw: beforeDrawFactory("armRight", "armLeft"),
	states: {
		"jump-right": {
			duration: 800,
			start: { rotate: -1.9, translateX: 5 },
			end: { rotate: -2.2, translateX: 5 },
			transitionDuration: 100
		},
		"jump-left": {
			duration: 800,
			start: { rotate: 1.9, translateX: -5 },
			end: { rotate: 2.2, translateX: -5 },
			transitionDuration: 100
		},
	},
	baseStates: {
		idle: {
			duration: 1000,
			start: { rotate: 0.1 },
			end: { rotate: -0.1 },
			transitionDuration: 200
		},
		walk: {
			duration: 400,
			start: { rotate: 0.3 },
			end: { rotate: -0.3 },
			transitionDuration: 200
		},
		"walk-fast": {
			duration: 250,
			start: { rotate: 0.3 },
			end: { rotate: -0.3 },
			transitionDuration: 200
		},
		"walk-slow": {
			duration: 600,
			start: { rotate: 0.3 },
			end: { rotate: -0.3 },
			transitionDuration: 200
		},
		duck: {
			duration: 1000,
			start: { rotate: 0.1, translateY: 20 },
			end: { rotate: -0.1, translateY: 20 },
			transitionDuration: 200
		}
	}
};

const legFront: IRLData = {
	selectedState,
	drawBase: drawBaseFactory("legRight", "legLeft"),
	beforeDraw: beforeDrawFactory("legRight", "legLeft"),
	states: {
		"jump-right": {
			duration: 500,
			start: { rotate: 0.4, translateX: -5 },
			end: { rotate: 0.55, translateX: -5 },
			transitionDuration: 200
		},
		"jump-left": {
			duration: 500,
			start: { rotate: -0.4, translateX: 5 },
			end: { rotate: -0.55, translateX: 5 },
			transitionDuration: 200
		}
	},
	baseStates: {
		idle: {
			transitionDuration: 200,
			start: {},
			end: {},
			duration: 1000
		},
		walk: {
			duration: 400,
			start: { rotate: 0.3 },
			end: { rotate: -0.3 },
			transitionDuration: 200
		},
		"walk-fast": {
			duration: 250,
			start: { rotate: 0.3 },
			end: { rotate: -0.3 },
			transitionDuration: 200
		},
		"walk-slow": {
			duration: 600,
			start: { rotate: 0.3 },
			end: { rotate: -0.3 },
			transitionDuration: 200
		},
		duck: {
			duration: 1000,
			start: { rotate: 0 },
			end: { rotate: 0 },
			transitionDuration: 200
		}
	}
};

const legBack: IRLData = {
	selectedState,
	drawBase: drawBaseFactory("legRight", "legLeft"),
	beforeDraw: beforeDrawFactory("legRight", "legLeft"),
	states: {
		"jump-right": {
			duration: 500,
			start: { rotate: -0.15, translateX: -5 },
			end: { rotate: -0.3, translateX: -5 },
			transitionDuration: 200
		},
		"jump-left": {
			duration: 500,
			start: { rotate: 0.15, translateX: 5 },
			end: { rotate: 0.3, translateX: 5 },
			transitionDuration: 200
		}
	},
	baseStates: {
		idle: {
			duration: 1000,
			start: { rotate: 0 },
			end: { rotate: 0 },
			transitionDuration: 200
		},
		walk: {
			duration: 400,
			start: { rotate: -0.3 },
			end: { rotate: 0.3 },
			transitionDuration: 200
		},
		"walk-fast": {
			duration: 250,
			start: { rotate: -0.3 },
			end: { rotate: 0.3 },
			transitionDuration: 200
		},
		"walk-slow": {
			duration: 600,
			start: { rotate: -0.3 },
			end: { rotate: 0.3 },
			transitionDuration: 200
		},
		duck: {
			duration: 1000,
			start: { rotate: 0 },
			end: { rotate: 0 },
			transitionDuration: 200
		}
	}
};

const torso: IRLData = {
	selectedState,
	beforeDraw: () => {
		return { translateX: bodyParts.torso.modelLocation.x, translateY: bodyParts.torso.modelLocation.y };
	},
	drawBase: (ctx) => {
		const { x, y } = bodyParts.torso.anchor;
		sprites.torso.draw(ctx, -x, -y);
	},
	states: {
		"jump-right": {
			duration: 1000,
			start: { rotate: 0.2 },
			end: { rotate: 0.2 },
			transitionDuration: 200
		},
		"jump-left": {
			start: { rotate: -0.2 },
			end: { rotate: -0.2 },
			transitionDuration: 200
		}
	},
	baseStates: {
		idle: {
			duration: 1000,
			start: { rotate: 0 },
			end: { rotate: 0 },
			transitionDuration: 200
		},
		walk: {
			duration: 1000,
			start: {},
			end: {},
			transitionDuration: 200
		},
		"walk-fast": {
			duration: 1000,
			start: {},
			end: {},
			transitionDuration: 200
		},
		"walk-slow": {
			duration: 1000,
			start: {},
			end: {},
			transitionDuration: 200
		},
		duck: {
			duration: 1000,
			start: { rotate: 0, translateY: 18 },
			end: { rotate: 0, translateY: 18 },
			transitionDuration: 200
		}
	}
};

const head: IRLData = {
	selectedState,
	beforeDraw: (_, __, ___, state) => {
		const { x: xr, y: yr } = bodyParts.headRight.modelLocation;
		const { x: xl, y: yl } = bodyParts.headLeft.modelLocation;
		if (state.includes("right"))
			return { translateX: xr, translateY: yr };
		else
			return { translateX: xl, translateY: yl };
	},
	drawBase: (ctx, _, __, state) => {
		const { x: xr, y: yr } = bodyParts.headRight.anchor;
		const { x: xl, y: yl } = bodyParts.headLeft.anchor;
		if (state.includes("right"))
			sprites.headRight.draw(ctx, -xr, -yr);
		else
			sprites.headLeft.draw(ctx, -xl, -yl);
	},
	states: {
		"jump-right": {
			duration: 500,
			start: { rotate: -0.1, translateX: 5 },
			end: { rotate: -0.1, translateX: 5 },
			transitionDuration: 200
		},
		"jump-left": {
			duration: 500,
			start: { rotate: 0.1, translateX: -5 },
			end: { rotate: 0.1, translateX: -5 },
			transitionDuration: 200
		}
	},
	baseStates: {
		idle: {
			duration: 1000,
			start: { rotate: 0.1 },
			end: { rotate: -0.1 },
			transitionDuration: 200
		},
		walk: {
			duration: 600,
			start: { rotate: -0.2 },
			end: { rotate: 0.2 },
			transitionDuration: 200
		},
		"walk-fast": {
			duration: 400,
			start: { rotate: -0.2 },
			end: { rotate: 0.2 },
			transitionDuration: 200
		},
		"walk-slow": {
			duration: 800,
			start: { rotate: -0.2 },
			end: { rotate: 0.2 },
			transitionDuration: 200
		},
		duck: {
			duration: 900,
			start: { rotate: -0.1, translateY: 25 },
			end: { rotate: 0.1, translateY: 25 },
			transitionDuration: 200
		}
	}
};

const allData = [
	legBack,
	armBack,
	torso,
	head,
	legFront,
	armFront,
];

const animationProviders = allData
	.map(baseDataExtender)
	.map(createTransformDrawSetProvider);

export const eslanAnimationFactory = new TransformDrawAnimationFactory(animationProviders);
