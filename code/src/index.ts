function init() {
	/**
	 *  check whether the user is using Internet Explorer
	 */
	if (navigator.userAgent.match(/MSIE|Trident/)) {
		/**
		 *  criticise the user
		 */
		(document.getElementById("init-message") as HTMLDivElement).innerText = "Internet Explorer is currently not supported.";
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
