import { Class } from "../../Class";
import { IGameElement, GameBootstrap, IGameElementEvents, IGameEventValue, GameElementDoneType } from "../../GameBootstrap";
import { InterfaceBuilder } from "../../InterfaceBuilder";
import { IStory, intro, level1, level2, level3, level4, end, death } from "./Story";
require("./style.scss");

export default class Intro extends Class implements IGameElement {

	private gameBoostrap: GameBootstrap;
	private storyElement: HTMLElement;
	private story: [IStory];
	private storyPage: number; // index of a page of a story

	init(bootstrap: GameBootstrap) {
		this.gameBoostrap = bootstrap;
		this.story = [intro, level1, level2, level3, level4, end, death];
		this.storyPage = 0;
	}

	private renderStoryPage() {
		InterfaceBuilder.replaceContent(this.storyElement, this.story[this.storyPage]);
	}

	start() {
		InterfaceBuilder.dispalyDefault(this.render());
		this.renderStoryPage();
	}

	dispose() {
		InterfaceBuilder.clearDefault();
	}

	private done() {
		this.storyPage = 0;
		this.emit("done", { target: this, type: GameElementDoneType.Finished });
	}

	private onClick() {
		this.storyPage++;
		if (this.storyPage >= this.story.length)
			this.done();
		else
			this.renderStoryPage();
	}

	private render() {
		return (
			<div id="intro">
				<div className="bg"></div>
				<div className="content-holder">
					<div className="dialog">
						<div className="story">
							<div ref={elt => this.storyElement = elt}></div>
							<button className="submit" onclick={this.onClick.bind(this)}>Continue to read the story!</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

}
