import { Texture, ILoadable } from "excalibur";
import { texture as michealsonTexture } from "./Components/Animations/MichaelsonParts";

export interface IResources {
	[key: string]: ILoadable | { [key: string]: ILoadable };
}

const resources = {

	crocodile: new Texture(require("./Scenes/Level2/crocodile-sprite.png")),
	seaBed: new Texture(require("./Scenes/Level2/seabed.jpg")),
	sky: new Texture(require("./Scenes/Level2/cloud.jpg")),
	bubble: new Texture(require("./Scenes/Level2/bubble.png")),
	vine: new Texture(require("./Scenes/Level1/Vine.png")),
	smallRock: new Texture(require("./Scenes/Level3/smallRock.png")),
	bigRock: new Texture(require("./Scenes/Level3/bigRock.png")),
	level3: {
		bg: new Texture(require("./Resources/Images/level3Texture.png")),
		ground: new Texture(require("./Resources/Images/ground.png"))
	},
	level4: {
		bg: new Texture(require("./Resources/Images/level4Texture.png")),
		// bg: new Texture(require("./Resources/Images/lvl4background2.png")),
		ground: new Texture(require("./Resources/Images/groundLvl4.png")),
		princess: new Texture(require("./Scenes/Level4/princess.png")),
		pot: new Texture(require("./Scenes/Level4/pot.png")),
		michealsonTexture,
	}

};

export default resources as IResources as typeof resources;

export function getLoadableResources() {
	const arr = Object.values(resources);
	let i = -1;
	while ((i = arr.findIndex(t => !(t instanceof Texture))) > 0) {
		arr.splice(i, 1, ...(Object.values(arr[i]) as any[]));
	}
	return arr as Texture[];
}
