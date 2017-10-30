"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (selector) {
	var rules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	if ((typeof selector === "undefined" ? "undefined" : _typeof(selector)) === 'object') {
		Object.keys(selector).forEach(function (name) {
			addCSSRule(name, selector[name]);
		});
	} else {
		addCSSRule(selector, rules);
	}
};

var _rvjsTools = require("rvjs-tools");

var _rvjsTools2 = _interopRequireDefault(_rvjsTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DOM_SHEET = void 0,
    index = 0,
    addCSSRule = function addCSSRule(selector, rules) {};

if (_rvjsTools2.default.isBrowser) {
	// add stylesheets
	DOM_SHEET = function (style) {
		style.appendChild(document.createTextNode("")); // WebKit hack :(
		document.head.appendChild(style);
		return style.sheet;
	}(document.createElement("style"));

	if ("insertRule" in DOM_SHEET) {
		addCSSRule = function addCSSRule(selector, rules) {
			DOM_SHEET.insertRule(selector + "{" + rules + "}", index++);
		};
	} else if ("addRule" in DOM_SHEET) {
		addCSSRule = function addCSSRule(selector, rules) {
			DOM_SHEET.addRule(selector, rules, index++);
		};
	}
}