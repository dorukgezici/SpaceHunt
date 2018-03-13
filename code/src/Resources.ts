import { Texture, ILoadable } from "excalibur";

export interface IResources {
	[key: string]: ILoadable | { [key: string]: ILoadable };
}

const resources = {

	crocodile: new Texture(require("./Scenes/Level2/crocodile-sprite.png")),
	seaBed: new Texture(require("./Scenes/Level2/seabed.jpg")),
	sky: new Texture(require("./Scenes/Level2/cloud.jpg")),
	bubble: new Texture(require("./Scenes/Level2/bubble.png"))

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

