import { Texture, Sprite } from "excalibur";
import { CustomSprite } from "./AnimationHelpers";

export interface IBounds {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface IBodyPart {
	texture: Texture;
	// Part of the source image that represents the body part
	sourceLocation: IBounds;
	// Position of the body part in player model
	modelLocation: IBounds;
	anchor: {
		x: number,
		y: number
	};
}

export const image = require<string>("../../Resources/Images/Michaelsons1.png");
export const imageDuck = require<string>("../../Resources/Images/duckLegs.png");
export const texture = new Texture(image);
export const textureDuck = new Texture(imageDuck);

export const modelSize = {
	w: 45,
	h: 135
};

export const modelDuckSize = {
	w: 58,
	h: 90
};

export const modelSwimSize = {
	w: 128,
	h: 42
};

const dh = modelSize.h - modelDuckSize.h;

const armSize = {
	w: 16,
	h: 58,
};

const armAnchor = {
	x: 9,
	y: 5
};

const legSize = {
	w: 31,
	h: 59
};

const legAnchor = {
	x: 31,
	y: 6
};

const headSize = {
	w: 45,
	h: 43
};

const headAnchor = {
	x: 45 / 2,
	y: 43 / 2
};

const torsoSize = {
	w: 30,
	h: 59
};

const torsoAnchor = {
	x: 15,
	y: 59 / 2
};

const legDuckSize = {
	w: 47,
	h: 45
};

const legDuckAnchor = {
	x: 40,
	y: 21
};

const armRight: IBodyPart = {
	texture,
	sourceLocation: {
		x: 172,
		y: 29,
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
		x: 147,
		y: 29,
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
		x: 211,
		y: 28,
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
		x: 252,
		y: 29,
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
		x: 19,
		y: 65,
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
		x: 17,
		y: 10,
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
		x: 86,
		y: 29,
		...torsoSize
	},
	modelLocation: {
		x: 8,
		y: 39,
		...torsoSize
	},
	anchor: { ...torsoAnchor }
};

const legDuckRight: IBodyPart = {
	texture: textureDuck,
	sourceLocation: {
		x: 65,
		y: 16,
		...legDuckSize
	},
	modelLocation: {
		x: -11, // 9
		y: 66 + (dh / 2),
		...legDuckSize
	},
	anchor: { ...legDuckAnchor }
};

const legDuckLeft: IBodyPart = {
	texture: textureDuck,
	sourceLocation: {
		x: 9,
		y: 18,
		...legDuckSize
	},
	modelLocation: {
		x: -11, // 9
		y: 66 + (dh / 2),
		...legDuckSize
	},
	anchor: { ...legDuckAnchor }
};

export type IBodyParts = keyof typeof bodyParts;
const _sprites: ObjectValueMap<typeof bodyParts, CustomSprite> = {} as any;
const _bodyParts = {
	armRight,
	armLeft,
	legRight,
	legLeft,
	legDuckRight,
	legDuckLeft,
	headRight,
	headLeft,
	torso
};

const allParts = [
	armRight,
	armLeft,
	legRight,
	legLeft,
	legDuckRight,
	legDuckLeft,
	headRight,
	headLeft,
	torso
];

const rightParts = [
	armRight,
	legRight,
	legDuckRight,
	headRight
];

const centerPart = (part: IBodyPart) => {
	const { modelLocation: ml } = part;
	ml.x -= modelSize.w / 2;
	// ml.y -= modelSize.h / 2;
	ml.y -= modelSize.h;
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
