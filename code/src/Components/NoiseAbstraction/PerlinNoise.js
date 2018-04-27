import ClassicNoise from "./ClassicNoise";
import SimplexNoise from "./SimplexNoise";
import { extend } from "./Static";

/**
 * Perlin Noise
 * 
 * @see http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
 * 
 * Tiling Example (heavy...)
 * 
 * var perlinNoise = new PerlinNoise();
 * 
 * function tilingNoise2d(x, y, w, h) {
 *     return (perlinNoise.noise(x, y) * (w - x) * (h - y) +
 *         perlinNoise.noise(x - w, y) * x * (h - y) +
 *         perlinNoise.noise(x - w, y - h) * x * y +
 *         perlinNoise.noise(x, y - h) * (w - x) * y) / (w * h);
 * }
 * 
 * function tilingNoise3d(x, y, z, w, h) {
 *     return (perlinNoise.noise(x, y, z) * (w - x) * (h - y) +
 *         perlinNoise.noise(x - w, y, z) * x * (h - y) +
 *         perlinNoise.noise(x - w, y - h, z) * x * y +
 *         perlinNoise.noise(x, y - h, z) * (w - x) * y) / (w * h);
 * }
 */
export default /** @class */ function PerlinNoise(seed) {
	this.isClassic = PerlinNoise.useClassic;
	extend(this, this.isClassic ? new ClassicNoise(seed) : new SimplexNoise(seed));
}

PerlinNoise.useClassic = false;

export var GRAD3 = [
	[1, 1, 0],
	[-1, 1, 0],
	[1, -1, 0],
	[-1, -1, 0],
	[1, 0, 1],
	[-1, 0, 1],
	[1, 0, -1],
	[-1, 0, -1],
	[0, 1, 1],
	[0, -1, 1],
	[0, 1, -1],
	[0, -1, -1]
];

export var GRAD4 = [
	[0, 1, 1, 1],
	[0, 1, 1, -1],
	[0, 1, -1, 1],
	[0, 1, -1, -1],
	[0, -1, 1, 1],
	[0, -1, 1, -1],
	[0, -1, -1, 1],
	[0, -1, -1, -1],
	[1, 0, 1, 1],
	[1, 0, 1, -1],
	[1, 0, -1, 1],
	[1, 0, -1, -1],
	[-1, 0, 1, 1],
	[-1, 0, 1, -1],
	[-1, 0, -1, 1],
	[-1, 0, -1, -1],
	[1, 1, 0, 1],
	[1, 1, 0, -1],
	[1, -1, 0, 1],
	[1, -1, 0, -1],
	[-1, 1, 0, 1],
	[-1, 1, 0, -1],
	[-1, -1, 0, 1],
	[-1, -1, 0, -1],
	[1, 1, 1, 0],
	[1, 1, -1, 0],
	[1, -1, 1, 0],
	[1, -1, -1, 0],
	[-1, 1, 1, 0],
	[-1, 1, -1, 0],
	[-1, -1, 1, 0],
	[-1, -1, -1, 0]
];

export var SIMPLEX = [
	[0, 1, 2, 3],
	[0, 1, 3, 2],
	[0, 0, 0, 0],
	[0, 2, 3, 1],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[1, 2, 3, 0],
	[0, 2, 1, 3],
	[0, 0, 0, 0],
	[0, 3, 1, 2],
	[0, 3, 2, 1],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[1, 3, 2, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[1, 2, 0, 3],
	[0, 0, 0, 0],
	[1, 3, 0, 2],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[2, 3, 0, 1],
	[2, 3, 1, 0],
	[1, 0, 2, 3],
	[1, 0, 3, 2],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[2, 0, 3, 1],
	[0, 0, 0, 0],
	[2, 1, 3, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[2, 0, 1, 3],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[3, 0, 1, 2],
	[3, 0, 2, 1],
	[0, 0, 0, 0],
	[3, 1, 2, 0],
	[2, 1, 0, 3],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[3, 1, 0, 2],
	[0, 0, 0, 0],
	[3, 2, 0, 1],
	[3, 2, 1, 0]
];