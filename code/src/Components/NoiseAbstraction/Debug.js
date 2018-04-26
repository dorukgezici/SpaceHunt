/**
 * Debug
 */
(function (global) {

	var limit = 0;
	var count = 0;

	function log() {
		if (limit > 0) {
			if (limit === count) return;
			count++;
		}
		window.console.log.apply(window.console, arguments);
	}

	log.limit = function (limitCount) {
		limit = limitCount < 0 ? 0 : limitCount;
	};

	// global.log = log;

})(window);
