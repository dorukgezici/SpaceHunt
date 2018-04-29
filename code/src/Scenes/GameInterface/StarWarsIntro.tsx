import { AnimationSequence } from "../../Components/Animations/AnimationSequence";
import { preloadAudio } from "../../Components/Preloader";
import { GameBootstrap } from "../../GameBootstrap";
import { Component, InterfaceBuilder } from "../../InterfaceBuilder";
const audioURL = require<string>("../../Resources/Audio/intro.mp3");
require("./star-wars-intro.scss");

const preludeText = "Let me tell you a story from our distant future...";
const episodeText = "Episode 1";
const titleText = "Unexpected kidnap";
const storyText = ({ state: { names } }: GameBootstrap) => [
	"The year 3020 is written, and travel between planets and galaxies is finally becoming common, but this fact carries some pitfalls. The technological war between the Earth and the planet Eslan from a nearby galaxy broke out.",
	"During this battle, one of the respected biologists, Lucy Mikelson was abducted for unknown reasons. However, the government refuses to take part in any rescue action. Thus, everything remains in the hands of " + (names[1]
		? `${names[0]} and ${names[1]}.`
		: `${names[0]}.`
	),
	`After a long intergalactic flight, ${names[1] ? `${names[0]} and ${names[1]} finally arrive` : `${names[0]} finally arrives`} to the planet Eslan, which, except for the absence of animals, does not differ from Earth. The landing was not smooth and the first task is to get away from the crowns of huge trees in the jungle.`
];

const timing = {
	beforePrelude: 6500,
	prelude: 12300,
	afterPrelude: 6150,
	logoFlow: 16000,
	crawlDelay: 3000,
	crawlDuration: 67200,
	after: 1000
};

function createCrawlHandler(crawl: HTMLElement, endCallback: () => void) {
	return new AnimationSequence([
		[
			() => crawl.style.display = "flex",
			() => crawl.style.opacity = "1",
			{
				from: 100,
				to: 0,
				duration: 20000,
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

function createHandlers(prelude: HTMLElement, logo: SVGElement, crawl: HTMLElement, doneFn: () => void, awaitLoading: Promise<any> | boolean, showLoading: () => void) {
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
			]),
			new AnimationSequence([
				timing.crawlDuration - 2000,
				showLoading,
				awaitLoading,
				() => doneFn(),
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
	return preludeAH;
}

interface IEvents {
	done: void; // animation is done, ready for transition
	finished: void; // animation has completely ended
}

interface IAttrs {
	ref?: (e: StarWarsIntro) => void;
	bootstrap: GameBootstrap;
}

export default class StarWarsIntro extends Component<IAttrs, IEvents> {

	private prelude?: HTMLElement;
	private loading?: HTMLElement;
	private storyElement?: HTMLElement;
	private crawl?: HTMLElement;
	private crawlText?: HTMLElement;
	private logo?: SVGElement;
	private animation: AnimationSequence | unset = null;
	private audio: HTMLAudioElement;
	private isDone = true;
	private running = false;
	private fadeAudioId = NaN;
	audioEnabled = true;

	constructor(attrs: IAttrs) {
		super(attrs);
		this.audio = preloadAudio(audioURL).audio;
		this.audio.currentTime = 0.5;
	}

	showIntro(): Promise<any> {
		const { running, prelude, logo, crawl, storyElement, audio, audioEnabled, attrs } = this;
		if (!prelude || !logo || !crawl || !storyElement)
			throw new Error("Component not rendered.");

		this.start();

		InterfaceBuilder.replaceContent(storyElement, storyText(attrs.bootstrap).map(t => <p>{t}</p>));
		const awaitLoading = attrs.bootstrap.state.loaded || new Promise(resolve => attrs.bootstrap.stateListener.once("loaded", resolve));
		const showLoading = () => {
			if (!attrs.bootstrap.state.loaded)
				this.toggleLoading(true);
		};

		const animation = createHandlers(prelude, logo, crawl, this.done.bind(this), awaitLoading, showLoading);

		const promise = Promise.race([
			new Promise(resolve => setTimeout(resolve, 300)),
			new Promise(resolve => {
				const callback = () => {
					resolve();
					audio.removeEventListener("playing", callback);
				};
				audio.addEventListener("playing", callback);
			})
		]);

		this.animation = new AnimationSequence([
			promise,
			animation
		]);

		if (audioEnabled) {
			audio.currentTime = 0.5;
			audio.volume = 1;
			audio.play();
		}

		this.animation.once("finished", this.end.bind(this));
		promise.then(() => this.animation && this.animation.start());

		return new Promise(resolve => promise.then(() => setTimeout(resolve, 100)));
	}

	showText(text: string) {
		if (!this.crawlText)
			throw new Error("Component not rendered.");
		this.start();
		const p = this.crawlText.children[0].children[0] as HTMLElement;
		p.innerText = text;
		const animation = this.animation = createCrawlHandler(this.crawlText, this.done.bind(this));
		animation.once("finished", this.end.bind(this));
		animation.start();
	}

	private fadeAudio(time = 2000) {
		const start = performance.now();
		const end = start + Math.abs(time);
		const initValue = this.audio.volume;

		if (!Number.isNaN(this.fadeAudioId) || this.audio.paused || this.audio.volume === 0)
			return;

		this.fadeAudioId = setInterval(() => {
			const t = performance.now();
			let vol = Math.max(0, Math.min(1, initValue * (end - t) / (end - start)));
			vol = vol ** 2;
			this.audio.volume = vol;
			if (vol === 0) {
				this.audio.pause();
				this.cancelFadeAudio();
			}
		}, 10);
	}

	private cancelFadeAudio() {
		if (!Number.isNaN(this.fadeAudioId)) {
			clearTimeout(this.fadeAudioId);
			this.fadeAudioId = NaN;
		}
	}

	/**
	 * Sets listeners and running state.
	 */
	private start() {
		if (this.running)
			this.stop();
		this.toggleLoading(false);
		this.running = true;
		this.isDone = false;
		window.addEventListener("keypress", this.onKey);
	}

	/**
	 * Ends the animation.
	 */
	private end() {
		document.removeEventListener("keypress", this.onKey);
		if (!this.isDone)
			this.done();
		if (this.running)
			this.emit("finished", void (0));
		this.running = false;
		if (!this.audio.paused)
			this.fadeAudio();
	}

	/**
	 * Cancels all pending animations.
	 */
	private cancel() {
		if (this.animation)
			this.animation.cancel();
	}

	/**
	 * Emits the `done` event and fades audio away.
	 * 
	 * Represents the event when all animations are done, but haven't finished.
	 */
	private done() {
		if (!this.isDone && this.running) {
			this.emit("done", void (0));
			this.isDone = true;
			this.fadeAudio();
		}
	}

	/**
	 * Puts an immediate stop to pending animations.
	 */
	stop() {
		this.cancel();
		this.end();
		if (!this.audio.paused)
			this.audio.pause();
		[this.prelude, this.logo, this.crawl, this.crawlText].forEach(t => t && (t.style.display = "none"));
	}

	private toggleLoading(show: boolean = this.attrs.bootstrap.state.loaded) {
		if (!this.loading)
			throw new Error("Component not rendered.");
		if (show)
			this.loading.classList.add("show");
		else
			this.loading.classList.remove("show");
	}

	skip() {
		const { bootstrap } = this.attrs;
		if (bootstrap.state.loaded)
			this.done();
		else {
			this.toggleLoading(true);
			bootstrap.stateListener.once("loaded", this.skip.bind(this));
		}
	}

	dispose() {
		this.cancel();
		this.end();
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
		const code = e.which || e.charCode || e.keyCode || 0;
		if (code === 32 || code === 27) // space or escape
			this.skip();
	}

	render(attrs: IAttrs) {
		const ret = (
			<div id="swintro">
				<div className="hidden">
					<span className="o">o</span>
					<span className="oa">oa</span>
				</div>
				<div className="blue-text loading" ref={e => this.loading = e}>
					Loading...
				</div>
				<div className="center-wrapper">
					<div ref={e => this.prelude = e} className="prelude blue-text">{preludeText}</div>
				</div>
				<div className="center-wrapper" ref={e => this.logo = this.fillSvg(e)}></div>
				<div className="perspective-wrapper">
					<div className="perspective-holder" ref={e => this.crawl = e}>
						<div className="perspective-content">
							<p className="episode">{episodeText}</p>
							<p className="title">{titleText}</p>
							<div className="story-text" ref={e => this.storyElement = e} />
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
