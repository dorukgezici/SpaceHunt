import { GameBootstrap } from "./GameBootstrap";
import { InterfaceBuilder } from "./InterfaceBuilder";

async function init() {
	// wait for the document to load
	await InterfaceBuilder.awaitDOMContentLoaded();
	// create new GameBootstrap object
	const gb = new GameBootstrap(InterfaceBuilder.canvasId, InterfaceBuilder.getApp() as HTMLElement);
	// start the game
	gb.start();
}

init();
