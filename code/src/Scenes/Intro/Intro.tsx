import { Class } from "../../Class";
import { IGameElement, GameBootstrap, IGameElementEvents, IGameEventValue, GameElementDoneType } from "../../GameBootstrap";
import { InterfaceBuilder } from "../../InterfaceBuilder";
import { IStory } from "./Story";
require("./style.scss");

export default class Intro extends Class implements IGameElement {

	private gameBoostrap: GameBootstrap;
	private storyElement?: HTMLElement;
	private button?: HTMLButtonElement;
	private story?: IStory;
	private storyPage: number; // index of a page of a story

	constructor(bootstrap: GameBootstrap, story: IStory) {
		super();

		this.gameBoostrap = bootstrap;
		this.storyPage = 0;
		this.story = story;

		InterfaceBuilder.displayDefault(this.render());
		this.renderStoryPage();
		if (this.button)
			this.button.focus();
	}

	dispose() {
		InterfaceBuilder.clearDefault();
	}

	private renderStoryPage() {
		if (this.storyElement && this.story)
			InterfaceBuilder.replaceContent(this.storyElement, this.story[this.storyPage]);
	}

	setStory(story?: IStory, storyPage = 0) {
		this.story = story;
		this.storyPage = storyPage;
		this.renderStoryPage();
	}

	private done() {
		this.storyPage = 0;
		this.emit("done", { target: this, type: GameElementDoneType.Finished });
	}

	private onClick() {
		this.storyPage++;
		if (!this.story || this.storyPage >= this.story.length)
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
							<button ref={elt => this.button = elt} autoFocus className="submit" onclick={this.onClick.bind(this)}>Continue!</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

}
