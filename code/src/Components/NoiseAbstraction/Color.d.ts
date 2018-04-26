export default Color;
declare namespace Color {
	class RGBA {
		r: number;
		g: number;
		b: number;
		a: number;
		constructor(r?: number, g?: number, b?: number, a?: number);
		toHSLA(): HSLA;
		toArray(): number[];
		clone(): RGBA;
		toString(): string;
	}
	class HSLA {
		h: number;
		s: number;
		l: number;
		a: number;
		constructor(h?: number, s?: number, l?: number, a?: number);
		toRGBA(): RGBA;
		toArray(): number[];
		clone(): RGBA;
	}

}

export function rgbToHsl(r: number, g: number, b: number): Color.HSLA;
export function hslToRgb(h: number, s: number, l: number): Color.RGBA;
export function hueToRgb(v1: number, v2: number, vh: number): Color.RGBA;
