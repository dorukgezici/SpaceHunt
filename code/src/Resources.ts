import {ILoadable, Resource, Texture} from "excalibur";
import {texture as michealsonTexture, textureDuck} from "./Components/Animations/MichaelsonParts";
import {texture as eslanTexture} from "./Components/Animations/EslanParts";

export interface IResources {
	[key: string]: ILoadable | { [key: string]: ILoadable };
}

/**
 * These resources are loaded before GameBootstrap is initialised.
 */
export const initialResources: string[] = [
	michealsonTexture.src,
	textureDuck.src,
	require("./Resources/Images/BgSaturn-bg.png"),
	require("./Resources/Images/BgSaturn-saturn.png")
];

const resources = {
	level1: {
		bg: new Texture(require("./Resources/Images/Level1/JungleBackground.png")),
		ground: new Texture(require("./Resources/Images/Level1/Grass.png")),
		tree: new Texture(require("./Resources/Images/Level1/Tree.png")),
		arrow: new Texture(require("./Resources/Images/Level1/Arrow.png")),
		vine: new Texture(require("./Resources/Images/Level1/Vine.png"))
	},
	level2: {
		crocodile: new Texture(require("./Resources/Images/Level2/crocodile-sprite.png")),
		ground: new Texture(require("./Resources/Images/Level2/seabed.jpg")),
		bg: new Texture(require("./Resources/Images/Level2/RiverTexture.png")),
		bubble: new Texture(require("./Resources/Images/Level2/bubble.png"))
	},
	level3: {
		bg: new Texture(require("./Resources/Images/Level3/level3Texture.png")),
		ground: new Texture(require("./Resources/Images/Level3/ground.png")),
		smallRock: new Texture(require("./Resources/Images/Level3/smallRock.png")),
		bigRock: new Texture(require("./Resources/Images/Level3/bigRock.png"))
	},
	level4: {
		bg: new Texture(require("./Resources/Images/Level4/lvl4background2.png")),
		ground: new Texture(require("./Resources/Images/Level4/groundLvl4.png")),
		pot: new Texture(require("./Resources/Images/Level4/pot.png"))
	},
	fonts: {
		fontO: new Resource(require("./Resources/Fonts/SF Distant Galaxy/SF Distant Galaxy Outline.ttf"), "blob"),
		fontAO: new Resource(require("./Resources/Fonts/SF Distant Galaxy/SF Distant Galaxy AltOutline.ttf"), "blob"),
	},
	michealsonTexture: michealsonTexture.exTexture(),
	eslanTexture,
	textureDuck: textureDuck.exTexture()
};

export default resources as IResources as typeof resources;

export function getLoadableResources() {
	const arr = Object.values(resources).filter(t => (t instanceof Texture) || (t instanceof Resource));
	const objs = Object.values(resources)
		.filter( t => !((t instanceof Texture) || (t instanceof Resource)))
		.map(t => Object.values(t));
	const ret = [
		...arr,
		...[].concat(...objs as any[])
	];
	return ret as Resource<any>[];
}
