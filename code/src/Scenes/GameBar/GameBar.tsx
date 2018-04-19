import { InterfaceBuilder } from "../../InterfaceBuilder";
import { GameBootstrap } from "../../GameBootstrap";
require("./style.scss");

function range(n: number) {
	const arr = new Array<number>(n);
	for (let i = 0; i < n; i++)
		arr[i] = i;
	return arr;
}

export default class GameBar {

	private _visible = false;
	protected livesElement: HTMLElement | null = null;
	protected oxygenElement: HTMLElement | null = null;
	protected holder: HTMLDivElement;

	constructor(
		protected readonly bootstrap: GameBootstrap
	) {
		this.holder = document.getElementById("game-bar-holder") as HTMLDivElement;
		const { stateListener } = bootstrap;
		stateListener.on("lives", this.livesChanged);
		stateListener.on("oxygen", this.oxygenChanged);
		stateListener.on("showOxygen", this.forceUpdate);
		stateListener.on("title", this.forceUpdate);
		(window as any).b = bootstrap;
	}

	dispose() {
		const { stateListener } = this.bootstrap;
		stateListener.off("lives", this.livesChanged);
		stateListener.off("oxygen", this.oxygenChanged);
		stateListener.off("showOxygen", this.forceUpdate);
		stateListener.off("title", this.forceUpdate);
	}

	forceUpdate = () => {
		if (!this._visible)
			return;
		InterfaceBuilder.replaceContent(this.holder, this.render());
	}

	toggle(visible?: boolean) {
		const v = visible === undefined ? !this._visible : visible;
		if (v !== this._visible) {
			this._visible = v;
			if (v) {
				this.holder.style.display = "block";
				this.forceUpdate();
			} else
				this.holder.style.display = "none";
		}
	}

	private livesChanged = () => {
		if (!this.livesElement) return;
		const { lives } = this.bootstrap.state;
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
		if (!this.oxygenElement) return;
		const { oxygen } = this.bootstrap.state;
		this.oxygenElement.style.left = `-${(1 - oxygen) * 100}%`;
	}

	render(): JSX.ElementCollection {
		const { lives, oxygen, title } = this.bootstrap.state;
		this.oxygenElement = null;
		return (
			<div id="game-bar">
				<div
					ref={e => this.livesElement = e}
					className="lives"
				>
					{range(lives).forEach(() => (
						<div className="live"></div>
					))}
				</div>
				<div className="title">
					{title}
				</div>
				{!Number.isNaN(oxygen) && (
					<div className="oxygen-holder">
						<div
							ref={e => this.oxygenElement = e}
							className="oxygen-level"
							style={{ left: `-${(1 - oxygen) * 100}%` }} />
					</div>
				)}
			</div>
		);
	}

}
