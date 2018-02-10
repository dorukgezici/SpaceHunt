import { Class } from "../../Class";
import { IGameElement, GameBootstrap, IGameElementEvents, IGameEventValue, GameElementDoneType } from "../../GameBootstrap";
import { InterfaceBuilder } from "../../InterfaceBuilder";
require("./style.scss");

export default class Intro extends Class implements IGameElement {

	private gameBoostrap: GameBootstrap;
	private storyElement: HTMLParagraphElement;

	init(bootstrap: GameBootstrap) {
		this.gameBoostrap = bootstrap;
		//this.storyElement.innerText = "The year 3020 is written, and travel between planets and galaxies is finally becoming common, but this fact carries some pitfalls. The technological war between the Earth and the planet Eslan from a nearby galaxy broke out. During this battle, one of the respected biologists, Lucy Mikelson was abducted for unknown reasons. However, the government refuses to take part in any rescue action. Thus, everything remains in the hands of Lucy's husband Freddy Mikelson.";
	}

	start() {
		InterfaceBuilder.dispalyDefault(this.render());
	}

	dispose() {
		InterfaceBuilder.clearDefault();
	}

	private done() {
		this.emit("done", { target: this, type: GameElementDoneType.Finished });
	}

	private onClick() {

	}

	private onKeyPress(keyCode: number) {
		if (keyCode === 13) // enter
			this.done();
	}

	private render() {
		return (
			<div id="intro">
				<div className="bg"></div>
				<div className="content-holder">
					<div className="dialog">
						<div className="story">
							<h1>SpaceHunt - Episode 1</h1>
							<h2>Unexpected kidnap</h2>
							<p>The year 3020 is written, and travel between planets and galaxies is finally becoming common, but this fact carries some pitfalls. The technological war between the Earth and the planet Eslan from a nearby galaxy broke out. During this battle, one of the respected biologists, Lucy Mikelson was abducted for unknown reasons. However, the government refuses to take part in any rescue action. Thus, everything remains in the hands of Lucy's husband Freddy Mikelson.</p>
							<button className="submit" onclick={this.onClick.bind(this)}>Continue to read the story!</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

}
