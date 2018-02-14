"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _evn = require("./evn");

var _evn2 = _interopRequireDefault(_evn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Page = {};

if (typeof window !== "undefined" && window.document && window.navigator) {
	var getViewportWidth = function getViewportWidth() {
		return (document.compatMode || isIE) && !isOpera ? document.compatMode == 'CSS1Compat' ? DocElem.clientWidth : Body.clientWidth : (document.parentWindow || document.defaultView).innerWidth;
	};

	var getViewportHeight = function getViewportHeight() {
		return (document.compatMode || isIE) && !isOpera ? document.compatMode == 'CSS1Compat' ? DocElem.clientHeight : Body.clientHeight : (document.parentWindow || document.defaultView).innerHeight;
	};

	var Body = {};
	var DocElem = document.documentElement;
	var GetBody = function GetBody() {
		return document.body;
	};

	var ua = navigator.userAgent.toLowerCase();
	var isOpera = ua.indexOf('opera') > -1;
	var isIE = !isOpera && ua.indexOf('msie') > -1;

	if (GetBody()) {
		Body = GetBody();
	} else {
		_evn2.default.ready(function () {
			Body = GetBody();
		});
	}

	Page = {
		get width() {
			return window.innerWidth || Body.clientWidth;
		},

		get height() {
			return window.innerHeight || Body.clientHeight;
		},

		get top() {
			return (window.pageYOffset || DocElem.scrollTop || Body.scrollTop) - (DocElem.clientTop || Body.clientTop || 0);
		},

		get left() {
			return (window.pageXOffset || DocElem.scrollLeft || Body.scrollLeft) - (DocElem.clientLeft || Body.clientLeft || 0);
		},

		get viewportWidth() {
			return Math.max(document.compatMode != 'CSS1Compat' ? Body.scrollWidth : DocElem.scrollWidth, getViewportWidth());
		},

		get viewportHeight() {
			return Math.max(document.compatMode != 'CSS1Compat' ? Body.scrollHeight : DocElem.scrollHeight, getViewportHeight());
		},

		all: function all() {
			var self = this;
			return {
				width: self.width,
				height: self.height,
				viewportWidth: self.viewportWidth,
				viewportHeight: self.viewportHeight,
				left: self.left,
				top: self.top
			};
		}
	};
}

exports.default = Page;