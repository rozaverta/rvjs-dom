'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var adding = 'addEventListener',
    removing = 'removeEventListener';
var reg = /\s+/g;
var isWin = typeof window !== 'undefined' && 'setTimeout' in window;

// -- READY DOM

var docIsReady = false;
var docCall = [];

function docLoad() {
	if (!docIsReady) {
		detach();
		docIsReady = true;
	}

	for (var i = 0, len = docCall.length; i < len; i++) {
		try {
			docCall[i]();
		} catch (e) {
			console.log("Fatal ready callback error", e);
		}
	}

	docCall = [];
}

function detach() {
	if (document[adding]) {
		document[removing]("DOMContentLoaded", docLoad);
		window[removing]("load", docLoad);
	} else {
		document.detachEvent("onreadystatechange", docLoad);
		window.detachEvent("onload", docLoad);
	}
}

if (isWin && typeof document !== "undefined") {
	if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {
		setTimeout(docLoad, 0);
	} else if (document[adding]) {
		document[adding]("DOMContentLoaded", docLoad);
		window[adding]("load", docLoad);
	} else {
		document.attachEvent("onreadystatechange", docLoad);
		window.attachEvent("onload", docLoad);

		// If IE and not a frame
		// continually check to see if the document is ready
		var top = false;

		try {
			top = window.frameElement === null && document.documentElement;
		} catch (e) {}

		if (top && top.doScroll) {
			(function doScrollCheck() {
				if (!docIsReady) {

					try {
						top.doScroll("left");
					} catch (e) {
						return window.setTimeout(doScrollCheck, 50);
					}

					docLoad();
				}
			})();
		}
	}
}

// -- /READY

var support = {
	touch: isWin && 'ontouchstart' in window,
	orientationChange: isWin && 'orientationchange' in window,
	passive: false
};

try {
	var opts = Object.defineProperty({}, 'passive', {
		get: function get() {
			support.passive = true;
		}
	});
	window[adding]("testPassive", null, opts);
	window[removing]("testPassive", null, opts);
} catch (e) {}

// -- EVENTS CALLBACK

function noop() {}

function tap(items, func) {
	for (var i = 0, length = items.length; i < length; i++) {
		if (func(items[i]) === false) {
			return false;
		}
	}
	return true;
}

function getName(name) {
	return Array.isArray(name) ? name : String(name).split(reg);
}

function bind(element, event, callback, func) {
	if (element[func]) {
		element[func](event, callback, false);
		return true;
	} else {
		return false;
	}
}

function bindEvent(collection, event, callback, func) {
	tap(collection, function (element) {
		return bind(element, event, callback, func);
	});
}

function bindEvents(collection, events, callback, func) {
	tap(collection, function (element) {
		return element[func] && tap(events, function (event) {
			element[func](event, callback, false);
		});
	});
}

function bindWindow(name, callback, remove_callback) {
	if (isWin && tap(name, function (n) {
		return bind(window, n, callback, adding);
	})) {
		remove_callback && remove_callback(function () {
			tap(name, function (n) {
				return bind(window, n, callback, removing);
			});
		});
	} else if (remove_callback) {
		remove_callback(noop);
	}
}

function make(collection, event, callback, func) {
	collection = _collection2.default.make(collection);
	if (collection.length) {
		event = getName(event);
		if (event.length > 1) {
			bindEvents(collection, event, callback, func);
		} else if (event.length) {
			bindEvent(collection, event[0], callback, func);
		}
	}
}

var Evn = {

	support: support,

	native: function native(add, element, name, callback) {
		var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

		var func = add === true || add === 'add' ? adding : removing;
		if (element && typeof callback === 'function' && func in element) {
			element[func](name, callback, capture);
		}
		return Evn;
	},
	add: function add(element, name, callback) {
		make(element, name, callback, adding);
		return Evn;
	},
	remove: function remove(element, name, callback) {
		make(element, name, callback, removing);
		return Evn;
	},
	resize: function resize(callback) {
		var remove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		bindWindow(support.orientationChange ? ['resize', 'orientationchange'] : ['resize'], callback, remove);
		return Evn;
	},
	scroll: function scroll(callback) {
		var remove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		bindWindow(['scroll'], callback, remove);
		return Evn;
	},
	on: function on(name, callback) {
		var remove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		bindWindow(getName(name), callback, remove);
		return Evn;
	},
	hover: function hover(element, enter, leave) {
		var remove = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		element = _collection2.default.make(element);
		if (element.length) {
			bindEvent(element, 'mouseenter', enter, adding);
			bindEvent(element, 'mouseleave', leave, adding);
			remove && remove(function () {
				bindEvent(element, 'mouseenter', enter, removing);
				bindEvent(element, 'mouseleave', leave, removing);
			});
		} else if (remove) {
			remove(noop);
		}
		return Evn;
	},
	ready: function ready(callback) {
		if (typeof callback === 'function') {
			if (docIsReady) setTimeout(callback, 0);else if (docCall.indexOf(callback) < 0) docCall.push(callback);
		}
		return Evn;
	}
};

exports.default = Evn;