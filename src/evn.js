"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.NormalizeWheelEvent = exports.NormalizeEvent = undefined;

var _collection = require("./collection");

var _collection2 = _interopRequireDefault(_collection);

var _rvjsTools = require("rvjs-tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RegSpace = /\s+/g;
var RegLowerFirst = /^[a-z]/;
var RegKeyEvent = /^key/;
var RegMouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;

var isWin = typeof window !== 'undefined' && 'setTimeout' in window;

var adding = 'addEventListener',
    removing = 'removeEventListener',
    getOriginalEventName = function getOriginalEventName(name) {
	return name;
};

if (isWin && !window[adding] && "attachEvent" in window) {
	adding = "attachEvent";
	removing = "detachEvent";
	getOriginalEventName = function getOriginalEventName(name) {
		return RegLowerFirst.test(name) ? "on" + name : name;
	};
}

// -- READY DOM

var docIsReady = false;
var docCall = [];

function docLoad() {
	if (!docIsReady) {
		docUnload();
		docIsReady = true;
	}

	for (var i = 0, len = docCall.length; i < len; i++) {
		try {
			docCall[i]();
		} catch (e) {
			(0, _rvjsTools.Log)(e, "Fatal ready callback error");
		}
	}

	docCall = [];
}

function docUnload() {
	if (adding === 'addEventListener' && document[adding]) {
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
	} else if (adding === 'addEventListener' && document[adding]) {
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

var EventRename = {};

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

if (typeof document !== 'undefined' && !'onwheel' in document) {
	EventRename.wheel = "onmousewheel" in document ? "mousewheel" : ["DOMMouseScroll", "MozMousePixelScroll"];
}

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
	return Array.isArray(name) ? name : String(name).split(RegSpace);
}

function bind(element, event, callback, func, capture) {
	if (arguments.length < 5) {
		capture = false;
	}

	if (element[func]) {
		if (EventRename.hasOwnProperty(event)) {
			event = EventRename[event];
			if (Array.isArray(event)) {
				for (var i = 0, length = event.length; i < length; i++) {
					element[func](getOriginalEventName(event[i]), callback, capture);
				}
				return true;
			}
		}

		element[func](getOriginalEventName(event), callback, capture);
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
		return tap(events, function (event) {
			return bind(element, event, callback, func);
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

// normalize events
// adaptive jQuery source

var returnTrue = function returnTrue() {
	return true;
};
var returnFalse = function returnFalse() {
	return false;
};

function FixEvent(src, props) {

	var self = this;

	// Allow instantiation without the 'new' keyword
	if (!(self instanceof FixEvent)) {
		return new FixEvent(src, props);
	}

	// Event object
	if (src && src.type) {

		// keep a ref to the original event object
		self.originalEvent = src;
		self.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		// Support: Android <=2.3 only
		if (src.defaultPrevented || src.defaultPrevented === undefined && src.returnValue === false) {
			self.isDefaultPrevented = returnTrue;
		}

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		self.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target || src.srcElement;

		self.currentTarget = src.currentTarget;
		self.relatedTarget = src.relatedTarget;

		// Event type
	} else {
		self.type = src;
	}

	// Put explicitly provided properties onto the event object
	if (props) {
		Object.assign(self, props);
	}
}

FixEvent.prototype = {

	constructor: FixEvent,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	get which() {
		var self = this,
		    e = self.originalEvent,
		    button = e.button;

		// Add which for key events
		if (e.which == null && RegKeyEvent.test(e.type)) {
			return e.charCode != null ? e.charCode : e.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if (!e.which && button !== undefined && RegMouseEvent.test(e.type)) {
			if (button & 1) {
				return 1;
			}
			if (button & 2) {
				return 3;
			}
			if (button & 4) {
				return 2;
			}
			return 0;
		}

		return e.which;
	},

	preventDefault: function preventDefault() {
		var self = this,
		    e = self.originalEvent;

		self.isDefaultPrevented = returnTrue;
		if (e && !self.isSimulated) {
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		}
	},
	stopPropagation: function stopPropagation() {
		var self = this,
		    e = self.originalEvent;

		self.isPropagationStopped = returnTrue;
		if (e && !self.isSimulated) {
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		}
	},
	stopImmediatePropagation: function stopImmediatePropagation() {
		var self = this,
		    e = this.originalEvent;

		self.isImmediatePropagationStopped = returnTrue;
		if (e && !self.isSimulated) {
			e.stopImmediatePropagation();
		}

		self.stopPropagation();
	}
};

"deltaMode,deltaX,deltaY,deltaZ,altKey,bubbles,cancelable,changedTouches,ctrlKey,detail,eventPhase,metaKey,pageX,pageY,shiftKey,view,char,charCode,key,keyCode,button,buttons,clientX,clientY,offsetX,offsetY,pointerId,pointerType,screenX,screenY,targetTouches,toElement,touches".split(",").forEach(function (name) {
	Object.defineProperty(FixEvent.prototype, name, {
		enumerable: true,
		configurable: true,

		get: function get() {
			if (this.originalEvent) {
				return this.originalEvent[name];
			}
		},
		set: function set(value) {
			Object.defineProperty(this, name, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: value
			});
		}
	});
});

function NormalizeEvent(originalEvent) {
	return new FixEvent(originalEvent || window.event, {});
}

function NormalizeWheelEvent(originalEvent) {
	if (!originalEvent) {
		originalEvent = window.event;
	}

	var use = EventRename.wheel || false;
	if (!use) {
		return new FixEvent(originalEvent, {});
	}

	// create a normalized event object
	var event = {
		type: "wheel",
		deltaMode: originalEvent.type === "MozMousePixelScroll" ? 0 : 1,
		deltaX: 0,
		deltaY: 0,
		deltaZ: 0
	};

	// calculate deltaY (and deltaX) according to the event
	if (use === "mousewheel") {
		event.deltaY = -1 / 40 * originalEvent.wheelDelta;
		// Webkit also support wheelDeltaX
		originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
	} else {
		event.deltaY = originalEvent.deltaY || originalEvent.detail;
	}

	return new FixEvent(originalEvent, event);
}

//

var Evn = {

	support: support,

	native: function native(add, element, name, callback) {
		var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

		element && typeof callback === 'function' && bind(element, name, callback, add === true || add === 'add' ? adding : removing, capture);
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

exports.NormalizeEvent = NormalizeEvent;
exports.NormalizeWheelEvent = NormalizeWheelEvent;
exports.default = Evn;