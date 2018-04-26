import ClassicNoise from "./ClassicNoise";

export default SimplexNoise;
declare class SimplexNoise extends ClassicNoise {
	constructor(seed?: number);
	seed(seed?: number): void;
	noise2d(x: number, y: number): number;
	noise3d(x: number, y: number, z: number): number;
	noise4d(x: number, y: number, z: number, w: number): number;
	noise(x: number, y?: number, z?: number, w?: number): number;
}
