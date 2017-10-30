'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var tof = typeof Node === 'undefined' ? 'undefined' : _typeof(Node);
var isNodeNative = tof === 'object';

if (!isNodeNative && tof === 'function' && typeof document !== "undefined") {
	isNodeNative = document.createElement("span") instanceof Node;
}

var IsNode = isNodeNative ? function (object) {
	return object instanceof Node;
} : function (object) {
	return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string";
};

exports.default = IsNode;