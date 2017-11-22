'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (element) {
	var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	if (element && element.nodeType === 1) {
		var auto = fixed === 'auto';

		if (auto) {
			try {
				fixed = isFixed(element);
			} catch (e) {
				fixed = false;
			}
		}

		var obj = offset(element, fixed);
		if (auto) {
			obj.fixed = fixed;
		}

		return obj;
	} else {
		return {
			width: 0, height: 0, top: 0, left: 0
		};
	}
};

var _page = require('./page');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var offset = void 0;

function getStyle(el) {

	// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
	// IE throws on elements created in popups
	// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
	var view = el.ownerDocument.defaultView;

	if (!view || !view.opener) {
		view = window;
	}

	return view.getComputedStyle(el);
}

function isFixed(el) {
	while (el && el.nodeName.toLowerCase() !== 'body') {
		if (getStyle(el).getPropertyValue('position').toLowerCase() === 'fixed') return true;
		el = el.parentElement;
	}
	return false;
}

if (typeof document !== "undefined" && document.createElement("span").getBoundingClientRect) {

	offset = function offset(element) {
		var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var box = element.getBoundingClientRect(),
		    ref = {
			top: Math.round(box.top),
			left: Math.round(box.left),
			width: box.right - box.left,
			height: box.bottom - box.top
		};

		if (!fixed) {
			ref.top += _page2.default.top;
			ref.left += _page2.default.left;
		}

		return ref;
	};
} else {

	offset = function offset(element) {
		var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var top = 0,
		    left = 0;

		while (element) {
			top += element.offsetTop;
			left += element.offsetLeft;
			element = element.offsetParent;
		}

		if (fixed) {
			top -= _page2.default.top;
			left -= _page2.default.left;
		}

		return {
			top: Math.round(top),
			left: Math.round(left),
			width: element.offsetWidth,
			height: element.offsetHeight
		};
	};
}