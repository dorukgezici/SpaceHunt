import { Class } from "../../Class";
import { IGameElement, IGameElementEvents, GameElementDoneType, GameBootstrap } from "../../GameBootstrap";
import { InterfaceBuilder } from "../../InterfaceBuilder";
import { AnimationSequence } from "../../Components/AnimationSequence";
import { Resource } from "excalibur";
const fontO = require<string>("../../Resources/Fonts/SF Distant Galaxy/SF Distant Galaxy Outline.ttf");
const fontAO = require<string>("../../Resources/Fonts/SF Distant Galaxy/SF Distant Galaxy AltOutline.ttf");
require("./style.scss");

const preludeText = "Let me tell you a story from our distant future...";
const episodeText = "Episode 1";
const titleText = "Unexpected kidnap";
const storyText = [
	"The year 3020 is written, and travel between planets and galaxies is finally becoming common, but this fact carries some pitfalls. The technological war between the Earth and the planet Eslan from a nearby galaxy broke out.",
	"During this battle, one of the respected biologists, Lucy Mikelson was abducted for unknown reasons. However, the government refuses to take part in any rescue action. Thus, everything remains in the hands of Lucy's husband Freddy Mikelson."
];

const timing = {
	beforePrelude: 2000,
	prelude: 4000,
	afterPrelude: 1000,
	logoFlow: 16000,
	crawlDelay: 3000,
	crawlDuration: 60000,
	after: 1000
};

function createHandlers(prelude: HTMLElement, logo: SVGElement, crawl: HTMLElement) {
	const crawlAH = new AnimationSequence([
		timing.crawlDelay,
		[
			() => crawl.style.display = "flex",
			() => crawl.style.opacity = "1",
			{
				from: 100,
				to: -30,
				duration: timing.crawlDuration,
				callback: e => crawl.style.transform = `rotateX(50deg) translateY(${e}vh) translateZ(20vh)`
			},
			new AnimationSequence([
				timing.crawlDuration - 1000,
				() => crawl.style.opacity = "0"
			])
		],
		() => crawl.style.display = "none"
	]);
	const logoAH = new AnimationSequence([
		[
			() => logo.style.display = "block",
			() => logo.style.opacity = "1",
			{
				from: 1,
				to: 0,
				duration: timing.logoFlow,
				callback: e => logo.style.transform = `scale(${(e ** 2) * 20 + 0.5})`
			},
			new AnimationSequence([
				timing.logoFlow - 1000,
				() => logo.style.opacity = "0"
			])
		],
		() => logo.style.display = "none"
	]);
	const preludeAH = new AnimationSequence([
		timing.beforePrelude,
		() => prelude.style.opacity = "1",
		timing.prelude,
		() => prelude.style.opacity = "0",
		1000,
		() => prelude.style.display = "none",
		timing.afterPrelude,
		[logoAH, crawlAH],
		timing.after
	]);
	return {
		preludeAH,
		logoAH,
		crawlAH
	};
}

export default class StarWarsIntro extends Class<IGameElementEvents> implements IGameElement {

	private handlers: AnimationSequence[] = [];

	init(bootstrap: GameBootstrap) {
		bootstrap.loader.addResources([
			new Resource(fontO, "blob"),
			new Resource(fontAO, "blob")
		]);
	}

	start(): void {
		const res = this.render();
		const ahs = createHandlers(res.prelude, res.logo, res.crawl);
		InterfaceBuilder.displayDefault(res.elt);
		this.handlers = [ahs.preludeAH, ahs.logoAH, ahs.crawlAH];
		ahs.preludeAH.once("done", this.finish.bind(this));
		ahs.preludeAH.start();
	}

	dispose(): void {
		this.handlers.forEach(t => t.cancel());
		InterfaceBuilder.clearDefault();
	}

	private finish() {
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Finished
		});
	}

	private fillSvg(elt: HTMLElement) {
		elt.innerHTML = `
			<svg id="spacehunt-logo" height="38" width="100">
				<text x="50" y="18">
					<tspan style="letter-spacing: -2px;">sP</tspan><tspan class="no-ligature" style="letter-spacing: -1.5px;">A</tspan>cE
				</text>
				<text x="50" y="36">
					{&gt;H<tspan class="no-ligature">U</tspan>nT
				</text>
			</svg>`;
		return elt.children[0] as SVGElement;
	}

	render() {
		let prelude: HTMLElement = null as any;
		let crawl: HTMLElement = null as any;
		let logo: SVGElement = null as any;
		const elt = (
			<div id="swintro" onclick={this.finish.bind(this)}>
				<div className="hidden">
					<span className="o">o</span>
					<span className="oa">oa</span>
				</div>
				<div className="center-wrapper">
					<div ref={e => prelude = e} className="prelude">{preludeText}</div>
				</div>
				<div className="center-wrapper" ref={e => logo = this.fillSvg(e)}></div>
				<div className="perspective-wrapper">
					<div className="perspective-holder" ref={e => crawl = e}>
						<div className="perspective-content">
							<p className="episode">{episodeText}</p>
							<p className="title">{titleText}</p>
							{storyText.map(t => <p>{t}</p>)}
						</div>
					</div>
				</div>
			</div >
		);
		return {
			prelude, crawl, logo, elt
		};
	}

}
