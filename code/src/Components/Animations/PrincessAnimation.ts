import { ITransformDrawSetProviderData, createTransformDrawSetProvider, TransformDrawAnimationFactory } from "./DrawAnimationFactory";
import { cubicEasing, IDrawBase, IBeforeDraw } from "./TransformDrawPart";
import { IDrawSetProvider } from "./DrawAnimation";
import { PlainDrawSet } from "./PlainDrawSet";
import { Sprite } from "excalibur";
import { bodyParts, sprites, IBodyParts } from "./PrincessParts";
import { ITransformDrawStateCollection } from "./TransformDrawSet";
import { IBodyPart } from "./MichaelsonParts";

export type IPrincessAnimationState = "idle";
type IPAS = IPrincessAnimationState;

const drawBaseFactory = (part: IBodyParts): IDrawBase<IPAS> => ctx => {
	const { x, y } = bodyParts[part].anchor;
	sprites[part].draw(ctx, -x, -y);
};

const beforeDrawFactory = (part: IBodyParts): IDrawBase<IPAS> => (ctx, _, pos) => ({
	translateX: bodyParts[part].modelLocation.x,
	translateY: bodyParts[part].modelLocation.y
});

const selectedState = "idle";

const rad = (deg: number) => deg / 180 * Math.PI;

const armRight: ITransformDrawSetProviderData<IPAS> = {
	selectedState,
	drawBase: drawBaseFactory("armRight"),
	beforeDraw: beforeDrawFactory("armRight"),
	states: {
		idle: {
			duration: 200,
			start: { rotate: rad(-100) },
			end: { rotate: rad(-140) }
		}
	}
};

const armLeft: ITransformDrawSetProviderData<IPAS> = {
	selectedState,
	drawBase: drawBaseFactory("armLeft"),
	beforeDraw: beforeDrawFactory("armLeft"),
	states: {
		idle: {
			duration: 200,
			start: { rotate: rad(100) },
			end: { rotate: rad(140) }
		}
	}
};

const legRight: ITransformDrawSetProviderData<IPAS> = {
	selectedState,
	drawBase: drawBaseFactory("legRight"),
	beforeDraw: beforeDrawFactory("legRight"),
	states: {
		idle: {
			duration: 400,
			start: { rotate: rad(-10) },
			end: { rotate: 0 }
		}
	}
};

const legLeft: ITransformDrawSetProviderData<IPAS> = {
	selectedState,
	drawBase: drawBaseFactory("legLeft"),
	beforeDraw: beforeDrawFactory("legLeft"),
	states: {
		idle: {
			duration: 400,
			start: { rotate: rad(10) },
			end: { rotate: 0 }
		}
	}
};

const torso: ITransformDrawSetProviderData<IPAS> = {
	selectedState,
	drawBase: drawBaseFactory("torso"),
	beforeDraw: beforeDrawFactory("torso"),
	states: {
		idle: {
			start: {},
			end: {}
		}
	}
};

const head: ITransformDrawSetProviderData<IPAS> = {
	selectedState,
	drawBase: drawBaseFactory("head"),
	beforeDraw: beforeDrawFactory("head"),
	states: {
		idle: {
			duration: 300,
			start: { rotate: rad(10) },
			end: { rotate: rad(-10) }
		}
	}
};

const allData = [
	torso,
	head,
	legLeft,
	legRight,
	armLeft,
	armRight,
];

const animationProviders = allData.map(t => createTransformDrawSetProvider(t));

export const princessAnimationFactory = new TransformDrawAnimationFactory(animationProviders);
