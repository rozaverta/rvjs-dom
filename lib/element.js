
import Evn from "./evn";
import Collection from "./collection";
import Style from "./style";
import Attribute, {NS} from "./attribute";
import Tools, {Log} from "rvjs-tools";

const RegClassId = /(#|\.)([^#.]+)/g;
const RegReCam = /[A-Z]/g;
const RegCam = /-([a-z])/g;

const DefFunctions = {
	'false': () => false,
	'prevent': e => { e.preventDefault() },
	'prevent-false': e => { e.preventDefault(); return false },
	'stop': e => { e.stopPropagation(); },
	'stop-prevent': e => { e.stopPropagation(); e.preventDefault() },
	'stop-prevent-false': e => { e.stopPropagation(); e.preventDefault(); return false },
	'noop': () => {},
	'debug': e => { console.log('Debug event', e.type, e) }
};

/**
 * @return {string}
 */
function ReCam(m) {
	return "-" + m.toLowerCase()
}

/**
 * @return {string}
 */
function Cam(a, b) {
	return b.toUpperCase()
}

/**
 * @return {string}
 */
function ToCam(name) {
	return String(name).replace(RegCam, Cam)
}

function RecursiveAbort(name)
{
	Log("Warning, recursive %s abort", name)
}

function CreateChild(element, refs, parent, children)
{
	if(Tools.isHtmlNodeElement(element))
	{
		if( children.indexOf(element) < 0 ) {
			children.push(element)
		}

		return children
	}

	let tof = typeof element;

	if( tof === 'string' ) {
		children.push( document.createTextNode(element) )
	}
	else if( tof === 'function' )
	{
		if(!parent.func) {
			parent.func = []
		}

		if( parent.func.indexOf(element) < 0 ) {
			parent.func.push(element);
			element = element();
			if( typeof element !== 'function' ) {
				CreateChild(element, refs, parent, children)
			}
		}
		else {
			RecursiveAbort("function")
		}
	}
	else if( tof === 'object' && element !== null )
	{
		if(Array.isArray(element)) {
			if(!parent.each) {
				parent.each = []
			}

			if( parent.each.indexOf(element) < 0 ) {
				parent.each.push(element);
				for( let i = 0, length = element.length; i < length; i++ ) {
					CreateChild(element[i], refs, parent, children)
				}
			}
			else {
				RecursiveAbort("array")
			}
		}
		else {
			children.push( CreateElement(element, refs, parent) )
		}
	}

	return children
}

function getNameSpace(type, parentNs)
{
	if( type === 'svg' || type === 'math' ) {
		return NS[type]
	}
	if( parentNs === NS.svg && type === 'foreignObject' ) {
		return NS.html
	}
	return parentNs || NS.html
}

/**
 * @return {string}
 */
function getString( text )
{
	if( typeof text === 'function' ) {
		text = text()
	}
	return String(text)
}

function Parent(nameSpace, copy)
{
	if(arguments.length < 2) {
		copy = {depth: -1}
	}
	return {
		func: copy.func ||[],
		each: copy.each ||[],
		self: copy.self ||[],
		refs: copy.refs ||[],
		depth: copy.depth + 1,
		nameSpace
	}
}

function CreateElement(props, refs, parent)
{
	// check recursion
	let recursion = parent.self.indexOf(props) > -1;

	if( typeof props === "string" ) {
		props = {
			name: props
		}
	}
	else if( props == null ) {
		props = {}
	}
	else {
		parent.self.push(props)
	}

	let id = props.id || '';
	let classes = [];
	let name = (props.name || 'div').replace(RegClassId, (m, a, b) => { if( a === '#' ) id = b; else classes.push(b); return '' });
	if(!name) {
		name = 'div'
	}

	let type = name.toLowerCase();
	let ns = props.nameSpace || getNameSpace(type, parent.nameSpace || 0);
	let pt = Parent(ns, parent);

	let elm = ns === NS.html ? document.createElement(name) : document.createElementNS(ns, name);
	let value;
	let attributes = {};
	let properties = props.props || 0;
	let events = props.events || 0;
	let data = props.data || 0;
	let ref = props.ref || 0;

	if(props.attrs) {
		Object.assign(attributes, props.attrs)
	}

	// class name
	if(props.className) {
		classes.push(getString(props.className));
	}

	if(attributes.className) {
		classes.push(attributes.className);
	}

	if(classes.length) {
		attributes.className = classes.join(" ");
	}

	if(id) {
		attributes.id = getString(id)
	}

	Object.keys(attributes).forEach(name => {
		Attribute(elm, name, attributes[name])
	});

	if( properties )
	{
		Object.keys(properties).forEach(name => {
			elm[name] = properties[name]
		})
	}

	if( data )
	{
		Object.keys(data).forEach(name => {
			value = data[name];
			if( value != null ) {

				if( typeof value === "object" ) {
					try { value = JSON.stringify(value) }
					catch(e) { value = '{}' }
				}

				if(elm.dataset) {
					elm.dataset[ToCam(name)] = value;
				}
				else {
					Attribute(elm, ("data-" + name).replace(RegReCam, ReCam), value)
				}
			}
		})
	}

	if( events )
	{
		Object.keys(events).forEach((name) => {

			let event = events[name],
				tof = typeof event;

			if(tof === 'string') {
				tof = 'function';
				event = DefFunctions[event] || DefFunctions.noop;
			}

			// you can use the combined names "keyup keydown" for events
			if(tof === 'function') {
				Evn.add( elm, name, event )
			}
		})
	}

	if( props.style )
	{
		Element.css( elm, props.style )
	}

	if( parent.depth === 0 && props.parent && Tools.isHtmlNodeElement(props.parent) )
	{
		let wrap = props.parent;
		if(props.empty === true) {
			Element.empty(wrap)
		}

		if( !props.prepend || !wrap.firstChild ) {
			wrap.appendChild(elm)
		}
		else {
			wrap.insertBefore(elm, wrap.firstChild)
		}
	}

	if( ref ) {
		let tof = typeof ref;
		if(tof === 'string') {
			refs[ref] = elm
		}
		else if(tof === 'function') {
			pt.refs.push(ref.bind(ref, elm, refs))
		}
	}

	if( props.text )
	{
		elm.appendChild(
			document.createTextNode(getString(props.text))
		)
	}
	else if( props.html )
	{
		try {
			elm.innerHTML = getString(props.html)
		}
		catch(e) {}
	}
	else if( props.children )
	{
		recursion ?
			RecursiveAbort("element") :
			CreateChild(props.children, refs, pt, []).forEach(node => {
				elm.appendChild(node)
			})
	}

	// assign callback refs
	if( parent.depth === 0 && pt.refs.length ) {
		pt.refs.forEach(ref => { ref() })
	}

	return elm
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

	create( props, refs = {} )
	{
		return CreateElement( props, refs, Parent(0) );
	},

	append( element, child, refs = {} )
	{
		if( Tools.isHtmlNodeElement(element) ) {

			let ns = NS.html,
				test = '',
				parent = element;

			while(parent) {
				test = getNameSpace( parent.nodeName.toLowerCase(), '' );
				if(test !== ns) {
					ns = test;
					break
				}
				test = test.parentNode
			}

			CreateChild(child, refs, Parent(ns), []).forEach(node => {
				element.appendChild(node)
			})
		}
		return element
	},

	clone( element, reId = {} )
	{
		if( ! Tools.isHtmlNodeElement(element) ) {
			return null
		}

		let clone = element.cloneNode(true);

		function fixIds(e) {
			let node = e.firstChild, id;
			while(node) {

				if(node.nodeType === 1) {
					id = node.getAttribute("id");
					if(id) {
						if(reId[id]) {
							node.setAttribute("id", reId[id])
						}
						else {
							node.removeAttribute("id")
						}
					}
				}

				if(node.firstChild) {
					fixIds(node)
				}

				node = node.nextSibling;
			}
		}

		fixIds(clone);

		return clone
	},

	empty(element, current = false)
	{
		if(Tools.isHtmlNodeElement(element)) {
			while(element.firstChild) {
				element.removeChild(element.firstChild)
			}
			if(current && element.parentNode) {
				element.parentNode.removeChild(element)
			}
		}
	},

	css(element, name, value)
	{
		element = Collection.make(element);
		if( element.length )
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
				if( typeof name === 'object' && arguments.length < 3 )
				{
					for( let n = 0, keys = Object.keys(name), prop, keysLength = keys.length, length = elements.length; n < keysLength; n++ )
					{
						prop = keys[n];
						for( i = 0; i < length; i++ )
						{
							Style(elements[i], ToCam(prop), name[prop]);
						}
					}
				}
				else
				{
					if( ! value && value !== 0 )
					{
						value = ''
					}

					for( let i = 0, length = elements.length; i < length; i++ )
					{
						Style(elements[i], ToCam(name), value);
					}
				}
			}
		}
		return element
	}
};

export default Element;