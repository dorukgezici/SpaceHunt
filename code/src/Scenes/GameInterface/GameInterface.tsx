import { AnimationSequence } from "../../Components/AnimationSequence";
import { Component, InterfaceBuilder } from "../../InterfaceBuilder";
import GameBar from "../GameBar/GameBar";
import { GameBootstrap } from "../../GameBootstrap";
import ParticlesJS from "../../Components/ParticlesJS";
import StarWarsIntro from "../StarWarsIntro/StarWarsIntro";
import NameEnquiry from "./NameEnquiry";
import Modal, { ModalContentWrapper } from "./Modal";
require("./game-interface.scss");
const particlesJSConfig = require("./ParticlesJSConfig.json");
const audioURL = require<string>("../../Resources/Audio/intro.mp3");

interface IEvents { }
interface IAttrs {
	bootstrap: GameBootstrap;
	ref?: (gameInterface: GameInterface) => void;
}

const transitionDuration = 2000;
const homeParticlesID = "home-particles";

export default class GameInterface extends Component<IAttrs, IEvents> {

	canvas = <canvas id="canvas" height="600" width="800" /> as HTMLCanvasElement;
	// @ts-ignore
	public app: HTMLDivElement;
	// @ts-ignore
	private viewportWrapper: HTMLDivElement;
	// @ts-ignore
	private displayAbove: HTMLDivElement;
	// @ts-ignore
	private displayBelow: HTMLDivElement;
	// @ts-ignore
	private starWarsIntro: StarWarsIntro;
	// @ts-ignore
	private modal: Modal;
	private upAnimation: AnimationSequence;
	private downAnimation: AnimationSequence;
	private particles: ParticlesJS | null = null;
	private introAudio = new Audio(audioURL);
	private isUp = false;

	constructor(attrs: IAttrs) {
		super(attrs);
		this.introAudio.load();
		this.upAnimation = new AnimationSequence([
			() => this.displayAbove.style.display = "block",
			() => this.viewportWrapper.classList.add("up"),
			() => this.displayAboveShown(),
			transitionDuration,
			() => this.displayBelow.style.display = "none",
			() => this.displayBelowHidden(),
		]);
		this.downAnimation = new AnimationSequence([
			() => this.displayBelow.style.display = "block",
			() => this.viewportWrapper.classList.remove("up"),
			() => this.displayBelowShown(),
			transitionDuration,
			() => this.displayAbove.style.display = "none",
			() => this.displayAboveHidden(),
		]);
	}

	protected moveUp() {
		if (this.isUp) return;
		this.isUp = true;
		this.downAnimation.cancel();
		this.upAnimation.start();
	}

	protected moveDown() {
		if (!this.isUp) return;
		this.isUp = false;
		this.upAnimation.cancel();
		this.downAnimation.start();
	}

	showIntro() {
		this.starWarsIntro.showIntro();
		this.moveUp();
		return new Promise(resolve => {
			this.starWarsIntro.once("done", () => {
				this.moveDown();
				resolve();
			});
		});
	}

	showTransition(text: string) {
		this.starWarsIntro.showText(text);
		this.moveUp();
		return new Promise(resolve => {
			this.starWarsIntro.once("done", () => {
				this.moveDown();
				resolve();
			});
		});
	}

	private displayBelowHidden() {
		if (this.particles) {
			this.particles.destroy();
			this.particles = null;
		}
	}

	private displayBelowShown() {
		if (this.particles)
			this.particles.destroy();
		requestAnimationFrame(() =>
			this.particles = new ParticlesJS(homeParticlesID, particlesJSConfig)
		);
	}

	private displayAboveHidden() { /* */ }

	private displayAboveShown() { /* */ }

	private start(name1: string, name2?: string) {
		this.showIntro();
	}

	private showModal() {
		this.modal.show();
	}

	render(attrs: IAttrs) {
		const { bootstrap, ref } = attrs;
		const { canvas, app } = this;

		const ret = (
			<div id="viewport-wrapper" ref={e => this.viewportWrapper = e}>

				<div className="display-above bg-stars" ref={e => this.displayAbove = e}>
					<StarWarsIntro ref={swi => this.starWarsIntro = swi} />
				</div>

				<div className="display-below" ref={e => this.displayBelow = e}>
					<Modal ref={m => this.modal = m}>
						<div style={{ height: "100%" }}>
							<div className="background saturn-bg-holder">
								<div className="abstract-canvas-holder" id={homeParticlesID} />
								<div className="saturn" />
								<div className="bg" />
							</div>

							<div id="canvas-holder">
								<div id="canvas-wrapper">
									<GameBar bootstrap={bootstrap} />
									{canvas}
								</div>
							</div>

							<div id="name-enquiry-wrapper">
								<NameEnquiry info={this.showModal.bind(this)} start={this.start.bind(this)} />
							</div>

							<div id="app" style={{ top: "100vh" }} ref={app => this.app = app}></div>
						</div>

						<ModalContentWrapper>
							<div>
								<h1>About SpaceHunt</h1>
								<p>Game developed by:</p>
								<ul>
									<li>Ali Doruk Gezici</li>
									<li>Anna Vankova</li>
									<li>Milos Svana</li>
									<li>Nejc Maček</li>
									<li>Wladimir Hofmann</li>
								</ul>
								<p style={{ textAlign: "right" }}>
									<button className="control" onclick={() => this.modal.hide()}>🡰</button>
								</p>
							</div>
						</ModalContentWrapper>

					</Modal>
				</div>
			</div>
		);

		window.requestAnimationFrame(() =>
			this.displayBelowShown()
		);

		if (attrs.ref)
			attrs.ref(this);

		return ret;
	}

}
