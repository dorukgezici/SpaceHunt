import { Component, InterfaceBuilder } from "../../InterfaceBuilder";
import GameBar from "../GameBar/GameBar";
import { GameBootstrap } from "../../GameBootstrap";
require("./style.scss");

interface IEvents { }
interface IAttrs {
	bootstrap: GameBootstrap;
	ref?: (gameInterface: GameInterface) => void;
}

export default class GameInterface extends Component<IAttrs, IEvents> {

	// @ts-ignore
	canvas: HTMLCanvasElement;
	// @ts-ignore
	app: HTMLDivElement;

	constructor(attrs: IAttrs) {
		super(attrs);
	}

	render(attrs: IAttrs) {
		const { bootstrap, ref } = attrs;

		const ret = [
			<div id="canvas-holder">
				<div id="canvas-wrapper">
					<GameBar bootstrap={bootstrap} />
					<canvas id="canvas" height="600" width="800" ref={c => this.canvas = c}></canvas>
				</div>
			</div>,
			<div id="app" ref={e => this.app = e} />
		];

		if (attrs.ref)
			attrs.ref(this);
		return ret;
	}

}
