'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _className2 = require('./class-name');

var _className3 = _interopRequireDefault(_className2);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var inline = 'B,BIG,I,SMALL,TT,ABBR,ACRONYM,CITE,CODE,DFN,EM,KBD,STRONG,SAMP,TIME,VAR,A,BDO,BR,IMG,MAP,OBJECT,Q,SCRIPT,SPAN,SUB,SUP,BUTTON,INPUT,LABEL,SELECT,TEXTAREA'.split(',');

function getStyles(element) {
	var view = element.ownerDocument.defaultView;

	if (!view || !view.opener) {
		view = window;
	}

	return view.getComputedStyle(element);
}

var Item = function () {
	function Item(element) {
		_classCallCheck(this, Item);

		var display = element.style.display || '',
		    show = function show() {
			element.style.display = display;
			return this;
		};

		if (display == 'none') {
			display = '';
		}

		if (!display) {
			var cssDisplay = getStyles(element).getPropertyValue('display');
			if (cssDisplay && cssDisplay !== 'none') {
				display = cssDisplay;
			} else {
				display = inline.indexOf((element.tagName || '').toUpperCase()) > 0 ? 'inline' : 'block';
			}
		}

		Object.defineProperty(this, 'element', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: element
		});

		this.show = show.bind(this);
	}

	_createClass(Item, [{
		key: 'on',
		value: function on(event, callback) {
			_event2.default.add(this.element, event, callback);
			return this;
		}
	}, {
		key: 'off',
		value: function off(event, callback) {
			_event2.default.remove(this.element, event, callback);
			return this;
		}
	}, {
		key: 'attr',
		value: function attr(name, value) {
			if (arguments.length < 2) {
				return this.element.getAttribute(name);
			} else if (value === null) {
				this.element.removeAttribute(name);
			} else {
				this.element.setAttribute(name, value);
			}
			return this;
		}
	}, {
		key: 'data',
		value: function data(name, value) {
			if (arguments.length < 2) {
				return this.element.dataset[name];
			} else if (value === null) {
				delete this.element.dataset[name];
			} else {
				this.element.dataset[name] = value;
			}
			return this;
		}
	}, {
		key: 'value',
		value: function value(_value) {
			if (arguments.length < 1) {
				return this.element.value || "";
			}

			this.element.value = String(_value);
			return this;
		}
	}, {
		key: 'property',
		value: function property(name, value) {
			if (arguments.length < 2) {
				try {
					delete this.element[name];
				} catch (e) {}
			} else {
				this.element[name] = value;
			}

			return this;
		}
	}, {
		key: 'disable',
		value: function disable() {
			this.element.disabled = true;
			return this;
		}
	}, {
		key: 'enable',
		value: function enable() {
			this.element.disabled = false;
			return this;
		}
	}, {
		key: 'hide',
		value: function hide() {
			this.element.style.display = 'none';
			return this;
		}
	}, {
		key: 'style',
		value: function style(name, value) {
			if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) == 'object' && arguments.length < 2) {
				for (var i = 0, keys = Object.keys(name), length = keys.length; i < length; i++) {
					(0, _style2.default)(this.element, keys[i], name[keys[i]]);
				}
			} else {
				(0, _style2.default)(this.element, String(name), value);
			}
			return this;
		}
	}, {
		key: 'className',
		value: function className(_className, callback) {
			_className3.default.dispatch(this.element, _className, callback);
			return this;
		}
	}]);

	return Item;
}();

exports.default = Item;