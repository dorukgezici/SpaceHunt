import { GameBootstrapType } from "./GameBootstrap";

document.addEventListener("DOMContentLoaded", function () {

	// check whether the user is using Internet Explorer
	if (navigator.userAgent.match(/MSIE|Trident/)) {
		// criticise the user
		(document.getElementById("init-message") as HTMLDivElement).innerText = "Internet Explorer is currently not supported.";
	} else {
		// do not use ES6 imports as old browsers *khm* IE *khm* may not be able to handle loading of other modules without additional polyfill support.
		const { GameBootstrap } = require("./GameBootstrap") as { GameBootstrap: GameBootstrapType };
		// create new GameBootstrap object
		const gb = new GameBootstrap();
		// TODO: move to development environment only
		(window as any).bootstrap = gb;
		// start the game
		gb.start();
	}

});
