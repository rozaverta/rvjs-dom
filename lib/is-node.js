
let tof = typeof Node;
let isNodeNative = tof === 'object';

if( ! isNodeNative && tof === 'function' && typeof document !== "undefined" ) {
	isNodeNative = document.createElement("span") instanceof Node;
}

const IsNode = isNodeNative
	? object => object instanceof Node
	: object => object && typeof object === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string";

export default IsNode