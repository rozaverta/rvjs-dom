import Tools from "rvjs-tools";

let IndexOf = Array.prototype.indexOf;

function Copy( collection, htmlCollection )
{
	for( let i = 0, length = htmlCollection.length; i < length; i++ ) {
		collection.add(htmlCollection[i])
	}
}

function Fill(collection, element, isWindow, level = 0)
{
	let type = Tools.getType(element);

	if( type === 'html-node' || isWindow && type === 'window' )
	{
		collection.add(element)
	}

	else if( type === 'html-collection' || type === 'object' && element instanceof HtmlArrayCollection )
	{
		Copy(collection, element)
	}

	else if( type === 'array' )
	{
		if( level < 3 ) {
			for( let i = 0, length = element.length; i < length; i++ ) {
				Fill(collection, element[i], isWindow, level + 1);
			}
		}
	}

	else if( type === "string" )
	{
		Copy(collection, document.querySelectorAll(element))
	}
}

/**
 *
 * @param element
 * @param isWindow
 * @returns {HtmlArrayCollection}
 * @constructor
 */
function HtmlArrayCollection( element, isWindow )
{
	if( arguments.length > 0 ) {
		if( element instanceof HtmlArrayCollection ) {
			return element
		}
		else {
			return new HtmlArrayCollection( element, isWindow )
		}
	}
	else {
		return new HtmlArrayCollection()
	}
}

HtmlArrayCollection.prototype.constructor = function(element, isWindow = false)
{
	let self = this, length = 0;

	if( 'defineProperties' in Object ) {
		Object.defineProperties(self, {
			length: {
				get() {
					return length
				}
			},
			add: {
				value( htmlElement ) {
					if( IndexOf.call(self, htmlElement) < 0 ) self[length ++] = htmlElement
				}
			}
		})
	}
	else {
		self.length = 0;
		self.add = function(htmlElement) {
			if( IndexOf.call(self, htmlElement) < 0 ) {
				self[length ++] = htmlElement;
				self.length = length;
			}
		}
	}

	if( arguments.length ) {
		self.fill(element, isWindow)
	}
};

HtmlArrayCollection.prototype.fill = function(element, isWindow = false)
{
	Tools.isBrowser && element && Fill(this, element, isWindow)
};

HtmlArrayCollection.prototype.forEach = function(callback)
{
	for( let i = 0, length = this.length; i < length; i++ ) {
		callback(this[i], i)
	}
};

HtmlArrayCollection.prototype.map = function(callback)
{
	let remap = new HtmlArrayCollection();
	for( let i = 0, length = this.length, element; i < length; i++ ) {
		element = callback(this[i], i);
		if( Tools.isHtmlNodeElement(element) ) {
			remap.add(element)
		}
	}
	return remap;
};

export default HtmlArrayCollection;