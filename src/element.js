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

var _attribute = require("./attribute");

var _attribute2 = _interopRequireDefault(_attribute);

var _rvjsTools = require("rvjs-tools");

var _rvjsTools2 = _interopRequireDefault(_rvjsTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RegClassId = /(#|\.)([^#.]+)/g;
var RegReCam = /[A-Z]/g;
var RegCam = /-([a-z])/g;

var DefFunctions = {
	'false': function _false() {
		return false;
	},
	'prevent': function prevent(e) {
		e.preventDefault();
	},
	'prevent-false': function preventFalse(e) {
		e.preventDefault();return false;
	},
	'stop': function stop(e) {
		e.stopPropagation();
	},
	'stop-prevent': function stopPrevent(e) {
		e.stopPropagation();e.preventDefault();
	},
	'stop-prevent-false': function stopPreventFalse(e) {
		e.stopPropagation();e.preventDefault();return false;
	},
	'noop': function noop() {},
	'debug': function debug(e) {
		console.log('Debug event', e.type, e);
	}
};

/**
 * @return {string}
 */
function ReCam(m) {
	return "-" + m.toLowerCase();
}

/**
 * @return {string}
 */
function Cam(a, b) {
	return b.toUpperCase();
}

/**
 * @return {string}
 */
function ToCam(name) {
	return String(name).replace(RegCam, Cam);
}

function RecursiveAbort(name) {
	(0, _rvjsTools.Log)("Warning, recursive %s abort", name);
}

function CreateChild(element, refs, parent, children) {
	if (_rvjsTools2.default.isHtmlNodeElement(element)) {
		if (children.indexOf(element) < 0) {
			children.push(element);
		}

		return children;
	}

	var tof = typeof element === "undefined" ? "undefined" : _typeof(element);

	if (tof === 'string') {
		children.push(document.createTextNode(element));
	} else if (tof === 'function') {
		if (!parent.func) {
			parent.func = [];
		}

		if (parent.func.indexOf(element) < 0) {
			parent.func.push(element);
			element = element();
			if (typeof element !== 'function') {
				CreateChild(element, refs, parent, children);
			}
		} else {
			RecursiveAbort("function");
		}
	} else if (tof === 'object' && element !== null) {
		if (Array.isArray(element)) {
			if (!parent.each) {
				parent.each = [];
			}

			if (parent.each.indexOf(element) < 0) {
				parent.each.push(element);
				for (var i = 0, length = element.length; i < length; i++) {
					CreateChild(element[i], refs, parent, children);
				}
			} else {
				RecursiveAbort("array");
			}
		} else {
			children.push(CreateElement(element, refs, parent));
		}
	}

	return children;
}

function getNameSpace(type, parentNs) {
	if (type === 'svg' || type === 'math') {
		return _attribute.NS[type];
	}
	if (parentNs === _attribute.NS.svg && type === 'foreignObject') {
		return _attribute.NS.html;
	}
	return parentNs || _attribute.NS.html;
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

function Parent(nameSpace, copy) {
	if (arguments.length < 2) {
		copy = { depth: -1 };
	}
	return {
		func: copy.func || [],
		each: copy.each || [],
		self: copy.self || [],
		refs: copy.refs || [],
		depth: copy.depth + 1,
		nameSpace: nameSpace
	};
}

function CreateElement(props, refs, parent) {
	// check recursion
	var recursion = parent.self.indexOf(props) > -1;

	if (typeof props === "string") {
		props = {
			name: props
		};
	} else if (props == null) {
		props = {};
	} else {
		parent.self.push(props);
	}

	var id = props.id || '';
	var classes = [];
	var name = (props.name || 'div').replace(RegClassId, function (m, a, b) {
		if (a === '#') id = b;else classes.push(b);return '';
	});
	if (!name) {
		name = 'div';
	}

	var type = name.toLowerCase();
	var ns = props.nameSpace || getNameSpace(type, parent.nameSpace || 0);
	var pt = Parent(ns, parent);

	var elm = ns === _attribute.NS.html ? document.createElement(name) : document.createElementNS(ns, name);
	var value = void 0;
	var attributes = {};
	var properties = props.props || 0;
	var events = props.events || 0;
	var data = props.data || 0;
	var ref = props.ref || 0;

	if (props.attrs) {
		Object.assign(attributes, props.attrs);
	}

	// class name
	if (props.className) {
		classes.push(getString(props.className));
	}

	if (attributes.className) {
		classes.push(attributes.className);
	}

	if (classes.length) {
		attributes.className = classes.join(" ");
	}

	if (id) {
		attributes.id = getString(id);
	}

	Object.keys(attributes).forEach(function (name) {
		(0, _attribute2.default)(elm, name, attributes[name]);
	});

	if (properties) {
		Object.keys(properties).forEach(function (name) {
			elm[name] = properties[name];
		});
	}

	if (data) {
		Object.keys(data).forEach(function (name) {
			value = data[name];
			if (value != null) {

				if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
					try {
						value = JSON.stringify(value);
					} catch (e) {
						value = '{}';
					}
				}

				if (elm.dataset) {
					elm.dataset[ToCam(name)] = value;
				} else {
					(0, _attribute2.default)(elm, ("data-" + name).replace(RegReCam, ReCam), value);
				}
			}
		});
	}

	if (events) {
		Object.keys(events).forEach(function (name) {

			var event = events[name],
			    tof = typeof event === "undefined" ? "undefined" : _typeof(event);

			if (tof === 'string') {
				tof = 'function';
				event = DefFunctions[event] || DefFunctions.noop;
			}

			// you can use the combined names "keyup keydown" for events
			if (tof === 'function') {
				_evn2.default.add(elm, name, event);
			}
		});
	}

	if (props.style) {
		Element.css(elm, props.style);
	}

	if (parent.depth === 0 && props.parent && _rvjsTools2.default.isHtmlNodeElement(props.parent)) {
		var wrap = props.parent;
		if (props.empty === true) {
			Element.empty(wrap);
		}

		if (!props.prepend || !wrap.firstChild) {
			wrap.appendChild(elm);
		} else {
			wrap.insertBefore(elm, wrap.firstChild);
		}
	}

	if (ref) {
		var tof = typeof ref === "undefined" ? "undefined" : _typeof(ref);
		if (tof === 'string') {
			refs[ref] = elm;
		} else if (tof === 'function') {
			pt.refs.push(ref.bind(ref, elm, refs));
		}
	}

	if (props.text) {
		elm.appendChild(document.createTextNode(getString(props.text)));
	} else if (props.html) {
		try {
			elm.innerHTML = getString(props.html);
		} catch (e) {}
	} else if (props.children) {
		recursion ? RecursiveAbort("element") : CreateChild(props.children, refs, pt, []).forEach(function (node) {
			elm.appendChild(node);
		});
	}

	// assign callback refs
	if (parent.depth === 0 && pt.refs.length) {
		pt.refs.forEach(function (ref) {
			ref();
		});
	}

	return elm;
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
		var refs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		return CreateElement(props, refs, Parent(0));
	},
	append: function append(element, child) {
		var refs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		if (_rvjsTools2.default.isHtmlNodeElement(element)) {

			var ns = _attribute.NS.html,
			    test = '',
			    parent = element;

			while (parent) {
				test = getNameSpace(parent.nodeName.toLowerCase(), '');
				if (test !== ns) {
					ns = test;
					break;
				}
				test = test.parentNode;
			}

			CreateChild(child, refs, Parent(ns), []).forEach(function (node) {
				element.appendChild(node);
			});
		}
		return element;
	},
	clone: function clone(element) {
		var reId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		if (!_rvjsTools2.default.isHtmlNodeElement(element)) {
			return null;
		}

		var clone = element.cloneNode(true);

		function fixIds(e) {
			var node = e.firstChild,
			    id = void 0;
			while (node) {

				if (node.nodeType === 1) {
					id = node.getAttribute("id");
					if (id) {
						if (reId[id]) {
							node.setAttribute("id", reId[id]);
						} else {
							node.removeAttribute("id");
						}
					}
				}

				if (node.firstChild) {
					fixIds(node);
				}

				node = node.nextSibling;
			}
		}

		fixIds(clone);

		return clone;
	},
	empty: function empty(element) {
		var current = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		if (_rvjsTools2.default.isHtmlNodeElement(element)) {
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
			if (current && element.parentNode) {
				element.parentNode.removeChild(element);
			}
		}
	},
	css: function css(element, name, value) {
		element = _collection2.default.make(element);
		if (element.length) {
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
							(0, _style2.default)(elements[i], ToCam(prop), name[prop]);
						}
					}
				} else {
					if (!value && value !== 0) {
						value = '';
					}

					for (var _i = 0, _length = elements.length; _i < _length; _i++) {
						(0, _style2.default)(elements[_i], ToCam(name), value);
					}
				}
			}
		}
		return element;
	}
};

exports.default = Element;