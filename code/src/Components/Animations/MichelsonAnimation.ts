import { ITransformDrawSetProviderData, createTransformDrawSetProvider, TransformDrawAnimationFactory } from "./DrawAnimationFactory";
import { cubicEasing, IDrawBase, IBeforeDraw, ITransformation } from "./TransformDrawPart";
import { IDrawSetProvider } from "./DrawAnimation";
import { PlainDrawSet } from "./PlainDrawSet";
import { Sprite, Vector } from "excalibur";
import { bodyParts, IBodyPart, sprites, spritesBro, IBodyParts, IBounds } from "./MichaelsonParts";
import { ITransformDrawStateCollection } from "./TransformDrawSet";

export const playerAnimationTypes = [
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
	"walk-slow-left",
	"grab-right",
	"swim-right",
	"swim-right-fast",
	"swim-right-slow",
];

export type IPlayerAnimations =
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
	| "walk-slow-left"
	| "grab-right"
	| "swim-right"
	| "swim-right-fast"
	| "swim-right-slow";

type IPABase =
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

export const states = _states as ObjectValueMap<typeof _states, IPlayerAnimations>;

type ISprites = typeof sprites;
type IPA = IPlayerAnimations;
type ITData = ITransformDrawSetProviderData<IPA>;
interface IRLData {
	states: ITData["states"];
	baseStates?: ITransformDrawStateCollection<IPABase>;
	selectedState: ITData["selectedState"];
	beforeDraw?: (sprites: ISprites) => IBeforeDraw<IPlayerAnimations>;
	drawBase: (sprites: ISprites) => IDrawBase<IPlayerAnimations>;
}

const beforeDrawFactory = (bodyPartRight: IBodyParts, bodyPartLeft: IBodyParts) => (sprites: ISprites): IBeforeDraw<IPlayerAnimations> => {
	const bpr = bodyParts[bodyPartRight];
	const bpl = bodyParts[bodyPartLeft];

	return (ctx, _, position, state) => {
		if (state.includes("right"))
			return { translateX: bpr.modelLocation.x, translateY: bpr.modelLocation.y };
		else
			return { translateX: bpl.modelLocation.x, translateY: bpl.modelLocation.y };
	};
};

const drawBaseFactory = (bodyPartRight: IBodyParts, bodyPartLeft: IBodyParts) => (sprites: ISprites): IDrawBase<IPlayerAnimations> => {
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

export const baseDataExtender = (irlData: IRLData, sprites: ISprites) => {
	const { states, selectedState } = irlData;
	const itData = {
		states,
		selectedState,
		beforeDraw: irlData.beforeDraw && irlData.beforeDraw(sprites),
		drawBase: irlData.drawBase(sprites)
	};
	if (irlData.baseStates)
		Object.entries(irlData.baseStates).forEach(([key, state]) => {
			itData.states[key + "-right" as IPA] = state;
			itData.states[key + "-left" as IPA] = state;
		});
	return itData as ITData;
};

export const selectedState = "idle-right";
const deg90 = Math.PI / 2;

const baseArmTransform = {
	translateX: 20,
	translateY: 82,
};

const baseLegTransform = {
	translateX: -7,
	translateY: 46,
};

const baseTorsoTransform = {
	rotate: deg90,
	translateY: 68
};

const baseHeadTransform = {
	translateX: 45,
	translateY: 114,
};

export const armFront: IRLData = {
	selectedState,
	drawBase: drawBaseFactory("armRight", "armLeft"),
	beforeDraw: beforeDrawFactory("armRight", "armLeft"),
	states: {
		"jump-right": {
			duration: 800,
			start: { rotate: -2.2, translateX: 5 },
			end: { rotate: -2.5, translateX: 5 },
			transitionDuration: 100
		},
		"jump-left": {
			duration: 800,
			start: { rotate: 2.2, translateX: -5 },
			end: { rotate: 2.5, translateX: -5 },
			transitionDuration: 100
		},
		"grab-right": {
			duration: 800,
			start: { rotate: -3 - .03, translateX: -5 },
			end: { rotate: -3 + .03, translateX: -5 },
			transitionDuration: 100
		},
		"swim-right": {
			duration: 500,
			start: { rotate: -deg90 + -0.5, ...baseArmTransform },
			end: { rotate: -deg90 + 0.5, ...baseArmTransform },
			transitionDuration: 200
		},
		"swim-right-fast": {
			duration: 300,
			start: { rotate: -deg90 + -0.5, ...baseArmTransform },
			end: { rotate: -deg90 + 0.5, ...baseArmTransform },
			transitionDuration: 200
		},
		"swim-right-slow": {
			duration: 700,
			start: { rotate: -deg90 + -0.5, ...baseArmTransform },
			end: { rotate: -deg90 + 0.5, ...baseArmTransform },
			transitionDuration: 200
		},
	},
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
			transitionDuration: 100
		}
	}
};

export const armBack: IRLData = {
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
		"grab-right": {
			duration: 800,
			start: { rotate: -3 + .03, translateX: -5 },
			end: { rotate: -3 - .03, translateX: -5 },
			transitionDuration: 100
		},
		"swim-right": {
			duration: 500,
			start: { rotate: -deg90 + 0.5, ...baseArmTransform },
			end: { rotate: -deg90 + -0.5, ...baseArmTransform },
			transitionDuration: 200
		},
		"swim-right-fast": {
			duration: 300,
			start: { rotate: -deg90 + 0.5, ...baseArmTransform },
			end: { rotate: -deg90 + -0.5, ...baseArmTransform },
			transitionDuration: 200
		},
		"swim-right-slow": {
			duration: 700,
			start: { rotate: -deg90 + 0.5, ...baseArmTransform },
			end: { rotate: -deg90 + -0.5, ...baseArmTransform },
			transitionDuration: 200
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
			transitionDuration: 100
		}
	}
};
export const legFront: IRLData = {
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
		},
		"grab-right": {
			duration: 500,
			start: { rotate: 0.15 },
			end: { rotate: -0.15 },
			transitionDuration: 200
		},
		"swim-right": {
			duration: 500,
			start: { rotate: deg90 - 0.3, ...baseLegTransform },
			end: { rotate: deg90 + 0.3, ...baseLegTransform },
			transitionDuration: 200
		},
		"swim-right-fast": {
			duration: 300,
			start: { rotate: deg90 - 0.3, ...baseLegTransform },
			end: { rotate: deg90 + 0.3, ...baseLegTransform },
			transitionDuration: 200
		},
		"swim-right-slow": {
			duration: 700,
			start: { rotate: deg90 - 0.3, ...baseLegTransform },
			end: { rotate: deg90 + 0.3, ...baseLegTransform },
			transitionDuration: 200
		},
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
		}
	}
};

export const legBack: IRLData = {
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
		},
		"grab-right": {
			duration: 500,
			start: { rotate: -0.15 },
			end: { rotate: 0.15 },
			transitionDuration: 200
		},
		"swim-right": {
			duration: 500,
			start: { rotate: deg90 + 0.3, ...baseLegTransform },
			end: { rotate: deg90 + 0.3, ...baseLegTransform },
			transitionDuration: 200
		},
		"swim-right-fast": {
			duration: 300,
			start: { rotate: deg90 + 0.3, ...baseLegTransform },
			end: { rotate: deg90 + 0.3, ...baseLegTransform },
			transitionDuration: 200
		},
		"swim-right-slow": {
			duration: 700,
			start: { rotate: deg90 + 0.3, ...baseLegTransform },
			end: { rotate: deg90 + 0.3, ...baseLegTransform },
			transitionDuration: 200
		},
	},
	baseStates: {
		idle: {
			duration: 1000,
			start: {},
			end: {},
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
		}
	}
};

export const legDuckFront: IRLData = {
	selectedState,
	drawBase: drawBaseFactory("legDuckRight", "legDuckLeft"),
	beforeDraw: beforeDrawFactory("legDuckRight", "legDuckLeft"),
	states: {},
	baseStates: {
		duck: {
			duration: 600,
			start: { rotate: 0.1 },
			end: { rotate: -0.1 },
			transitionDuration: 100
		}
	}
};

export const legDuckBack: IRLData = {
	selectedState,
	drawBase: drawBaseFactory("legDuckRight", "legDuckLeft"),
	beforeDraw: beforeDrawFactory("legDuckRight", "legDuckLeft"),
	states: {},
	baseStates: {
		duck: {
			duration: 600,
			start: { rotate: -0.1 },
			end: { rotate: 0.1 },
			transitionDuration: 100
		}
	}
};

export const torso: IRLData = {
	selectedState,
	beforeDraw: () => () => {
		return { translateX: bodyParts.torso.modelLocation.x, translateY: bodyParts.torso.modelLocation.y };
	},
	drawBase: (sprites) => (ctx) => {
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
			duration: 1000,
			start: { rotate: -0.2 },
			end: { rotate: -0.2 },
			transitionDuration: 200
		},
		"grab-right": {
			duration: 1000,
			start: {},
			end: {},
			transitionDuration: 200
		},
		"swim-right": {
			start: { ...baseTorsoTransform },
			end: { ...baseTorsoTransform },
		},
		"swim-right-fast": {
			start: { ...baseTorsoTransform },
			end: { ...baseTorsoTransform },
		},
		"swim-right-slow": {
			start: { ...baseTorsoTransform },
			end: { ...baseTorsoTransform },
		}
	},
	baseStates: {
		idle: {
			duration: 1000,
			start: {},
			end: {},
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
			transitionDuration: 100
		}
	}
};

export const head: IRLData = {
	selectedState,
	beforeDraw: () => (_, __, ___, state) => {
		const { x: xr, y: yr } = bodyParts.headRight.modelLocation;
		const { x: xl, y: yl } = bodyParts.headLeft.modelLocation;
		if (state.includes("right"))
			return { translateX: xr, translateY: yr };
		else
			return { translateX: xl, translateY: yl };
	},
	drawBase: (sprites) => (ctx, _, __, state) => {
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
			start: { rotate: 0.1, translateX: 5 },
			end: { rotate: -0.1, translateX: 5 },
			transitionDuration: 200
		},
		"jump-left": {
			duration: 500,
			start: { rotate: -0.1, translateX: -5 },
			end: { rotate: 0.1, translateX: -5 },
			transitionDuration: 200
		},
		"grab-right": {
			duration: 500,
			start: { rotate: -0.1 },
			end: { rotate: 0.1 },
			transitionDuration: 200
		},
		"swim-right": {
			duration: 500,
			start: { rotate: deg90 + 0.2, ...baseHeadTransform },
			end: { rotate: deg90 - 0.2, ...baseHeadTransform },
			transitionDuration: 200
		},
		"swim-right-fast": {
			duration: 300,
			start: { rotate: deg90 + 0.2, ...baseHeadTransform },
			end: { rotate: deg90 - 0.2, ...baseHeadTransform },
			transitionDuration: 200
		},
		"swim-right-slow": {
			duration: 700,
			start: { rotate: deg90 + 0.2, ...baseHeadTransform },
			end: { rotate: deg90 - 0.2, ...baseHeadTransform },
			transitionDuration: 200
		},
	},
	baseStates: {
		idle: {
			duration: 1500,
			start: { rotate: 0.05 },
			end: { rotate: -0.05 },
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
			transitionDuration: 100
		}
	}
};

export const allData = [
	legBack,
	legDuckBack,
	armBack,
	torso,
	head,
	legFront,
	legDuckFront,
	armFront,
];

const animationProviders = allData
	.map(t => baseDataExtender(t, sprites))
	.map(t => createTransformDrawSetProvider(t));
const animationProvidersBro = allData
	.map(t => baseDataExtender(t, spritesBro))
	.map(t => createTransformDrawSetProvider(t));

export const playerAnimationFactory = new TransformDrawAnimationFactory(animationProviders);
export const brotherAnimationFactory = new TransformDrawAnimationFactory(animationProvidersBro);
