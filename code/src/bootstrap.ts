import { preloadImage } from "./Components/Preloader";
import { GameBootstrap } from "./GameBootstrap";
import { initialResources } from "./Resources";
import { EventDispatcher } from "excalibur";

/**
 * Subscribing two events via the `once` method and emitting that event won't work (bug).
 * This is a nasty workaround.
 */
const off = EventDispatcher.prototype.off;
EventDispatcher.prototype.off = function () {
	const args = arguments;
	setTimeout(() => off.apply(this, args));
};

/**
 * This function is located in a separate file other tan index.ts as some
 * old browsers *khm* IE *khm* may have trouble loading resources and throw
 * parsing errors, blocking the whole script execution. See `index.ts` for 
 * more information.
 */
export default async function initGame() {
	const resources = initialResources.map(preloadImage);
	await Promise.all(resources.map(t => t.promise));
	const gb = new GameBootstrap();
	initEnv(window.ENV, gb);
	gb.start();
}

function initEnv(env: ENVType, gb: GameBootstrap) {
	if (env === "dev") {
		(window as any).bootstrap = gb;
		(window as any).debug = () => gb.engine.isDebug = !gb.engine.isDebug;
	}
}
