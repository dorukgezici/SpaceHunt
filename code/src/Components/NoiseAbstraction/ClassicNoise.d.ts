export default ClassicNoise;
declare class ClassicNoise {
	constructor(seed?: number);
	seed(seed?: number): void;
	octaves(octaves: number): number;
	fallout(fallout?: number): number;
	noise(x: number, y?: number, z?: number): number;
	noise2d(x: number, y: number): number;
	noise3d(x: number, y: number, z: number): number;
}
