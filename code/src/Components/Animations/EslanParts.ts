import { Texture, Sprite } from "excalibur";
import { CustomSprite } from "./AnimationHelpers";
import { IBodyPart } from "./MichaelsonParts";

export const image = require<string>("../../Resources/Images/eslan.png");
export const texture = new Texture(image);

export const modelSize = {
	w: 38,
	h: 133
};

const armSize = {
	w: 11,
	h: 57,
};

const armAnchor = {
	x: 6,
	y: 6
};

const legSize = {
	w: 26,
	h: 56
};

const legAnchor = {
	x: 20,
	y: 7
};

const headSize = {
	w: 36,
	h: 49
};

const headAnchor = {
	x: 36 / 2,
	y: 49 / 2
};

const torsoSize = {
	w: 28,
	h: 57
};

const torsoAnchor = {
	x: 14,
	y: 57 / 2
};

const armRight: IBodyPart = {
	texture,
	sourceLocation: {
		x: 128,
		y: 86,
		...armSize
	},
	modelLocation: {
		x: 17,
		y: 47,
		...armSize
	},
	anchor: { ...armAnchor }
};

const armLeft: IBodyPart = {
	texture,
	sourceLocation: {
		x: 103,
		y: 85,
		...armSize
	},
	modelLocation: {
		x: 17,
		y: 47,
		...armSize
	},
	anchor: { ...armAnchor }
};

const legRight: IBodyPart = {
	texture,
	sourceLocation: {
		x: 177,
		y: 19,
		...legSize
	},
	modelLocation: {
		x: 4,
		y: 76,
		...legSize
	},
	anchor: { ...legAnchor }
};

const legLeft: IBodyPart = {
	texture,
	sourceLocation: {
		x: 139,
		y: 19,
		...legSize
	},
	modelLocation: {
		x: 4,
		y: 76,
		...legSize
	},
	anchor: { ...legAnchor }
};

const headRight: IBodyPart = {
	texture,
	sourceLocation: {
		x: 76,
		y: 14,
		...headSize
	},
	modelLocation: {
		x: 0,
		y: 0,
		...headSize
	},
	anchor: { ...headAnchor }
};

const headLeft: IBodyPart = {
	texture,
	sourceLocation: {
		x: 24,
		y: 15,
		...headSize
	},
	modelLocation: {
		x: 0,
		y: 0,
		...headSize
	},
	anchor: { ...headAnchor }
};

const torso: IBodyPart = {
	texture,
	sourceLocation: {
		x: 27,
		y: 84,
		...torsoSize
	},
	modelLocation: {
		x: 8,
		y: 39,
		...torsoSize
	},
	anchor: { ...torsoAnchor }
};

export type IBodyParts = keyof typeof bodyParts;
const _sprites: ObjectValueMap<typeof bodyParts, CustomSprite> = {} as any;
const _bodyParts = {
	armRight,
	armLeft,
	legRight,
	legLeft,
	headRight,
	headLeft,
	torso
};

const allParts = [
	armRight,
	armLeft,
	legRight,
	legLeft,
	headRight,
	headLeft,
	torso
];

const rightParts = [
	armRight,
	legRight,
	headRight
];

const centerPart = (part: IBodyPart) => {
	const { modelLocation: ml } = part;
	ml.x -= modelSize.w / 2;
	ml.y -= modelSize.h / 2;
	// ml.y -= modelSize.h;
	// ml.y += 16;
	ml.x += part.anchor.x;
	ml.y += part.anchor.y;
};

const shiftRight = (part: IBodyPart) => {
	part.modelLocation.x = -part.modelLocation.x;
	part.anchor.x = part.modelLocation.w - part.anchor.x;
};

allParts.forEach(centerPart);
rightParts.forEach(shiftRight);
Object.entries(_bodyParts).forEach(([key, { texture, sourceLocation: loc }]) =>
	_sprites[key as IBodyParts] = new CustomSprite(texture, loc.x, loc.y, loc.w, loc.h)
);

export const bodyParts = _bodyParts;
export const sprites = _sprites;
