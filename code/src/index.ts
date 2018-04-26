function init() {
	/**
	 * Check whether the user is using Internet Explorer.
	 */
	if (navigator.userAgent.match(/MSIE|Trident/)) {
		/**
		 * Criticise the user.
		 */
		(document.getElementById("init-message") as HTMLDivElement).innerText = "Internet Explorer is currently not supported.";
	} else if (navigator.userAgent.indexOf("Edge") > -1) {
		/**
		 * Nope, even Edge can't handle our game.
		 */
		(document.getElementById("init-message") as HTMLDivElement).innerText = "Edge isn't good enough to be able to run our game. Sorry.";
	} else {
		/**
		 * Do NOT import this method in the beginning of this file, as
		 * some older browser *khm* IE *khm* may not throw syntax errors
		 * that are thrown when imports are loaded. Instead, we want to
		 * display the browser support message as shown above.
		 */
		const { default: gameInit } = require<{ default: Function }>("./bootstrap");
		gameInit();
	}
}

document.addEventListener("DOMContentLoaded", init);
