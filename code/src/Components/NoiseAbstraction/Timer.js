/**
 * Timer
 */
export /** @class */ function Timer(delay, repeatCount) {
	this.delay = delay || 0;
	this.repeatCount = repeatCount || 0;
}

Timer.prototype = {
	onTimer: null,
	onTimerComplete: null,
	_running: false,
	_currentCount: 0,
	_timerId: null,

	currentCount: function () {
		return this._currentCount;
	},

	running: function () {
		return this._running;
	},

	start: function () {
		if (this._running && !this.delay) return;

		var self = this;
		var timer = function () {
			if (self.onTimer) self.onTimer.call(self);

			if (self.repeatCount) {
				self._currentCount++;
				if (self._currentCount === self.repeatCount) {
					self.stop();
					if (self.onTimerComplete) self.onTimerComplete.call(self);
					return;
				}
			}

			self._timerId = setTimeout(timer, self.delay);
		};

		this._timerId = setTimeout(timer, self.delay);
		this._running = true;
	},

	stop: function () {
		if (!this._running) return;

		clearTimeout(this._timerId);

		this._currentCount = 0;
		this._running = false;
	},

	reset: function () {
		this.stop();
		this.start();
	}
};

// global.Timer = Timer;
