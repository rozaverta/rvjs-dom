import Evn from './event';
import ClassName from './class-name';
import Style from "./style";

let inline = ('B,BIG,I,SMALL,TT,ABBR,ACRONYM,CITE,CODE,DFN,EM,KBD,STRONG,SAMP,TIME,VAR,A,BDO,BR,IMG,MAP,OBJECT,Q,SCRIPT,SPAN,SUB,SUP,BUTTON,INPUT,LABEL,SELECT,TEXTAREA').split(',');

function getStyles(element)
{
	let view = element.ownerDocument.defaultView;

	if ( !view || !view.opener )
	{
		view = window;
	}

	return view.getComputedStyle( element );
}

class Item
{
	constructor(element)
	{
		let display = element.style.display || '',
			show = function () {
				element.style.display = display;
				return this
			};

		if( display == 'none' )
		{
			display = ''
		}

		if( ! display )
		{
			let cssDisplay = getStyles(element).getPropertyValue('display');
			if( cssDisplay && cssDisplay !== 'none' )
			{
				display = cssDisplay
			}
			else
			{
				display = inline.indexOf((element.tagName || '').toUpperCase()) > 0 ? 'inline' : 'block';
			}
		}

		Object.defineProperty(this, 'element', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: element
		});


		this.show = show.bind(this)
	}

	on(event, callback)
	{
		Evn.add(this.element, event, callback);
		return this
	}

	off(event, callback)
	{
		Evn.remove(this.element, event, callback);
		return this
	}

	attr(name, value)
	{
		if( arguments.length < 2 )
		{
			return this.element.getAttribute(name)
		}
		else if( value === null )
		{
			this.element.removeAttribute(name)
		}
		else
		{
			this.element.setAttribute(name, value)
		}
		return this
	}

	data(name, value)
	{
		if( arguments.length < 2 )
		{
			return this.element.dataset[name]
		}
		else if( value === null )
		{
			delete this.element.dataset[name]
		}
		else
		{
			this.element.dataset[name] = value
		}
		return this
	}

	value(value)
	{
		if( arguments.length < 1 )
		{
			return this.element.value || ""
		}

		this.element.value = String(value);
		return this
	}

	property(name, value)
	{
		if( arguments.length < 2 )
		{
			try {
				delete this.element[name]
			}
			catch(e) {}
		}
		else
		{
			this.element[name] = value
		}

		return this
	}

	disable()
	{
		this.element.disabled = true;
		return this
	}

	enable()
	{
		this.element.disabled = false;
		return this
	}

	hide()
	{
		this.element.style.display = 'none';
		return this
	}

	style(name, value)
	{
		if( typeof name == 'object' && arguments.length < 2 )
		{
			for(let i = 0, keys = Object.keys(name), length = keys.length; i < length; i++ )
			{
				Style(this.element, keys[i], name[keys[i]])
			}
		}
		else
		{
			Style(this.element, String(name), value)
		}
		return this
	}

	className(className, callback)
	{
		ClassName.dispatch(this.element, className, callback);
		return this
	}
}

export default Item;