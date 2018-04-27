import RerendererComponent from "../../Components/JSX/RerendererComponent";
import { GameBootstrap } from "../../GameBootstrap";
import { InterfaceBuilder } from "../../InterfaceBuilder";
require("./game-bar.scss");

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
	protected scoreElement: HTMLElement | null = null;

	constructor(attrs: IAttrs) {
		super(
			<div id="game-bar-holder"></div>
		);
		this.rerender = this.rerender.bind(this);
		const { stateListener } = attrs.bootstrap;
		stateListener.on("lives", this.livesChanged);
		stateListener.on("oxygen", this.oxygenChanged);
		stateListener.on("score", this.scoreChanged);
		stateListener.on("showOxygen", this.rerender);
		stateListener.on("title", this.rerender);
	}

	dispose() {
		const { stateListener } = this.attrs.bootstrap;
		stateListener.off("lives", this.livesChanged);
		stateListener.off("oxygen", this.oxygenChanged);
		stateListener.off("score", this.scoreChanged);
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

	private scoreChanged = () => {
		const { scoreElement } = this;
		const { score } = this.attrs.bootstrap.state;
		if (!this.scoreElement) return;

		if (score === undefined || score === null)
			this.scoreElement.style.display = "none";
		else {
			this.scoreElement.style.display = "block";
			this.scoreElement.innerText = score.toString();
		}
	}

	render(): JSX.ElementCollection {
		const { stateListener, state } = this.attrs.bootstrap;
		const { lives, oxygen, title, showOxygen, score } = state;
		this.oxygenElements = [];

		return (
			<div id="game-bar">
				<div ref={e => this.livesElement = e} className="lives">
					{range(lives).map(() => (
						<div className="live"></div>
					))}
				</div>
				<div className="score" ref={e => this.scoreElement = e}>
					{score}
				</div>
				<div className="title">
					{title}
				</div>
				{(showOxygen && oxygen.length || false) && (
					<div className="oxygen-wrapper">
						{(this.oxygenElements = oxygen.map(t => (
							<div className="oxygen-level" style={{ left: `-${(1 - t) * 100}%` }} />
						) as HTMLDivElement)).map(t => (
							<div className="oxygen-holder">{t}</div>
						))}
					</div>
				)}
			</div>
		);
	}

}
