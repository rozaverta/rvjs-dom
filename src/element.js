"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _evn = require("./evn");

var _evn2 = _interopRequireDefault(_evn);

var _collection = require("./collection");

var _collection2 = _interopRequireDefault(_collection);

var _style = require("./style");

var _style2 = _interopRequireDefault(_style);

var _rvjsTools = require("rvjs-tools");

var _rvjsTools2 = _interopRequireDefault(_rvjsTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regClassId = /(#|\.)([^#.]+)/g;
var cssNumber = {};

'animationIterationCount,columnCount,fillOpacity,flexGrow,flexShrink,fontWeight,lineHeight,opacity,order,orphans,widows,zIndex,zoom'.split(',').forEach(function (n) {
	cssNumber[n] = true;
});

function appendChild(elm, child) {
	if (!_rvjsTools2.default.isHtmlNodeElement(child)) {
		var tof = typeof child === "undefined" ? "undefined" : _typeof(child);
		if (tof === 'string') {
			child = document.createTextNode(child);
		} else if (tof === 'function') {
			child = child();
			if (!_rvjsTools2.default.isHtmlNodeElement(child)) {
				return;
			}
		} else if (tof === 'object' && tof !== null) {
			child = Element.create(child);
		} else return;
	}
	elm.appendChild(child);
}

/**
 * @return {string}
 */
function getString(text) {
	if (typeof text === 'function') {
		text = text();
	}
	return String(text);
}

var Element = {
	byId: function byId(id) {
		return document.getElementById(id);
	},
	byQueryOne: function byQueryOne(query) {
		var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		if (!element) {
			element = document;
		}
		return element.querySelector ? element.querySelector(query) : element.querySelectorAll(query)[0] || null;
	},
	byQuery: function byQuery(query) {
		var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		if (!element) {
			element = document;
		}
		return element.querySelectorAll(query);
	},
	byClassName: function byClassName(name) {
		return document.getElementsByClassName(name);
	},
	byTag: function byTag(name) {
		return document.getElementsByTagName(name);
	},
	byName: function byName(name) {
		return document.getElementsByName(name);
	},
	create: function create(props) {
		props = props || {};

		if (typeof props === "string") {
			props = {
				name: props
			};
		}

		var classes = [];
		var name = (props.name || 'div').replace(regClassId, function (m, a, b) {
			if (a == '#') props.id = b;else classes.push(b);return '';
		});
		var elm = props.nameSpace ? document.createElementNS(props.nameSpace, name) : document.createElement(name);
		var keys = [],
		    value = void 0;
		var attributes = props.attrs || 0;
		var properties = props.props || 0;
		var events = props.events || 0;
		var data = props.data || 0;

		// class name
		if (props.className) {
			classes.push(props.className);
		}

		if (classes.length) {
			elm.className = classes.join(" ");
		}

		if (props.id) {
			elm.setAttribute('id', props.id);
		}

		if (properties) {
			keys = Object.keys(properties);
			keys.forEach(function (name) {
				elm[name] = properties[name];
			});
		}

		if (attributes) {
			keys = Object.keys(attributes);
			keys.forEach(function (name) {
				elm.setAttribute(name, String(attributes[name] || ''));
			});
		}

		if (data) {
			keys = Object.keys(data);
			keys.forEach(function (name) {
				value = data[name];
				if (value !== null && value !== undefined) {
					if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
						try {
							value = JSON.stringify(value);
						} catch (e) {
							value = '{}';
						}
					}
					elm.dataset[name] = value;
				}
			});
		}

		if (events) {
			keys = Object.keys(events);
			keys.forEach(function (name) {
				_evn2.default.add(elm, name, events[name]);
			});
		}

		if (props.style) {
			Element.css(elm, props.style);
		}

		if (props.parent !== undefined && props.parent.nodeType) {
			var parent = props.parent;
			if (!props.prepend || !parent.firstChild) {
				parent.appendChild(elm);
			} else {
				parent.insertBefore(elm, parent.firstChild);
			}
		}

		if (props.text) {
			elm.appendChild(document.createTextNode(getString(props.text)));
		} else if (props.html) {
			try {
				elm.innerHTML = getString(props.html);
			} catch (e) {}
		} else if (props.children && Array.isArray(props.children)) {
			props.children.forEach(function (child) {
				appendChild(elm, child);
			});
		} else if (props.child) {
			appendChild(elm, props.child);
		}

		return elm;
	},
	css: function css(element, name, value) {
		if (element = _collection2.default.make(element) && element.length) {
			var i = void 0,
			    elem = void 0,
			    elements = [];

			for (i = 0; i < element.length; i++) {
				if ((elem = element[i]) && elem.nodeType !== 3 && elem.nodeType !== 8 && elem.style) {
					elements[elements.length] = elem;
				}
			}

			if (elements.length) {
				if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === 'object' && arguments.length < 3) {
					for (var n = 0, keys = Object.keys(name), prop, keysLength = keys.length, length = elements.length; n < keysLength; n++) {
						prop = keys[n];
						for (i = 0; i < length; i++) {
							(0, _style2.default)(elements[i], prop, name[prop]);
						}
					}
				} else {
					name = String(name);
					if (!value && value !== 0) {
						value = '';
					}

					for (var _i = 0, _length = elements.length; _i < _length; _i++) {
						(0, _style2.default)(elements[_i], name, value);
					}
				}
			}

			return element;
		} else {
			return [];
		}
	}
};

exports.default = Element;