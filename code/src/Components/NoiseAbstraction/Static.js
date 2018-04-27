// Data type check

export function isObject(value, ignoreArray) {
	return typeof value === 'object' && value !== null;
}

export function isNumber(value) {
	return typeof value === 'number';
}

export function isString(value) {
	return typeof value === 'string';
}

export function isFunction(value) {
	return typeof value === 'function';
}

export function isArray(value) {
	return Array.isArray(value);
	// return Object.prototype.toString.call(value) === '[object Array]';
}

export function isNull(value) {
	return value === null;
}

export function isUndefined(value) {
	return typeof value === 'undefined';
}

// global.isObject = isObject;
// global.isNumber = isNumber;
// global.isString = isString;
// global.isFunction = isFunction;
// global.isArray = isArray;
// global.isNull = isNull;
// global.isUndefined = isUndefined;

/**
 * extend
 */
export function extend() {
	var target = arguments[0] || {},
		o, p;

	for (var i = 1, len = arguments.length; i < len; i++) {
		o = arguments[i];

		if (!isObject(o)) continue;

		for (p in o) {
			target[p] = o[p];
		}
	}

	return target;
}

// global.extend = extend;


// Random

export function random(max, min) {
	if (isNaN(Number(max))) return Math.random();
	if (isNaN(Number(min))) min = 0;
	return Math.random() * (max - min) + min;
}

export function randInt(max, min) {
	if (isNaN(Number(max))) return NaN;
	if (isNaN(Number(min))) min = 0;
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// global.random = random;
// global.random = randInt;
