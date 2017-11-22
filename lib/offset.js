import Page from "./page";

let offset;

function getStyle(el) {

	// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
	// IE throws on elements created in popups
	// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
	let view = el.ownerDocument.defaultView;

	if ( !view || !view.opener ) {
		view = window;
	}

	return view.getComputedStyle(el);
}

function isFixed(el) {
	while( el && el.nodeName.toLowerCase() !== 'body') {
		if( getStyle(el).getPropertyValue('position').toLowerCase() === 'fixed' ) return true;
		el = el.parentElement;
	}
	return false;
}

if( typeof document !== "undefined" && document.createElement("span").getBoundingClientRect ) {

	offset = function(element, fixed = false)
	{
		let box = element.getBoundingClientRect(),
			ref = {
				top:    Math.round( box.top ),
				left:   Math.round( box.left ),
				width:  box.right  - box.left,
				height: box.bottom - box.top
			};

		if( !fixed ) {
			ref.top  += Page.top;
			ref.left += Page.left;
		}

		return ref
	}
}
else {

	offset = function(element, fixed = false)
	{
		let top = 0, left = 0;

		while(element) {
			top  += element.offsetTop;
			left += element.offsetLeft;
			element = element.offsetParent
		}

		if( fixed ) {
			top  -= Page.top;
			left -= Page.left;
		}

		return {
			top:    Math.round(top),
			left:   Math.round(left),
			width:  element.offsetWidth,
			height: element.offsetHeight
		}
	}
}

export default function (element, fixed = false) {
	if( element && element.nodeType === 1 ) {
		let auto = fixed === 'auto';

		if( auto ) {
			try {
				fixed = isFixed(element);
			}
			catch(e) {
				fixed = false
			}
		}

		let obj = offset(element, fixed);
		if( auto ) {
			obj.fixed = fixed
		}

		return obj
	}
	else {
		return {
			width: 0, height: 0, top: 0, left: 0
		}
	}
}