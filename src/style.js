"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Style;

var cssNumber = {};
var cssProp = { "float": "cssFloat" };

'animationIterationCount,columnCount,fillOpacity,flexGrow,flexShrink,fontWeight,lineHeight,opacity,order,orphans,widows,zIndex,zoom'.split(',').forEach(function (n) {
	cssNumber[n] = true;
});

var regExpCustomProp = /^--/;
var emptyStyle = typeof document !== 'undefined' ? document.createElement("div").style : {};
var cssPrefixes = ["Webkit", "Moz", "Khtml", "ms"];

function styleName(name) {
	var ret = cssProp[name];
	if (!ret) {
		ret = cssProp[name] = vendorStyleName(name) || name;
	}
	return ret;
}

function vendorStyleName(name) {
	// Shortcut for names that are not vendor prefixed
	if (name in emptyStyle) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
	    i = cssPrefixes.length;

	while (i--) {
		name = cssPrefixes[i] + capName;
		if (name in emptyStyle) {
			return name;
		}
	}
}

function Style(element, name, value) {
	if (regExpCustomProp.test(name)) {
		element.style.setProperty(name, value);
	} else {
		name = styleName(name);
		if (!value && value !== 0) {
			value = '';
		} else {
			value += typeof value === "number" && !cssNumber[name] ? 'px' : '';
		}

		element.style[name] = value;
	}
};