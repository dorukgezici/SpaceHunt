import { Component, InterfaceBuilder } from "../../InterfaceBuilder";
import Rerenderer from "./Rerenderer";
import { IDefaultEvents } from "../../Class";

export interface IEvents<T, E> {
	rerendered: RerendererComponent<T, E>;
}

export default abstract class RerendererComponent<T = any, E = IDefaultEvents> extends Component<T, E & IEvents<T, E>> {

	protected baseRender: JSX.ElementClassRender<T>;
	protected rerenderer?: Rerenderer;

	constructor(
		protected readonly baseElement: JSX.Element,
		attrs?: T
	) {
		super(attrs);
		const that = this;
		const render = this.baseRender = this.render;
		this.render = function () {
			const args = arguments;
			render.apply(that, args);
			return (
				<Rerenderer
					element={() => that.baseElement}
					render={() => render.apply(that, args)}
					ref={r => this.rerenderer = r}
				/>
			);
		};
	}

	rerender() {
		if (this.rerenderer) {
			this.rerenderer.rerender();
			this.emit("rerendered", this);
		}
	}

}
