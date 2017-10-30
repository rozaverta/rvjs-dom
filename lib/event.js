import Collection from "./collection";

const adding = 'addEventListener', removing = 'removeEventListener';
const reg = /\s+/g;

function noop() {}

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
	for(let i = 0, length = collection.length; i < length; i++)
	{
		bind(collection[i], event, callback, func)
	}
}

function bindEvents(collection, events, callback, func)
{
	for(let i = 0, j, node, ln = events.length, length = collection.length; i < length; i++)
	{
		node = collection[i];
		if( node[func] )
		{
			for(j = 0; j < ln; j++)
			{
				node[func](events[j], callback, false)
			}
		}
	}
}

function bindWindow(name, callback)
{
	if( bind(window, name, callback, adding) )
	{
		callback && callback( () => { bind(window, name, callback, removing) } )
	}
	else if( callback )
	{
		callback(noop)
	}
}

function make(collection, event, callback, func)
{
	collection = Collection(collection);
	if( collection && collection.length )
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
		bindWindow('resize', callback, remove);
		return Evn;
	},

	scroll(callback, remove = null)
	{
		bindWindow('scroll', callback, remove);
		return Evn;
	},

	on(name, callback, remove = null)
	{
		bindWindow(name, callback, remove);
		return Evn;
	},

	hover(element, enter, leave, remove = null)
	{
		element = Collection(element);
		if( element && element.length )
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
	}
};

export default Evn;