import IsNode from "./is-node";
import Evn from "./event";
import Collection from "./collection";
import Item from "./item";
import Style from "./style";

const regClassId = /(#|\.)([^#.]+)/g;
let cssNumber = {};

('animationIterationCount,columnCount,fillOpacity,flexGrow,flexShrink,fontWeight,lineHeight,opacity,order,orphans,widows,zIndex,zoom').split(',').forEach(n => { cssNumber[n] = true });

function appendChild(elm, child)
{
	if( !IsNode(child) )
	{
		let tof = typeof child;
		if( tof === 'string' ) {
			child = document.createTextNode(child);
		}
		else if( tof === 'function' ) {
			child = child();
			if( ! IsNode(child) ) {
				return
			}
		}
		else if( tof === 'object' && tof !== null ) {
			child = Element.create(child);
		}
		else return;
	}
	elm.appendChild(child)
}

const Element = {

	byId( id )
	{
		return document.getElementById( id )
	},

	byQueryOne( query, element = null )
	{
		if( !element ) {
			element = document
		}
		return element.querySelector ? element.querySelector(query) : element.querySelectorAll(query)[0] || null
	},

	byQuery( query, element = null )
	{
		if( !element ) {
			element = document
		}
		return element.querySelectorAll( query )
	},

	byClassName( name )
	{
		return document.getElementsByClassName( name )
	},

	byTag( name )
	{
		return document.getElementsByTagName( name )
	},

	byName( name )
	{
		return document.getElementsByName( name )
	},

	item( element )
	{
		return Item( typeof element == 'string' ? Element.byId(element) : element )
	},

	create( props )
	{
		props = props || {};

		if( typeof props === "string" ) {
			props = {
				name: props
			}
		}

		let classes = [];
		let name = (props.name || 'div').replace(regClassId, (m, a, b) => { if( a == '#' ) props.id = b; else classes.push(b); return '' });
		let elm = props.nameSpace ? document.createElementNS(props.nameSpace, name) : document.createElement(name);
		let keys = [], value;
		let attributes = props.attrs || 0;
		let properties = props.props || 0;
		let events = props.events || 0;
		let data = props.data || 0;

		// class name
		if( props.className )
		{
			classes.push(props.className);
		}

		if( classes.length )
		{
			elm.className = classes.join(" ");
		}

		if( props.id )
		{
			elm.setAttribute('id', props.id)
		}

		if( properties )
		{
			keys = Object.keys(properties);
			keys.forEach(name => {
				elm[name] = properties[name]
			})
		}

		if( attributes )
		{
			keys = Object.keys(attributes);
			keys.forEach(name => {
				elm.setAttribute( name, String( attributes[name] || '' ) )
			})
		}

		if( data )
		{
			keys = Object.keys(data);
			keys.forEach(name => {
				value = data[name];
				if( value !== null && value !== undefined ) {
					if( typeof value == "object" ) {
						try { value = JSON.stringify(value) }
						catch(e) { value = '{}' }
					}
					elm.dataset[name] = value;
				}
			})
		}

		if( events )
		{
			keys = Object.keys(events);
			keys.forEach((name) => {
				Evn.add( elm, name, events[name] )
			})
		}

		if( props.style )
		{
			Element.css( elm, props.style )
		}

		if( props.parent !== undefined && props.parent.nodeType )
		{
			let parent = props.parent;
			if( !props.prepend || !parent.firstChild ) {
				parent.appendChild(elm)
			}
			else {
				parent.insertBefore(elm, parent.firstChild)
			}
		}

		if( props.text )
		{
			elm.appendChild(
				document.createTextNode(String(props.text))
			)
		}
		else if( props.html )
		{
			try {
				elm.innerHTML = String(props.html)
			}
			catch(e) {}
		}
		else if( props.children && Array.isArray(props.children) )
		{
			props.children.forEach(child => {
				appendChild(elm, child)
			})
		}
		else if( props.child )
		{
			appendChild(elm, props.child)
		}

		return elm
	},

	css(element, name, value)
	{
		if( element = Collection(element) && element.length )
		{
			let i, elem, elements = [];

			for( i = 0; i < element.length; i++ )
			{
				if( (elem = element[i]) && elem.nodeType !== 3 && elem.nodeType !== 8 && elem.style )
				{
					elements[elements.length] = elem
				}
			}

			if( elements.length )
			{
				if( typeof name == 'object' && arguments.length < 3 )
				{
					for( let n = 0, keys = Object.keys(name), prop, keysLength = keys.length, length = elements.length; n < keysLength; n++ )
					{
						prop = keys[n];
						for( i = 0; i < length; i++ )
						{
							Style(elements[i], prop, name[prop]);
						}
					}
				}
				else
				{
					name = String(name);
					if( ! value && value !== 0 )
					{
						value = ''
					}

					for( let i = 0, length = elements.length; i < length; i++ )
					{
						Style(elements[i], name, value);
					}
				}
			}

			return element
		}
		else
		{
			return []
		}
	},

	forEach(element, callback)
	{
		if(element = Collection(element) && element.length)
		{
			Array.prototype.forEach.call(element, callback);
			return element
		}
		else
		{
			return []
		}
	},

	empty(element)
	{
		if( element.firstChild )
		{
			try {
				element.innerHTML = '';
			}
			catch(e) {
				while(element.firstChild) {
					element.removeChild( element.firstChild )
				}
			}
		}

		return element;
	}
};

export default Element;