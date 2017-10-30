"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = Collection;

var _isNode = require("./is-node");

var _isNode2 = _interopRequireDefault(_isNode);

var _rvjsTools = require("rvjs-tools");

var _rvjsTools2 = _interopRequireDefault(_rvjsTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ToString = Object.prototype.toString;

/**
 * @return {boolean}
 */
function IsWindow(element) {
	if (window === element) {
		return true;
	}

	var type = ToString.call(element);
	if (type === "[object Window]" || type === "[object DOMWindow]") {
		return true;
	}

	if ('self' in element) {
		//`'self' in element` is true if
		//the property exists on the object _or_ the prototype
		//`element.hasOwnProperty('self')` is true only if
		//the property exists on the object
		var self = void 0,
		    hasSelf = element.hasOwnProperty('self');

		try {
			if (hasSelf) {
				self = element.self;
			}
			delete element.self;
			if (hasSelf) {
				element.self = self;
			}
		} catch (e) {
			//IE 7&8 throw an error when window.self is deleted
			return true;
		}
	}

	return false;
}

function Collection(element) {
	var isWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	if (_rvjsTools2.default.isBrowser && element) {
		if ((0, _isNode2.default)(element)) {
			return [element];
		}

		var type = typeof element === "undefined" ? "undefined" : _typeof(element);
		if (type === "string") {
			return document.querySelectorAll(element);
		}

		if (isWindow && type === "object" && IsWindow(element)) {
			return [element];
		}

		if (Array.isArray(element)) {
			return element;
		}

		type = ToString.call(element);
		if (type === '[object HTMLCollection]' || type === '[object NodeList]') {
			return element;
		}
	}

	return null;
}