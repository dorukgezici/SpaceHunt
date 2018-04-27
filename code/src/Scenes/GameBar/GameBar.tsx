import { InterfaceBuilder } from "../../InterfaceBuilder";
import { GameBootstrap } from "../../GameBootstrap";
import { Class } from "../../Class";
import Rerenderer from "../../Components/JSX/Rerenderer";
import RerendererComponent from "../../Components/JSX/RerendererComponent";
require("./style.scss");

function range(n: number) {
	const arr = new Array<number>(n);
	for (let i = 0; i < n; i++)
		arr[i] = i;
	return arr;
}

interface IEvents {
	dispose: GameBar;
}

interface IAttrs {
	bootstrap: GameBootstrap;
}

export default class GameBar extends RerendererComponent<IAttrs, IEvents> {

	protected livesElement: HTMLElement | null = null;
	protected oxygenElements: HTMLElement[] = [];

	constructor(attrs: IAttrs) {
		super(
			<div id="game-bar-holder"></div>
		);
		this.rerender = this.rerender.bind(this);
		const { stateListener } = attrs.bootstrap;
		stateListener.on("lives", this.livesChanged);
		stateListener.on("oxygen", this.oxygenChanged);
		stateListener.on("showOxygen", this.rerender);
		stateListener.on("title", this.rerender);
	}

	dispose() {
		const { stateListener } = this.attrs.bootstrap;
		stateListener.off("lives", this.livesChanged);
		stateListener.off("oxygen", this.oxygenChanged);
		stateListener.off("showOxygen", this.rerender);
		stateListener.off("title", this.rerender);
		this.emit("dispose", this);
	}

	private livesChanged = () => {
		if (!this.livesElement) return;
		const { lives } = this.attrs.bootstrap.state;
		const { children } = this.livesElement;

		if (children.length < lives) {
			while (children.length < lives)
				InterfaceBuilder.append(this.livesElement, <div className="live" />);
		} else if (lives < children.length) {
			while (children.length > lives)
				children[children.length - 1].remove();
		}
	}

	private oxygenChanged = () => {
		const { oxygen } = this.attrs.bootstrap.state;

		if (oxygen.length !== this.oxygenElements.length)
			this.rerender();
		else
			this.oxygenElements.forEach((t, i) => {
				t.style.left = `-${(1 - oxygen[i]) * 100}%`;
			});
	}

	render(): JSX.ElementCollection {
		const { stateListener, state } = this.attrs.bootstrap;
		const { lives, oxygen, title, showOxygen } = state;
		this.oxygenElements = [];

		return (
			<div id="game-bar">
				<div ref={e => this.livesElement = e} className="lives">
					{range(lives).map(() => (
						<div className="live"></div>
					))}
				</div>
				<div className="title">
					{title}
				</div>
				{(showOxygen && oxygen.length || false) && (
					<div className="oxygen-wrapper">
						{(this.oxygenElements = oxygen.map(t => (
							<div className="oxygen-level" style={{ left: `-${(1 - t) * 100}%` }} />
						) as HTMLDivElement)).map(t => (
							<div className="oxygen-holder">	{t}</div>
						))}
					</div>
				)}
			</div>
		);
	}

}
