"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _collection = require("./collection");

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reg = /^([+\-?!~:])(.+?)$/;
var regSplit = /\s+/g;

var native = false;
var lastCurrent = void 0;
var lastCurrentIndex = void 0;

if (typeof document !== "undefined") {
	try {
		var e = document.createElement("span"),
		    cl = e.classList || null;

		if (cl) {
			e.className = "a";
			try {
				cl.remove("a");
				cl.add("b");
				native = !cl.contains("a") && cl.contains("b");
			} catch (e) {}
		}
	} catch (er) {}
}

function getName(name) {
	return name === undefined || name === null ? "" : String(name).trim();
}

// no native

function contains(e, name) {
	lastCurrent = e.className ? getName(e.className).split(regSplit) : [];
	lastCurrentIndex = lastCurrent.length ? lastCurrent.indexOf(name) : -1;
	return lastCurrentIndex > -1;
}

function addClass(e, name) {
	lastCurrent.push(name);
	e.className = lastCurrent.join(" ");
}

function removeClass(e) {
	if (lastCurrent.length > 1) {
		lastCurrent.splice(lastCurrentIndex, 1);
		e.className = lastCurrent.join(" ");
	} else {
		e.className = "";
	}
}

// for remap

function CollectionSet(e, name) {
	e.className = name.length == 1 ? name[0] : name.join(" ");
}

function CollectionAdd(e, name) {
	for (var i = 0, length = name.length; i < length; i++) {
		if (native) {
			e.classList.add(name[i]);
		} else if (!contains(e, name[i])) {
			addClass(e, name[i]);
		}
	}
}

function CollectionRemove(e, name) {
	for (var i = 0, length = name.length; i < length; i++) {
		if (native) {
			e.classList.remove(name[i]);
		} else if (contains(e, name[i])) {
			removeClass(e, name[i]);
		}
	}
}

function CollectionToggle(e, name) {
	for (var i = 0, length = name.length; i < length; i++) {
		if (native) {
			e.classList.toggle(name[i]);
		} else if (contains(e, name[i])) {
			removeClass(e, name[i]);
		} else {
			addClass(e, name[i]);
		}
	}
}

/**
 * @return {boolean}
 */
function CollectionContains(e, name) {
	for (var i = 0, length = name.length; i < length; i++) {
		if (!(native ? e.classList.contains(name[i]) : contains(e, name[i]))) return false;
	}
	return true;
}

// map callback

function map(callback, lst, name) {
	var ignoreName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	lst = (0, _collection2.default)(lst, false);
	if (lst.length) {
		name = getName(name);
		if (name || ignoreName) {
			name = name.split(regSplit);
			for (var i = 0, length = lst.length; i < length; i++) {
				callback(lst[i], name);
			}
		}
	}
}

function mapResult(callback, lst, name, result) {
	lst = (0, _collection2.default)(lst, false);
	if (lst.length) {
		name = getName(name);
		if (name) {
			name = name.split(regSplit);
			for (var i = 0, length = lst.length; i < length; i++) {
				if (callback(lst[i], name) != result) {
					return false;
				}
			}
			return true;
		}
	}
	return false;
}

var ClassName = {
	set: function set(e, name) {
		map(CollectionSet, e, name, true);
		return ClassName;
	},
	add: function add(e, name) {
		map(CollectionAdd, e, name);
		return ClassName;
	},
	remove: function remove(e, name) {
		map(CollectionRemove, e, name);
		return ClassName;
	},
	toggle: function toggle(e, name) {
		map(CollectionToggle, e, name);
		return ClassName;
	},
	has: function has(e, name) {
		var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		var result = mapResult(CollectionContains, e, name, true);
		result && callback && callback(e);
		return result;
	},
	not: function not(e, name) {
		var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		var result = mapResult(CollectionContains, e, name, false);
		result && callback && callback(e);
		return result;
	},
	dispatch: function dispatch(e, value) {
		var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		var m = String(value).match(reg);
		if (m) {
			value = m[2];
			switch (m[1]) {
				case '+':
					return ClassName.add(e, value);
				case '-':
					return ClassName.remove(e, value);
				case '~':
					return ClassName.toggle(e, value);
				case '!':
					return ClassName.not(e, value, callback);
				case '?':
					return ClassName.has(e, value, callback);
				case ':':
					return ClassName.set(e, value);
			}
		}
		return ClassName;
	}
};

exports.default = ClassName;