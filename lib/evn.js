import Collection from "./collection";

const adding = 'addEventListener', removing = 'removeEventListener';
const reg = /\s+/g;
const isWin = typeof window !== 'undefined' && 'setTimeout' in window;

// -- READY DOM

let docIsReady = false;
let docCall = [];

function docLoad()
{
	if( ! docIsReady ) {
		detach();
		docIsReady = true
	}

	for( let i = 0, len = docCall.length; i < len; i++ ) {
		try {
			docCall[i]()
		}
		catch(e) { console.log("Fatal ready callback error", e) }
	}

	docCall = []
}

function detach()
{
	if ( document[adding] ) {
		document[removing]( "DOMContentLoaded", docLoad );
		window[removing]( "load", docLoad );
	}
	else {
		document.detachEvent( "onreadystatechange", docLoad );
		window.detachEvent( "onload", docLoad );
	}
}

if( isWin && typeof document !== "undefined" )
{
	if( document.readyState === "complete" || ( document.readyState !== "loading" && ! document.documentElement.doScroll ) ) {
		setTimeout( docLoad, 0 )
	}

	else if ( document[adding] ) {
		document[adding]( "DOMContentLoaded", docLoad );
		window[adding]( "load", docLoad )
	}

	else {
		document.attachEvent( "onreadystatechange", docLoad );
		window.attachEvent( "onload", docLoad );

		// If IE and not a frame
		// continually check to see if the document is ready
		let top = false;

		try {
			top = window.frameElement === null && document.documentElement;
		} catch ( e ) {}

		if ( top && top.doScroll ) {
			( function doScrollCheck() {
				if ( !docIsReady ) {

					try { top.doScroll( "left" ); }
					catch ( e ) { return window.setTimeout( doScrollCheck, 50 ) }

					docLoad();
				}
			} )();
		}
	}
}

// -- /READY

let support = {
	touch: isWin && 'ontouchstart' in window,
	orientationChange: isWin && 'orientationchange' in window,
	passive: false
};

try {
	let opts = Object.defineProperty({}, 'passive', {
		get: function() {
			support.passive = true;
		}
	});
	window[adding]("testPassive", null, opts);
	window[removing]("testPassive", null, opts);
} catch (e) {}

// -- EVENTS CALLBACK

function noop() {}

function tap(items, func)
{
	for( let i = 0, length = items.length; i < length; i++ ) {
		if( func(items[i]) === false ) {
			return false
		}
	}
	return true
}

function getName( name )
{
	return Array.isArray(name) ? name : String(name).split(reg)
}

function bind(element, event, callback, func)
{
	if( element[func] )
	{
		element[func](event, callback, false);
		return true
	}
	else
	{
		return false
	}
}

function bindEvent(collection, event, callback, func)
{
	tap(collection, element => bind(element, event, callback, func))
}

function bindEvents(collection, events, callback, func)
{
	tap(collection, element => element[func] && tap(events, event => { element[func](event, callback, false) }))
}

function bindWindow(name, callback, remove_callback)
{
	if( isWin && tap(name, n => bind(window, n, callback, adding)) )
	{
		remove_callback && remove_callback( () => { tap(name, n => bind(window, n, callback, removing)) } )
	}
	else if( remove_callback )
	{
		remove_callback(noop)
	}
}

function make(collection, event, callback, func)
{
	collection = Collection.make(collection);
	if( collection.length )
	{
		event = getName(event);
		if( event.length > 1 )
		{
			bindEvents(collection, event, callback, func)
		}
		else if( event.length )
		{
			bindEvent(collection, event[0], callback, func)
		}
	}
}

const Evn = {

	support,

	native( add, element, name, callback, capture = false )
	{
		let func = add === true || add === 'add' ? adding : removing;
		if( element && typeof callback === 'function' && func in element ) {
			element[func](name, callback, capture)
		}
		return Evn;
	},

	add(element, name, callback)
	{
		make(element, name, callback, adding);
		return Evn;
	},

	remove(element, name, callback)
	{
		make(element, name, callback, removing);
		return Evn;
	},

	resize(callback, remove = null)
	{
		bindWindow(support.orientationChange ? ['resize', 'orientationchange'] : ['resize'], callback, remove);
		return Evn;
	},

	scroll(callback, remove = null)
	{
		bindWindow(['scroll'], callback, remove);
		return Evn;
	},

	on(name, callback, remove = null)
	{
		bindWindow(getName(name), callback, remove);
		return Evn;
	},

	hover(element, enter, leave, remove = null)
	{
		element = Collection.make(element);
		if( element.length )
		{
			bindEvent(element, 'mouseenter', enter, adding);
			bindEvent(element, 'mouseleave', leave, adding);
			remove && remove(() => {
				bindEvent(element, 'mouseenter', enter, removing);
				bindEvent(element, 'mouseleave', leave, removing);
			})
		}
		else if(remove)
		{
			remove(noop)
		}
		return Evn;
	},

	ready( callback )
	{
		if( typeof callback === 'function' ) {
			if( docIsReady ) setTimeout( callback, 0 );
			else if( docCall.indexOf(callback) < 0 ) docCall.push( callback );
		}
		return Evn
	}
};

export default Evn;