export abstract class Component<T extends JSX.AttrsType = JSX.DefaultAttrs, E extends JSX.ElementBase = JSX.ElementBase> implements JSX.Component<T> {

	/**
	 * This value will always be undefiend unless manually set. Use `attrs` property instead.
	 */
	_attrs: JSX.Attrs<T, E>;
	/**
	 * Current attributes of the component, if any.
	 */
	attrs?: JSX.AttrsValue<T, E> = null;

	constructor();
	constructor(attrs: JSX.AttrsValue<T, E>);
	constructor(attrs?: JSX.AttrsValue<T, E>) {
		this.attrs = attrs;
	}

	/**
	 * Called by JSX engine when before rendering and before new attributes will be assigned.
	 * 
	 * Implement this method to apply custom logic.
	 * @param nextAttrs New attributes.
	 */
	componentWillReceiveAttrs?(nextAttrs: JSX.AttrsValue<T>): void;
	/**
	 * Called by JSX engine when new content is to be rendered.
	 * @param attrs Attributes to render.
	 * @param children Children to append.
	 */
	abstract render(attrs: JSX.AttrsValue<T>, children: JSX.Children): JSX.ElementCollection;

}

/**
 * Static methods of the JSX `Component` class for using the default constructor.
 */
export interface IComponentClassDefault<T extends JSX.AttrsType, C extends Component<T, any>, E extends JSX.ElementBase = JSX.ElementBase> {
	new(): Component<T, E>;
	new(attrs: JSX.AttrsValue<T>): Component<T, E>;
	prototype: Component<T, E>;
	/**
	 * Instance of the component for JSX engine to re-use instead of creating a new instance.
	 * 
	 * Note that this will be ignored if `instanceProvider` is specified and will return a component instance.
	 */
	instance?: Component<T, E> | unset;
	/**
	 * If implemented, used by the JSX engine to retrieve component instances. An existing or newly created instance may be returned. If no value is returned, the `instance` property is taken.
	 */
	instanceProvider?(attrs: JSX.AttrsValue<T>, children: JSX.Children): Component<T, E> | unset;
	/**
	 * Called by the JSX engine to log newly created component instance, if implemented.
	 */
	instanceCreated?(instance: Component<T, E>): void;
}

/**
 * Static methods of the JSX `Component` class for using `instance` field.
 */
export interface IComponentClassInstance<T extends JSX.AttrsType, C extends Component<T, any>, E extends JSX.ElementBase = JSX.ElementBase> {
	prototype: Component<T, E>;
	/**
	 * Instance of the component for JSX engine to re-use instead of creating a new instance.
	 * 
	 * Note that this will be ignored if `instanceProvider` is specified and will return a component instance.
	 */
	instance: Component<T, E> | unset;
	/**
	 * If implemented, used by the JSX engine to retrieve component instances. An existing or newly created instance may be returned. If no value is returned, the `instance` property is taken.
	 */
	instanceProvider?(attrs: JSX.AttrsValue<T>, children: JSX.Children): Component<T, E> | unset;
	/**
	 * Called by the JSX engine to log newly created component instance, if implemented.
	 */
	instanceCreated?(instance: Component<T, E>): void;
}

/**
 * Static methods of the JSX `Component` class for using `instanceProvider` method.
 */
export interface IComponentClassInstanceProvider<T extends JSX.AttrsType, C extends Component<T, any>, E extends JSX.ElementBase = JSX.ElementBase> {
	prototype: Component<T, E>;
	/**
	 * Instance of the component for JSX engine to re-use instead of creating a new instance.
	 * 
	 * Note that this will be ignored if `instanceProvider` is specified and will return a component instance.
	 */
	instance?: Component<T, E> | unset;
	/**
	 * If implemented, used by the JSX engine to retrieve component instances. An existing or newly created instance may be returned. If no value is returned, the `instance` property is taken.
	 */
	instanceProvider(attrs: JSX.AttrsValue<T>, children: JSX.Children): Component<T, E> | unset;
	/**
	 * Called by the JSX engine to log newly created component instance, if implemented.
	 */
	instanceCreated?(instance: Component<T, E>): void;
}

/**
 * Static methods of the JSX `Component` class.
 */
export type IComponentClass<T extends JSX.AttrsType, C extends Component<T, any>, E extends JSX.ElementBase = JSX.ElementBase> =
	| IComponentClassDefault<T, Component<T, E>, E>
	| IComponentClassInstance<T, Component<T, E>, E>
	| IComponentClassInstanceProvider<T, Component<T, E>, E>;

/**
 * CSS properties which get assigned the `px` suffix.
 */
export const numericCSSProperties = [
	"borderBottomLeftRadius",
	"borderBottomRightRadius",
	"borderRadius",
	"borderTopLeftRadius",
	"borderTopRightRadius ",
	"borderWidth",
	"bottom",
	"fontSize",
	"height",
	"left",
	"margin",
	"marginBottom",
	"marginLeft",
	"marginRight",
	"marginTop",
	"padding",
	"paddingBottom",
	"paddingLeft",
	"paddingRight",
	"paddingTop",
	"right",
	"strokeWidth",
	"top",
	"width"
];

/**
 * Error to throw when requested DOM content is not yet loaded.
 */
export class DOMContentNotLoaded extends Error {
	constructor(message = "DOM content not loaded.") {
		super(message);
	}
}

/**
 * Error to throw when and invalid child object is given to a JSX element.
 */
export class InvalidChildElement extends Error {
	constructor(public readonly item: any, message?: string) {
		super(message
			|| (item && `Invalid object passed as a child of an JSX element: "${item.toString()}".`)
			|| "Invalid object passed as a child of an JSX element."
		);
	}
}

/**
 * Provides functionalities for manupulating the DOM.
 */
export namespace InterfaceBuilder {

	export const canvasId = "canvas";
	export const appId = "app";
	export const canvasHolderId = "canvas-holder";

	/**
	 * Gets the `#canvas-holder` DOM element.
	 */
	export function getCanvasHolder() {
		return document.getElementById(canvasHolderId) as HTMLDivElement;
	}

	/**
	 * Gets the `#canvas` DOM element.
	 */
	export function getCanvas() {
		return document.getElementById(canvasId) as HTMLCanvasElement;
	}

	/**
	 * Gets the `#app` DOM element.
	 */
	export function getApp() {
		return document.getElementById(appId) as HTMLDivElement;
	}

	/**
	 * Checks if given value is a candidate to be appended to DOM.
	 * @param value The value to test.
	 */
	export function isTruthy(value: JSX.Node): value is JSX.TruthyNode;
	/**
	 * Checks if given value is not false, null nor undefined.
	 * @param value The value to test.
	 */
	export function isTruthy<T>(value: T): value is T;
	export function isTruthy(value: any): any {
		return !isFalsy(value);
	}

	/**
	 * Checks if given value is not a candidate to be appended to DOM.
	 * @param value The value to test.
	 */
	export function isFalsy(value: JSX.Node): value is JSX.FalsyNode;
	/**
	 * Checks if given value is false, null or undefined.
	 * @param value The value to test.
	 */
	export function isFalsy(value: any): value is false | null | undefined;
	export function isFalsy(value: any): any {
		return value === false
			|| value === null
			|| value === undefined;
	}

	/**
	 * Extracts truthy value(s).
	 * @param values Value(s) to filter.
	 */
	export function filter(values: JSX.ElementCollection): JSX.ElementBase[];
	export function filter(values: JSX.NodeCollection): JSX.TruthyNode[];
	export function filter(values: JSX.NodeCollection): JSX.TruthyNode[] | JSX.ElementBase[] {
		if (!values)
			return [];
		else if (Array.isArray(values))
			return values.filter(isTruthy);
		else if (isTruthy(values))
			return [values];
		else
			return [];
	}

	/**
	 * Flattens an array of node collections and filters it for truthy values only.
	 * @param array Array of nodes collections to flatten.
	 */
	export function flatten(array: JSX.NodeCollection[]): JSX.TruthyNode[] {
		const flattened: JSX.TruthyNode[] = [];
		for (let value of array) {
			if (isTruthy(value)) {
				if (Array.isArray(value))
					flattened.push(...value.filter(isTruthy));
				else
					flattened.push(value as JSX.TruthyNode);
			}
		}
		return flattened;
	}

	function assignStyle(given: JSX.CSSProperties, actual: CSSStyleDeclaration): void {
		for (let prop in given) {
			let value = given[prop];
			if (typeof prop === "number" && numericCSSProperties.includes(prop))
				value = value + "px";
			(actual as KeyValueObject)[prop] = given[prop];
		}
	}

	function assignAttributes<T>(attrs: JSX.AttrsValue<T>, element: HTMLElement): void {
		if (!attrs)
			return;
		for (let attr in attrs) {
			if (attr === "ref")
				continue;
			const value = attrs[attr];
			if (value === null || value === undefined)
				continue;
			if (attr === "style")
				assignStyle(value, element.style);
			else
				(element as any)[attr] = value;
		}
	}

	/**
	 * Creates DOM element from given tag name.
	 * @param name DOM element tag.
	 * @param attrs Attributes to assign.
	 * @param children Children to append.
	 */
	export function createIntrinsicElement<T extends JSX.AttrsType>(name: string, attrs: JSX.AttrsValue<T>, children: JSX.NodeCollection[]): JSX.Element {
		const elt = document.createElement(name);
		assignAttributes(attrs, elt);

		let str = ""; // optimisation
		for (const collection of children) {
			const col = Array.isArray(collection) ? collection : [collection];
			for (const child of col) {
				if (isTruthy(child)) {
					if (typeof child === "object") {
						if (!(child instanceof Element))
							throw new InvalidChildElement(child);
						if (str) {
							elt.insertAdjacentText("beforeend", str);
							str = "";
						}
						elt.insertAdjacentElement("beforeend", child);
					} else
						str += child.toString();
				}
			}
		}
		if (str)
			elt.insertAdjacentText("beforeend", str);

		if (attrs && attrs.ref)
			attrs.ref(elt);

		return elt;
	}

	/**
	 * Retrievers element collection from given provider.
	 * @param provider Provider to use.
	 * @param attrs Attributes to assign.
	 * @param children Children to append.
	 */
	export function createFunctionalElement<T extends JSX.AttrsType>(provider: JSX.Provider<T>, attrs: JSX.AttrsValue<T>, children: JSX.NodeCollection[]): JSX.ElementCollection {
		return provider(attrs, flatten(children));
	}

	/**
	 * Instantiates given component class and renders it's content.
	 * @param componentClass Component class to instantiate and use.
	 * @param attrs Attributes to assign.
	 * @param children Children to append.
	 */
	export function createComponentClassElement<T extends JSX.AttrsType, C extends Component<T>, E extends JSX.ElementBase>(componentClass: IComponentClass<T, Component<T, E>, E>, attrs: JSX.AttrsValue<T>, children: JSX.NodeCollection[]): JSX.ElementCollection {
		const c = flatten(children);
		let instance: Component<T> | unset;
		if (componentClass.instanceProvider)
			instance = componentClass.instanceProvider(attrs, c);
		if (!instance && componentClass.instance)
			instance = componentClass.instance;
		if (!instance) {
			instance = new (componentClass as IComponentClassDefault<T, C>)(attrs);
			if (componentClass.instanceCreated)
				componentClass.instanceCreated(instance as C);
		}
		return instance.render(attrs, c);
	}

	/**
	 * Renders contents of a JSX component.
	 * @param component Component to render.
	 * @param attrs Attributes to assign.
	 * @param children Children to append.
	 */
	export function createComponentInstanceElement<T>(component: Component<T>, attrs: T, children: JSX.NodeCollection[]): JSX.ElementCollection {
		if (component.componentWillReceiveAttrs)
			component.componentWillReceiveAttrs(attrs);
		component.attrs = attrs;
		return component.render(attrs, flatten(children));
	}

	/**
	 * Creates DOM element from given tag name.
	 * @param name DOM element tag.
	 * @param attrs Attributes to assign.
	 * @param children Children to append.
	 */
	export function createElement<T extends JSX.AttrsType>(
		name: string,
		attrs: JSX.AttrsValue<T>,
		...children: JSX.NodeCollection[]
	): JSX.Element;
	/**
	 * Retrievers element collection from given provider.
	 * @param provider Provider to use.
	 * @param attrs Attributes to assign.
	 * @param children Children to append.
	 */
	export function createElement<T extends JSX.AttrsType>(
		provider: JSX.Provider<T>,
		attrs: JSX.AttrsValue<T>,
		...children: JSX.NodeCollection[]
	): JSX.ElementCollection;
	/**
	 * Instantiates given component class and renders it's content.
	 * @param componentClass Component class to instantiate and use.
	 * @param attrs Attributes to assign.
	 * @param children Children to append.
	 */
	export function createElement<T extends JSX.AttrsType, C extends Component<T>>(
		componentClass: IComponentClass<T, C>,
		attrs: JSX.AttrsValue<T>,
		...children: JSX.NodeCollection[]
	): JSX.ElementCollection;
	export function createElement<T extends JSX.AttrsType>(
		factory: string | IComponentClass<T, any> | JSX.Provider<T>,
		attrs: KeyValueObject | null,
		...children: JSX.NodeCollection[]
	): JSX.ElementCollection {
		if (typeof factory === "string")
			return createIntrinsicElement(factory, attrs, children);
		else if (typeof factory.prototype.render === "function")
			return createComponentClassElement(factory as any, attrs, children);
		else
			return createFunctionalElement(factory as any, attrs, children);
	}

	/**
	 * Creates document fragment which inclueds given elements. Use this to apply multiple elements to the DOM.
	 * @param elementCollection Elements to include.
	 */
	export function createFragment(elementCollection: JSX.ElementCollection) {
		const fragment = document.createDocumentFragment();
		filter(elementCollection).forEach(elt => fragment.appendChild(elt));
		return fragment;
	}

	/**
	 * Appends element to DOM.
	 * @param element Element to append to.
	 * @param elementCollection Elements to append.
	 */
	export function append(element: Element, elementCollection: JSX.ElementCollection) {
		element.appendChild(createFragment(elementCollection));
	}

	/**
	 * Clears all element's content.
	 * @param element Element which's content to clear.
	 */
	export function clearContent(element: Element) {
		/*
		 * This is much faster than elment.innerHTML = "";
		 * See https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
		 */
		while (element.firstChild)
			element.removeChild(element.firstChild);
	}

	/**
	 * Replaces element's content with given elements.
	 * @param element Element which's content to replace.
	 * @param elementCollection Elements to insert.
	 */
	export function replaceContent(element: Element, elementCollection: JSX.ElementCollection) {
		clearContent(element);
		append(element, elementCollection);
	}

	/**
	 * Replaces element with other elements.
	 * @param element Element to remove and replace.
	 * @param elementCollection Elements to insert.
	 */
	export function replace(element: Element, elementCollection: JSX.ElementCollection) {
		const parent = element.parentElement;
		if (!parent)
			throw new Error("No parent element found.");
		parent.insertBefore(createFragment(elementCollection), element);
		element.remove();
	}

	/**
	 * Display given content in application's default interface container (the `#app` element).
	 * @param elementCollection Elements to display.
	 */
	export function dispalyDefault(elementCollection: JSX.ElementCollection) {
		if (!getApp())
			throw new DOMContentNotLoaded();
		else
			replaceContent(getApp(), elementCollection);
	}

	/**
	 * Clears applications default interface container (the `#app` element).
	 */
	export function clearDefault() {
		if (!getApp())
			throw new DOMContentNotLoaded(); // throw if not loaded
		else
			clearContent(getApp());
	}

	/**
	 * Subscribes a listener to DOMContentLoaded event.
	 * @param callback Listener to subscribe.
	 */
	export function onDOMContentLoaded(callback: EventListenerOrEventListenerObject) {
		document.addEventListener("DOMContentLoaded", callback);
	}

	/**
	 * Returns a promise which is resolved when DOM content gets loaded.
	 */
	export function awaitDOMContentLoaded() {
		return new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));
	}

}
