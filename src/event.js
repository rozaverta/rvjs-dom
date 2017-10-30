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

function noop() {}

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
	for (var i = 0, length = collection.length; i < length; i++) {
		bind(collection[i], event, callback, func);
	}
}

function bindEvents(collection, events, callback, func) {
	for (var i = 0, j, node, ln = events.length, length = collection.length; i < length; i++) {
		node = collection[i];
		if (node[func]) {
			for (j = 0; j < ln; j++) {
				node[func](events[j], callback, false);
			}
		}
	}
}

function bindWindow(name, callback) {
	if (bind(window, name, callback, adding)) {
		callback && callback(function () {
			bind(window, name, callback, removing);
		});
	} else if (callback) {
		callback(noop);
	}
}

function make(collection, event, callback, func) {
	collection = (0, _collection2.default)(collection);
	if (collection && collection.length) {
		event = getName(event);
		if (event.length > 1) {
			bindEvents(collection, event, callback, func);
		} else if (event.length) {
			bindEvent(collection, event[0], callback, func);
		}
	}
}

var Evn = {
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

		bindWindow('resize', callback, remove);
		return Evn;
	},
	scroll: function scroll(callback) {
		var remove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		bindWindow('scroll', callback, remove);
		return Evn;
	},
	on: function on(name, callback) {
		var remove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		bindWindow(name, callback, remove);
		return Evn;
	},
	hover: function hover(element, enter, leave) {
		var remove = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		element = (0, _collection2.default)(element);
		if (element && element.length) {
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
	}
};

exports.default = Evn;