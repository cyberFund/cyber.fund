/**
 * @summary Wrap a function in tracker while preserving this.
 * @locus Client
 * @param {Function} fn Function to wrap.
 * @return {Function} Wrapped function.
 */
Tracker.wrap = function (fn) {
	return function () {
		Tracker.autorun(fn.bind(this));
	}
};
