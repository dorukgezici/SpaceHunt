# DOM Manupulation

This document explains how to make changes to DOM. Everything stated here is pertaining to file `code/src/InterfaceBuilder.ts` and namespace `JSX` defined globally. You may import your dependencies as follows.

```tsx
import { InterfaceBuilder, Component } from "./InterfaceBuilder"; // the path may vary depending on your file's location.
```

Note that `InterfaceBuilder` **has to be imported** if you wish to use JSX.

## JSX

The project uses the JSX (TSX) syntax, which allows you to write HTML-like code within JavaScript (TypeScript). The file extension must be `.tsx`.

```tsx
const element = <div>Hello World!</div>;
```

JSX elements can stack withing each other.

```tsx
const elements = (
	<div>
		Hello
		<span>World!</span>
	</div>
);
```

It is possible to assign attributes to JSX elements.

```tsx
const elements = (
	<img src="image.png" />
);
```

Note that we don't use `class` attribute to refer to element's CSS class list as this is already a JS/TS keyword. We use `className` instead.

```tsx
const element = (
	<div id="id" className="class1 class2"><div>
);
```

We can also use TypeScript expression withing JSX, which get evaluated when the UI is built.

```tsx
const elements = (
	<div>
		My age is {20 + 1}.
	</div>
);
```

Expressions can also be used in arguments or as comments.

```tsx
function getLogoUrl() {
	return "logo.png";
}

const elements = (
	<div>
		<img src={getLogoUrl()} />
		{/* my comment */}
	</div>
);
```

Styles are applied via an attribute object.

```tsx 
const elements = (
	<div>
		Hello
		<span style={{color: "red", fontSize: 12 }}></span>
	</div>
);
```

We can bind event handlers this way.

```tsx
const element = (
	<input onChange={e => console.log(e)} />
);
```

Arrays of elements are also suppored.

```tsx
const numbers = [1, 2, 3];

const elements = (
	<ul>
		{numbers.map(num => <li>Item {num}</li>)}
	</ul>
);
```

Conditional rendering can be done too. Note that this will **not** autmatically update DOM when the expression changes.

```tsx
function cakeReady(): boolean;

const elements = (
	<div>
		{cakeReady() && <span>The cake is not a lie!</span>}
	</div>
);
```

Any expression, which does not evaluate to `false`, `null` or `undefined` will be renderd as a string or a DOM element.

Note that we're **not** using [React](https://reactjs.org/). We have our own lightweight engine for building JSX.

Read [more about JSX](https://facebook.github.io/jsx/).

## Custom Components

Sometimes, we need to create controls, which groups more JSX elements together, like a custom button, for example.

```tsx
const elements = (
	<div>
		<div className="custom-button">
			<span className="custom-button-text">
				Custom Button 1
			</span>
		</div>
		<div className="custom-button">
			<span className="custom-button-text">
				Custom Button 2
			</span>
		</div>
	</div>
);
```

### Stateless Functions

We can make this code more structured by using a function, which we use as a custom element. Note that function's name **has to be capitalised**, otherwise it is assumed that a pre-defined JSX tag is used (such as `div` or `span` etc.).

```tsx
function CustomButton() {
	return (
		<div className="custom-button">
			<span className="custom-button-text">
				Custom Button
			</span>
		</div>
	);
}

const elements = (
	<div>
		<CustomButton />
		<CustomButton />
	<div/>
);
```

We can see that `<CustomButton />` references our previously-defined function. If we redefine our function to take an argument of specific type, we can use this type's properties as JSX arguments.

```tsx
interface ICustomButtonAttrs {
	text: string;
}

function CustomButton(attrs: ICustomButtonAttrs) {
	return (
		<div className="custom-button">
			<span className="custom-button-text">
				{attrs.text}
			</span>
		</div>
	);
}

const elements = (
	<div>
		<CustomButton text="Custom Button 1" />
		<CustomButton text="Custom Button 2" />
	<div/>
);
```

Note that we need to explicitly mark attributes as optional, if we don't want to enforce them.

```tsx
interface ICustomButtonAttrs {
	text: string;
	color?: string;
}

function CustomButton(attrs: ICustomButtonAttrs) {
	return (
		<div className="custom-button">
			<span className="custom-button-text" style={attrs.color && { backgroudColor: attrs.color }}>
				{attrs.text}
			</span>
		</div>
	);
}

const elements = (
	<div>
		<CustomButton text="Custom Button 1" />
		<CustomButton text="Custom Button 2" color="#1d74c1" />
	<div/>
);
```

This is good, but we want to button's text to be written inside the `<CustomButton>` tag. We can do this by specifying a second argument to our function, which represents all of our element's content.

```tsx
interface ICustomButtonAttrs {
	color?: string;
}

function CustomButton(attrs: ICustomButtonAttrs, children: JSX.Children) {
	return (
		<div className="custom-button">
			<span className="custom-button-text" style={attrs.color && { backgroudColor: attrs.color }}>
				{children}
			</span>
		</div>
	);
}

const elements = (
	<div>
		<CustomButton>Custom Button 1</CustomButton>
		<CustomButton color="#1d74c1">Custom Button 2</CustomButton>
	<div/>
);
```

Great, now we want to complicate things to show the true power of JSX. Note the use of spread operator.

```tsx
interface ICustomButtonAttrs {
	color: string;
	big?: boolean;
}

const CustomButton = (attrs: ICustomButtonAttrs, children: JSX.Children) => (
	<div className={"custom-button" + (attrs.big ? " big" : "")}>
		<span className="custom-button-text" style={attrs.color && { backgroudColor: attrs.color }}>
			{children}
		</span>
	</div>
);

const buttons = [{
	id: 1,
	attrs: {
		color: "red",
		big: true
	}
}, {
	id: 2,
	attrs: {
		color: "blue"
	}
}];

const elements = (
	<div>
		{buttons.map(button => (
			<CustomButton {...button.attrs}>Custom Button {button.id}</CustomButton>
		))}
	</div>
);
```

### Components

Instead of plain, stateless functions, we can also use component. Our component should be a class that extends existing `Component` class. Its `render` method is called when rendering is requested.

```tsx
class CustomButton extends Component {

	render() {
		return (
			<div className="custom-button">
				<span className="custom-button-text">
					Custom Button
				</span>
			</div>
		);
	}

}

const elements = (
	<div>
		<CustomButton />
		<CustomButton />
	<div/>
);
```

We can pass attributes and children similarly as before. `children` or both of the arguments may be omitted. Note that we need to specify our attribut declaration as a template argument for parent `Component` class too.

```tsx
interface ICustomButtonAttrs {
	color?: string;
}

class CustomButton extends Component<ICustomButtonAttrs> {

	// constructor() { ... }
	// constructor(attrs: ICustomButtonAttrs | null) { ... }

	render(attrs: ICustomButtonAttrs | null, children: JSX.Children) {
		return (
			<div className="custom-button">
				<span className="custom-button-text" style={attrs.color && { backgroudColor: attrs.color }}>
					{children}
				</span>
			</div>
		);
	}

	// this method is optional
	static instanceCreated(instance: CustomButton) {
		console.log("CustomButton instance created:", instance);
	}

}

const elements = (
	<div>
		<CustomButton>Custom Button 1</CustomButton>
		<CustomButton color="#1d74c1">Custom Button 2</CustomButton>
	<div/>
);
```

The method `instanceCreated` is optional. If specified, it is called by the JSX engine when it creates an instance of our component.

Note that, as the component is instantiated by the JSX engine, one of the two commented constructors should be present, or the constructor clause should be omitted entirely.

Our component's life-cycle if pretty senseless at this point. The component is first created (instantiated), then the `render` method is called, and then our component is discarded. To enhance this *life-cycle*, we can provide custom logic for instantiating our component.

```tsx
interface ICustomButtonAttrs {
	color?: string;
}

class CustomButton extends Component<ICustomButtonAttrs> {

	private readonly index: number; // could also be written as: constructor(private readonly index: number) { ... }

	constructor(index: number) {
		this.index = index;
	}

	render(attrs: ICustomButtonAttrs | null, children: JSX.Children) {
		return (
			<div className="custom-button">
				<span className="custom-button-text" style={attrs.color && { backgroudColor: attrs.color }}>
					Custom Button {this.index}
				</span>
			</div>
		);
	}

	private static counter = 0;
	static instance = new CustomButton(-1); // optional

	static instanceProvider(attrs: ICustomButtonAttrs | null, children: JSX.Children) { // optional
		const index = CustomButton.counter++;
		return new CustomButton(index);
	}

}

const elements = (
	<div>
		<CustomButton />
		<CustomButton color="#1d74c1" />
	<div/>
);
```

In this case, both `instance` and `instanceProvider` are specified as CustomButton's static methods. Both are optional. The JSX engine will first search for `instanceProvider` method. If it is specified, it is called and returned instance is used. If the method does not exist or `null` or `undefiend` is returned, the JSX engine will look for the `instance` method. If it exists, it's value. If not, then the class is instantiated manually.

Note that if `instance` or `instanceProvider` are given, you may implement a custom constructor.

Everytime an instance is (re)used for rendering, its `attrs` property is set to the new attributes of the component. Therefore, you may use `this.attrs` instead of the `attrs` argument in the `render` method. The method `componentWillReceiveAttrs` is called before the `attrs` property gets changed, if implemented.

## Appending Elements to DOM

Each JSX element is actualy a valid `HTMLElement` (or `SVGElement`) created via `document.createElement`. You may use this to append your elements to the DOM.

Certain functions already exist in the `InterfaceBuilder` class to assist you.

```tsx
InterfaceBuilder.onDOMContentLoaded(() => {

	const element = <div>Hello World!</div>; // element to append
	const app = InterfaceBuilder.getApp() as HTMLDivElement; // main content holder element
	const sth = document.getElementById("sth") as HTMLDivElement; // some randome element

	InterfaceBuilder.append(sth, element);

	InterfaceBuilder.replaceContent(app, element);
	InterfaceBuilder.dispalyDefault(element); // same as above
	
	InterfaceBuilder.replace(sth, element);

	InterfaceBuilder.clearContent(app);
	InterfaceBuilder.clearDefault(); // same as above

	// etc.

});
```

Look for each function's description to learn more about what it does.
