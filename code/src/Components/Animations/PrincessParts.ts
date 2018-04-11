import { Texture, Sprite } from "excalibur";
import { CustomSprite } from "./AnimationHelpers";
import { IBodyPart, image, texture } from "./MichaelsonParts";

export const modelSize = {
	w: 43,
	h: 119
};

const armSize = {
	w: 16,
	h: 59,
};

const legSize = {
	w: 13,
	h: 47
};

const headSize = {
	w: 43,
	h: 42
};

const torsoSize = {
	w: 30,
	h: 59
};

const armRight: IBodyPart = {
	texture,
	sourceLocation: {
		x: 167,
		y: 110,
		...armSize
	},
	modelLocation: {
		x: 24,
		y: 38,
		...armSize
	},
	anchor: {
		x: 5,
		y: 5
	}
};

const armLeft: IBodyPart = {
	texture,
	sourceLocation: {
		x: 142,
		y: 110,
		...armSize
	},
	modelLocation: {
		x: 6,
		y: 38,
		...armSize
	},
	anchor: {
		x: 9,
		y: 5
	}
};

const legRight: IBodyPart = {
	texture,
	sourceLocation: {
		x: 216,
		y: 121,
		...legSize
	},
	modelLocation: {
		x: 24,
		y: 72,
		...legSize
	},
	anchor: {
		x: legSize.w / 2,
		y: 5
	}
};

const legLeft: IBodyPart = {
	texture,
	sourceLocation: {
		x: 199,
		y: 121,
		...legSize
	},
	modelLocation: {
		x: 7,
		y: 72,
		...legSize
	},
	anchor: {
		x: legSize.w / 2,
		y: 5
	}
};

const head: IBodyPart = {
	texture,
	sourceLocation: {
		x: 22,
		y: 120,
		...headSize
	},
	modelLocation: {
		x: 0,
		y: 0,
		...headSize
	},
	anchor: {
		x: 23,
		y: 43
	}
};

const torso: IBodyPart = {
	texture,
	sourceLocation: {
		x: 86,
		y: 111,
		...torsoSize
	},
	modelLocation: {
		x: 7,
		y: 30,
		...torsoSize
	},
	anchor: {
		x: torsoSize.w / 2,
		y: torsoSize.h / 2
	}
};

export type IBodyParts = keyof typeof bodyParts;
const _sprites: ObjectValueMap<typeof bodyParts, CustomSprite> = {} as any;
const _bodyParts = {
	armRight,
	armLeft,
	legRight,
	legLeft,
	head,
	torso
};

const allParts = [
	armRight,
	armLeft,
	legRight,
	legLeft,
	head,
	torso
];

const centerPart = (part: IBodyPart) => {
	const { modelLocation: ml } = part;
	ml.x -= modelSize.w / 2;
	ml.y -= modelSize.h / 2;
	// ml.y -= modelSize.h;
	ml.x += part.anchor.x;
	ml.y += part.anchor.y;
};

allParts.forEach(centerPart);
Object.entries(_bodyParts).forEach(([key, { texture, sourceLocation: loc }]) =>
	_sprites[key as IBodyParts] = new CustomSprite(texture, loc.x, loc.y, loc.w, loc.h)
);

export const bodyParts = _bodyParts;
export const sprites = _sprites;
