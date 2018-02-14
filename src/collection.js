"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rvjsTools = require("rvjs-tools");

var _rvjsTools2 = _interopRequireDefault(_rvjsTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IndexOf = Array.prototype.indexOf;

function Copy(collection, htmlCollection) {
	for (var i = 0, length = htmlCollection.length; i < length; i++) {
		collection.add(htmlCollection[i]);
	}
}

/**
 * @return {boolean}
 */
function FoundCollection(element) {
	if (typeof element.selector !== "string") {
		return false;
	}

	var doc = element.document || {};
	return doc.nodeType === 1 || doc.nodeType === 9;
}

function Fill(collection, element, isWindow) {
	var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	var type = _rvjsTools2.default.getType(element);

	if (type === 'html-node' || isWindow && type === 'window') {
		collection.add(element);
	} else if (type === 'html-collection' || type === 'object' && element instanceof Collection) {
		Copy(collection, element);
	} else if (type === 'array') {
		if (level < 3) {
			for (var i = 0, length = element.length; i < length; i++) {
				Fill(collection, element[i], isWindow, level + 1);
			}
		}
	} else if (type === 'object' && FoundCollection(element)) {
		Copy(collection, element.document.querySelectorAll(element.selector));
	} else if (type === "string") {
		Copy(collection, document.querySelectorAll(element));
	}
}

var Collection = function () {
	function Collection(element) {
		var isWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		_classCallCheck(this, Collection);

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
	}

	_createClass(Collection, [{
		key: "fill",
		value: function fill(element) {
			var isWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			_rvjsTools2.default.isBrowser && element && Fill(this, element, isWindow);
			return this;
		}
	}, {
		key: "forEach",
		value: function forEach(callback) {
			for (var i = 0, length = this.length; i < length; i++) {
				callback(this[i], i);
			}
			return this;
		}
	}, {
		key: "map",
		value: function map(callback) {
			var remap = new Collection();
			for (var i = 0, length = this.length, element; i < length; i++) {
				element = callback(this[i], i);
				if (_rvjsTools2.default.isHtmlNodeElement(element)) {
					remap.add(element);
				}
			}
			return remap;
		}

		/**
   * Get collection instance
   *
   * @param element
   * @param isWindow
   * @returns {Collection}
   */

	}], [{
		key: "make",
		value: function make(element, isWindow) {
			if (arguments.length > 0) {
				if (element instanceof Collection) {
					return element;
				} else {
					return new Collection(element, isWindow);
				}
			} else {
				return new Collection();
			}
		}
	}]);

	return Collection;
}();

exports.default = Collection;