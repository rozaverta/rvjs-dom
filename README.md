# rvjs-dom

HTML Dom basic manipulations

```javascript
import * as Dom from "rvjs-dom";
```

## Dom.ClassName

> `Object` \
Class name html nodes manipulations

- ClassName.set
	>`Function( {String | HTMLCollection | Dom.Collection} nodes, {String} classes ) : {Dom.ClassName}` \
	Set class or classes for nodes
- ClassName.add
	>`Function( {String | HTMLCollection | Dom.Collection} nodes, {String} classes) : {Dom.ClassName}` \
	Add class or classes for nodes
- ClassName.pick
	>`Function( {Boolean} add, ...args )` \
	Add or Remove class classes for nodes, the first argument indicates a function further arguments are passed to the function
- ClassName.remove
	>`Function({String | HTMLCollection | Dom.Collection} nodes, {String} classes) : {Dom.ClassName}` \
	Remove class or classes for nodes
- ClassName.toggle
	>`Function({String | HTMLCollection | Dom.Collection} nodes, {String} classes) : {Dom.ClassName}` \
	Toggle class or classes for nodes
- ClassName.has
	>`Function({String | HTMLCollection | Dom.Collection} nodes, {String} classes[, {Function} callback]) : {Boolean}` \
	Check class or classes assigned for nodes \
	If classes is found and $callback arguments is function then $callback function will be called
- ClassName.not
	>`Function({String | HTMLCollection | Dom.Collection} nodes, {String} classes[, {Function} callback]) : {Boolean}` \
	Check class or classes is not assigned for nodes \
	If classes is not found and $callback arguments is function then $callback function will be called
- ClassName.dispatch
	>`Function({String | HTMLCollection | Dom.Collection} nodes, {String} classes, {Function} callback) : {Dom.ClassName | Boolean}` \
	Short method for all `Dom.ClassName` methods: \
	`: class-name` - set \
	`+ class-name` - add \
	`- class-name` - remove \
	`~ class-name` - toggle \
	`? class-name` - has \
	`! class-name` - not \
	`?` and `!` used $callback method and return `Boolean`. Other method return `ClassName` object

## Dom.Collection

> `Class` \
Create html nodes collection

- Collection
	> `Class new Dom.Collection({*} nodes[, {Boolean} isWindow = false])` \
	Create new Collection
- Collection.make
	> `Function({*} nodes[, {Boolean} isWindow = false])` \
	Similarly to new Collection( ... args ) but you may use Collection instance for the nodes argument
	
### Collection instance

- constructor
	>`Function({*} nodes[, {Boolean} isWindow = false])` \
	New instance
- fill
	>`Function({*} nodes[, {Boolean} isWindow = false])` \
	Add new nodes
- forEach
	>`Function({Function} callback)` \
	Similarly to Array.prototype.forEach
- map
	>`Function({Function} callback)`\
	Similarly to Array.prototype.map, return new Collection instance
	
```javascript
import {Collection, Element} from "rvjs-dom";

let collection_1 = new Collection(document.body);
let collection_2 = new Collection(['body', 'footer', 'header, #head', Element.byId("app")]);
let collection_3 = new Collection(Element.byQuery("div.class-name")); // Similarly to
let collection_4 = new Collection("div.class-name");

// collection_5 === collection_1
let collection_5 = Collection.make(collection_1);
```

## Dom.Element

> `Object` \
Default html nodes manipulations

- Element.byId
	>`Function({String} name) : {HtmlElement | null}` \
	Similarly to calling the `document.getElementById(name)` function
- Element.byQueryOne
	>`Function({String} name[, {HtmlElement} element = null])` \
	Similarly to calling the `HtmlElement.querySelector(name)` function \
	If the element is null it is used `document` object
- Element.byQuery
	>`Function({String} name[, {HtmlElement} element = null])` \
	Similarly to calling the `HtmlElement.querySelectorAll(name)` function \
	If the element is null it is used `document` object
- Element.byClassName
	>`Function({String} name)` \
	Similarly to calling the `document.getElementsByClassName(name)` function
- Element.byTag
	>`Function({String} name)` \
	Similarly to calling the `document.getElementsByTagName(name)` function
- Element.byName
	>`Function({String} name)` \
	Similarly to calling the `document.getElementsByName(name)` function
- Element.create
	>`Function({Object} properties) : {HtmlElement}`
	Create HtmlElement \
	Properties:
	- `{String} name` - tag name, default `"div"`, you can use selectors, e.g. `"div#id.class-name"`
	- `{String} className` - class name
	- `{String} id` - id attribute
	- `{String} nameSpace` - name space
	- `{Object} attrs` - html attributes
	- `{Object} props` - properties for element
	- `{Object} data` - data attributes for element
	- `{Object} events` - events for element
	- `{HtmlElement} parent` - if exists the `parent` property then the element will be appended to parent
	- `{Boolean} prepend` - if exists the `parent` property and `prepend` is `true` then the element will be prepended to parent
	- `{String | Function} text` - append TextNode to the created HtmlElement
	- `{String | Function} html` - set html text to the created HtmlElement (used property `innerHTML`)
	- `{Array} children` - children elements
	- `{*} child` - child element
- Element.css
	>`Function({*} nodes, {String} name, {String} value) : {Dom.Collection}` \
	Assign style property `name` equal to `value` for all `nodes`
- Element.css
	>`Function({*} nodes, {Object} styles) : {Dom.Collection}`\
    Assign multiply `styles` properties

## Dom.Evn

> `Object` \
Add and remove default events for html nodes

- Evn.support
	>`Object {}` \
	Mixed support values
- Evn.add
	>`Function({*} nodes, {String} event, {Function} callback)` \
	Add `event` for nodes
- Evn.remove
	>`Function({*} nodes, {String} event, {Function} callback)` \
	Remove `event` for nodes
- Evn.resize
	>`Function({Function} callback[, {Function} removeCallback])` \
	Add resize event for window object
- Evn.scroll
	>`Function({Function} callback[, {Function} removeCallback])` \
	Add scroll event for window object
- Evn.on
	>`Function({String} event, {Function} callback[, {Function} removeCallback])` \
	Add `event` for window object
- Evn.hover
	>`Function({*} nodes, {Function} enterCallback, {Function} leaveCallback[, {Function} removeCallback])` \
	Add mouseenter and mouseleave events for nodes
- Evn.ready
	>`Function({Function} eventCallback)` \
	Add callback for DOMContentLoaded event
- Evn.native
	>`Function({Boolean | String} add, {HtmlElement} node, {String} event, {Function} callback[, {*} useCapture=false])` \
	Use native event listener for fast
	
## Dom.Offset

- Offset
	> `Function({HtmlElement} element[, {Boolean} fixed = false]) : {Object}` \
	Get offset of html node \
	Use `fixed = "auto"` for detect fixed element \
	Return object with properties: 
	- `{Number} width` - HtmlElement width content
	- `{Number} height` - HtmlElement height content
	- `{Number} top` - HtmlElement offset top of viewport 
	- `{Number} left` - HtmlElement offset left of viewport 

## Dom.Page

> `Object` \
Page page (browser window) offset properties: top, left, width, height, etc.

- `{Number} width` - document width
- `{Number} height` - document height
- `{Number} top` - document top scroll 
- `{Number} left` - document left scroll
- `{Number} viewportWidth` - document viewport width
- `{Number} viewportHeight` - document viewport height
- `{Function} all()` - get all properties as `Object`

## Dom.Style

> `Function` \
Css property (HtmlElement.style) manipulations

- Style
	> Function( {HtmlElement} element, {String} name, {String | Number} value ) \
	Add `name` property to `element` style

```javascript
import {Element, Style} from "rvjs-dom";

Style( Element.byId("app"), "--red", "#900");
Style( Element.byId("app"), "border", "1px solid var(--red)" );
```

## Dom.StyleSheets

> `Function` \
Add new style sheet rules for page \
Return Void

- Dom.StyleSheets
	>`Function( {String} selector, {String} rules )`
- Dom.StyleSheets
	> `Function( {Object} rules )` \
	Add multiply rules

```javascript
import {StyleSheets} from "rvjs-dom";

StyleSheets("div.class-name, div.class-name > span", "border: 1px solid red; float: left;");
StyleSheets({ 
	"div.red": "color: #900;",
	"div.class-name": "float: left;"
});
```
