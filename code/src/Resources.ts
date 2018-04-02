import { Texture } from "excalibur";

const resources = {

	crocodile: new Texture(require("./Scenes/Level2/crocodile-sprite.png")),
	seaBed: new Texture(require("./Scenes/Level2/seabed.jpg")),
	sky: new Texture(require("./Scenes/Level2/cloud.jpg")),
	bubble: new Texture(require("./Scenes/Level2/bubble.png")),
	vine: new Texture(require("./Scenes/Level1/Vine.png")),
	smallRock: new Texture(require("./Scenes/Level3/smallRock.png")),
	bigRock: new Texture(require("./Scenes/Level3/bigRock.png")),
	bgPlaceholderTexture: new Texture(require("./Scenes/Level3/bgPlaceholder.jpg"))

};

export default resources;
