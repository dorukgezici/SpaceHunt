import { Class } from "../../Class";
import { IGameElement, IGameElementEvents, GameElementDoneType, GameBootstrap } from "../../GameBootstrap";
import { InterfaceBuilder, Component } from "../../InterfaceBuilder";
import { AnimationSequence } from "../../Components/AnimationSequence";
import { Resource } from "excalibur";
const audioURL = require<string>("../../Resources/Audio/intro.mp3");
require("./style.scss");

const preludeText = "Let me tell you a story from our distant future...";
const episodeText = "Episode 1";
const titleText = "Unexpected kidnap";
const storyText = [
	"The year 3020 is written, and travel between planets and galaxies is finally becoming common, but this fact carries some pitfalls. The technological war between the Earth and the planet Eslan from a nearby galaxy broke out.",
	"During this battle, one of the respected biologists, Lucy Mikelson was abducted for unknown reasons. However, the government refuses to take part in any rescue action. Thus, everything remains in the hands of Lucy's husband Freddy Mikelson."
];

const timing = {
	beforePrelude: 6500,
	prelude: 12300,
	afterPrelude: 6350,
	logoFlow: 16000,
	crawlDelay: 3000,
	crawlDuration: 60000,
	after: 1000
};

function createCrawlHandler(crawl: HTMLElement, endCallback: () => void) {
	return new AnimationSequence([
		[
			() => crawl.style.display = "flex",
			() => crawl.style.opacity = "1",
			{
				from: 100,
				to: 50,
				duration: 10000,
				callback: e => crawl.style.transform = `rotateX(50deg) translateY(${e}vh) translateZ(20vh)`
			},
			new AnimationSequence([
				8500,
				() => crawl.style.opacity = "0",
			]),
			new AnimationSequence([
				9000,
				endCallback
			])
		],
		() => crawl.style.display = "none"
	]);
}

function createHandlers(prelude: HTMLElement, logo: SVGElement, crawl: HTMLElement, fadeAudio: (volume: number) => void, doneFn: () => void) {
	const crawlAH = new AnimationSequence([
		timing.crawlDelay,
		[
			() => crawl.style.display = "flex",
			() => crawl.style.opacity = "1",
			{
				from: 100,
				to: 0,
				duration: timing.crawlDuration,
				callback: e => crawl.style.transform = `rotateX(50deg) translateY(${e}vh) translateZ(20vh)`
			},
			new AnimationSequence([
				timing.crawlDuration - 1000,
				() => crawl.style.opacity = "0"
			]),
			new AnimationSequence([
				timing.crawlDuration - 2000,
				() => doneFn(),
				{
					from: 1,
					to: 0,
					duration: 2000,
					easing: p => 1 - ((1 - p) ** 2),
					callback: fadeAudio
				}
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
		() => prelude.style.transform = "scale(0.6)",
		() => prelude.style.opacity = "1",
		() => prelude.style.display = "block",
		() => prelude.style.transform = "scale(1)",
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

interface IEvents {
	done: void; // animation is done, ready for transition
	finished: void; // animation has completely ended
}

interface IAttrs {
	ref?: (e: StarWarsIntro) => void;
}

export default class StarWarsIntro extends Component<IAttrs, IEvents> {

	private prelude?: HTMLElement;
	private crawl?: HTMLElement;
	private crawlText?: HTMLElement;
	private logo?: SVGElement;
	private handlers: AnimationSequence[] | unset = null;
	private audio = new Audio(audioURL);
	private isDone = true;
	private running = false;
	audioEnabled = true;

	constructor(attrs: IAttrs) {
		super(attrs);
		this.audio.preload = "auto";
		this.audio.currentTime = 0.2;
		this.audio.load();
	}

	showIntro() {
		const { running, prelude, logo, crawl } = this;
		if (!prelude || !logo || !crawl)
			throw new Error("Component not rendered.");
		this.start();
		const ahs = createHandlers(prelude, logo, crawl, volume => this.audio.volume = volume, this.done.bind(this));
		this.handlers = Object.values(ahs);
		ahs.preludeAH.once("finished", this.end.bind(this));
		if (this.audioEnabled) {
			this.audio.currentTime = 0.5;
			this.audio.volume = 1;
			this.audio.play();
		}
		ahs.preludeAH.start();
	}

	showText(text: string) {
		if (!this.crawlText)
			throw new Error("Component not rendered.");
		this.start();
		const p = this.crawlText.children[0].children[0] as HTMLElement;
		p.innerText = text;
		const ah = createCrawlHandler(this.crawlText, this.done.bind(this));
		ah.once("finished", this.end.bind(this));
		this.handlers = [ah];
		ah.start();
	}

	private start() {
		if (this.running)
			this.stop();
		this.running = true;
		this.isDone = false;
		window.addEventListener("keypress", this.onKey);
	}

	skip() {
		if (!this.running || this.isDone) return;
		this.done();
		const ah = new AnimationSequence([
			() => [this.prelude, this.logo, this.crawl, this.crawlText].forEach(t => {
				if (t && t.style.display !== "none") {
					t.style.opacity = "0";
				}
			}),
			(this.audio.paused
				? 1000
				: {
					from: 1,
					to: 0,
					duration: 1000,
					callback: i => this.audio.volume = i
				}
			),
			() => this.stop()
		]);
		if (this.handlers)
			this.handlers.push(ah);
		else
			this.handlers = [ah];
		ah.start();
	}

	private end() {
		document.removeEventListener("keypress", this.onKey);
		if (!this.isDone)
			this.done();
		if (this.running)
			this.emit("finished", void (0));
		this.running = false;
		if (!this.audio.paused)
			this.audio.pause();
	}

	private cancel() {
		if (this.handlers) {
			this.handlers.forEach(t => t.cancel());
			this.handlers = null;
		}
	}

	private done() {
		if (!this.isDone) {
			this.emit("done", void (0));
			this.isDone = true;
		}
	}

	stop() {
		this.cancel();
		this.end();
		[this.prelude, this.logo, this.crawl, this.crawlText].forEach(t => t && (t.style.display = "none"));
	}

	dispose() {
		this.cancel();
		this.end();
		InterfaceBuilder.clearDefault();
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

	onKey = (e: KeyboardEvent) => {
		if (e.keyCode === 32 || e.keyCode === 27) // space or escape
			this.skip();
	}

	render(attrs: IAttrs) {
		const ret = (
			<div id="swintro">
				<div className="hidden">
					<span className="o">o</span>
					<span className="oa">oa</span>
				</div>
				<div className="center-wrapper">
					<div ref={e => this.prelude = e} className="prelude">{preludeText}</div>
				</div>
				<div className="center-wrapper" ref={e => this.logo = this.fillSvg(e)}></div>
				<div className="perspective-wrapper">
					<div className="perspective-holder" ref={e => this.crawl = e}>
						<div className="perspective-content">
							<p className="episode">{episodeText}</p>
							<p className="title">{titleText}</p>
							{storyText.map(t => <p>{t}</p>)}
						</div>
					</div>
					<div className="perspective-holder" ref={e => this.crawlText = e}>
						<div className="perspective-content">
							<p />
						</div>
					</div>
				</div>
			</div>
		);

		if (attrs.ref)
			attrs.ref(this);

		return ret;
	}

}
