'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _rvjsTools = require('rvjs-tools');

var _rvjsTools2 = _interopRequireDefault(_rvjsTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IndexOf = Array.prototype.indexOf;

function Copy(collection, htmlCollection) {
	for (var i = 0, length = htmlCollection.length; i < length; i++) {
		collection.add(htmlCollection[i]);
	}
}

function Fill(collection, element, isWindow) {
	var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	var type = _rvjsTools2.default.getType(element);

	if (type === 'html-node' || isWindow && type === 'window') {
		collection.add(element);
	} else if (type === 'html-collection' || type === 'object' && element instanceof HtmlArrayCollection) {
		Copy(collection, element);
	} else if (type === 'array') {
		if (level < 3) {
			for (var i = 0, length = element.length; i < length; i++) {
				Fill(collection, element[i], isWindow, level + 1);
			}
		}
	} else if (type === "string") {
		Copy(collection, document.querySelectorAll(element));
	}
}

/**
 *
 * @param element
 * @param isWindow
 * @returns {HtmlArrayCollection}
 * @constructor
 */
function HtmlArrayCollection(element, isWindow) {
	if (arguments.length > 0) {
		if (element instanceof HtmlArrayCollection) {
			return element;
		} else {
			return new HtmlArrayCollection(element, isWindow);
		}
	} else {
		return new HtmlArrayCollection();
	}
}

HtmlArrayCollection.prototype.constructor = function (element) {
	var isWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	var self = this,
	    length = 0;

	if ('defineProperties' in Object) {
		Object.defineProperties(self, {
			length: {
				get: function get() {
					return length;
				}
			},
			add: {
				value: function value(htmlElement) {
					if (IndexOf.call(self, htmlElement) < 0) self[length++] = htmlElement;
				}
			}
		});
	} else {
		self.length = 0;
		self.add = function (htmlElement) {
			if (IndexOf.call(self, htmlElement) < 0) {
				self[length++] = htmlElement;
				self.length = length;
			}
		};
	}

	if (arguments.length) {
		self.fill(element, isWindow);
	}
};

HtmlArrayCollection.prototype.fill = function (element) {
	var isWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	_rvjsTools2.default.isBrowser && element && Fill(this, element, isWindow);
};

HtmlArrayCollection.prototype.forEach = function (callback) {
	for (var i = 0, length = this.length; i < length; i++) {
		callback(this[i], i);
	}
};

HtmlArrayCollection.prototype.map = function (callback) {
	var remap = new HtmlArrayCollection();
	for (var i = 0, length = this.length, element; i < length; i++) {
		element = callback(this[i], i);
		if (_rvjsTools2.default.isHtmlNodeElement(element)) {
			remap.add(element);
		}
	}
	return remap;
};

exports.default = HtmlArrayCollection;