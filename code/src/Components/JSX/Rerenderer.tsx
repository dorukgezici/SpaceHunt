import { Component, InterfaceBuilder } from "../../InterfaceBuilder";

interface IEvents {
	rerendered: Rerenderer;
}

interface IAttrs {
	element: () => JSX.Element;
	render: () => JSX.ElementCollection;
	ref?: (rerendered: Rerenderer) => void;
}

export default class Rerenderer extends Component<IAttrs, IEvents> {

	protected elt?: JSX.Element;

	rerender() {
		const { attrs, elt } = this;
		if (!elt) return;
		InterfaceBuilder.replaceContent(elt, attrs.render());
	}

	render(attrs: IAttrs): JSX.ElementCollection {
		if (!attrs) return;
		if (attrs.ref)
			attrs.ref(this);
		const elt = this.elt = attrs.element();
		if (!elt)
			throw new Error("Expected an element.");
		InterfaceBuilder.replaceContent(elt, attrs.render());
		return elt;
	}

}
