import { AnimationSequence } from "../../Components/Animations/AnimationSequence";
import ParticlesJS from "../../Components/ParticlesJS";
import { GameBootstrap } from "../../GameBootstrap";
import { Component, InterfaceBuilder } from "../../InterfaceBuilder";
import GameBar from "./GameBar";
import Modal, { ModalContentWrapper } from "./Modal";
import NameEnquiry from "./NameEnquiry";
import StarWarsIntro from "./StarWarsIntro";
require("./game-interface.scss");
const particlesJSConfig = require<{}>("./ParticlesJSConfig.json");
const audioURL = require<string>("../../Resources/Audio/intro.mp3");

interface IEvents {
	moveDown: undefined;
	movedDown: undefined;
	moveUp: undefined;
	movedUp: undefined;
	playClicked: string[];
	levelSelected: { level: number, players: number };
}

interface IAttrs {
	bootstrap: GameBootstrap;
	ref?: (gameInterface: GameInterface) => void;
}

type IContentType = "menu" | "game";

const transitionDuration = 2000;
const homeParticlesID = "home-particles";

export default class GameInterface extends Component<IAttrs, IEvents> {

	canvas = <canvas id="canvas" height="600" width="800" /> as HTMLCanvasElement;
	// @ts-ignore
	public menu: HTMLDivElement;
	// @ts-ignore
	public canvasHolder: HTMLDivElement;
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
	// @ts-ignore
	private nameEnquiry: NameEnquiry;
	private upAnimation: AnimationSequence;
	private downAnimation: AnimationSequence;
	private particles: ParticlesJS | null = null;
	private introAudio = new Audio(audioURL);
	private isUp = false;
	private type: IContentType = "menu";

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

	async showIntro() {
		await this.starWarsIntro.showIntro();
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

	setContentType(type: IContentType) {
		if (type === this.type)
			return;
		this.type = type;
		if (type === "menu") {
			this.menu.style.display = "block";
			this.canvasHolder.style.display = "none";
			this.startAnimations();
		} else {
			if (!this.isUp)
				this.stopAnimations();
			this.menu.style.display = "none";
			this.canvasHolder.style.display = "flex";
		}
	}

	private displayBelowHidden() {
		this.stopAnimations();
		this.emit("movedUp", void (0));
	}

	private displayBelowShown() {
		if (this.type === "menu")
			this.startAnimations();
		this.emit("moveDown", void (0));
	}

	private displayAboveHidden() {
		this.emit("movedDown", void (0));
	}

	private displayAboveShown() {
		this.emit("moveUp", void (0));
	}

	private stopAnimations() {
		this.nameEnquiry.stopListening();
		if (this.particles) {
			this.particles.destroy();
			this.particles = null;
		}
	}

	private startAnimations() {
		this.nameEnquiry.startListening();
		if (this.particles)
			this.particles.destroy();
		else
			this.particles = new ParticlesJS(homeParticlesID, particlesJSConfig);
	}

	private onStart(name1: string, name2?: string) {
		const names = name2 ? [name1, name2] : [name1];
		this.emit("playClicked", names);
	}

	private showModal() {
		this.modal.show();
	}

	private menuClick(level: number, players: number) {
		this.emit("levelSelected", { level, players });
	}

	render(attrs: IAttrs) {
		const { bootstrap, ref } = attrs;
		const { canvas } = this;

		const ret = (
			<div id="viewport-wrapper" ref={e => this.viewportWrapper = e}>

				<div className="display-above bg-stars" ref={e => this.displayAbove = e} style={{ display: "none" }}>
					<StarWarsIntro bootstrap={attrs.bootstrap} ref={swi => this.starWarsIntro = swi} />
				</div>

				<div className="display-below" ref={e => this.displayBelow = e}>
					<Modal ref={m => this.modal = m}>
						<div style={{ height: "100%" }}>
							<div className="background saturn-bg-holder">
								<div className="abstract-canvas-holder" id={homeParticlesID} />
								<div className="saturn" />
								<div className="bg" />
							</div>

							<div id="canvas-holder" ref={e => this.canvasHolder = e} style={{ display: "none" }}>
								<div id="canvas-wrapper">
									<GameBar bootstrap={bootstrap} />
									{canvas}
								</div>
							</div>

							<div id="name-enquiry-wrapper" ref={e => this.menu = e}>
								<NameEnquiry ref={ne => this.nameEnquiry = ne} bootstrap={bootstrap} info={this.showModal.bind(this)} start={this.onStart.bind(this)} />
								{window.ENV === "dev" && (
									<div id="menu">
										{[1, 2, 3, 4].map((t, i) => (
											<div className="menu-item">
												<span>Level {t}</span>
												<button className="control small" onclick={() => this.menuClick(i, 1)}>1p</button>
												<button className="control small" onclick={() => this.menuClick(i, 2)}>2p</button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						<ModalContentWrapper>
							<div>
								<h1>SpaceHunt</h1>
								<p>This game was developed as an assignment in spring 2018, within course Software Engineering Methodologies in TUT, by:</p>
								<ul>
									<li>Nejc Maček</li>
									<li>Miloš Švaňa</li>
									<li>Wladimir Hofmann</li>
									<li>Ali Doruk Gezici</li>
									<li>Anna Vaňková</li>
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
