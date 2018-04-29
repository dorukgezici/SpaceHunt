import { AnimationSequence } from "../../Components/Animations/AnimationSequence";
import { texture, textureBro, textureDuck, textureDuckBro } from "../../Components/Animations/Models/MikelsonParts";
import { IControlSet, controlSets } from "../../Components/BasePlayer";
import { GameBootstrap } from "../../GameBootstrap";
import { Component, InterfaceBuilder } from "../../InterfaceBuilder";
import CanvasAbstraction from "./CanvasAbstraction";
import PlayerBox from "./PlayerBox";
require("./name-enquiry.scss");

export type IKeyNames = {
	[T in keyof IControlSet]?: string;
};

interface IAttrs {
	ref?: (ne: NameEnquiry) => void;
	start?: (name1: string, name2?: string) => void;
	info?: () => void;
	bootstrap: GameBootstrap;
}

export default class NameEnquiry extends Component<IAttrs> {

	// @ts-ignore
	private input1: HTMLInputElement;
	// @ts-ignore
	private input2: HTMLInputElement;
	// @ts-ignore
	private secondPlayerHolder: HTMLDivElement;
	// @ts-ignore
	private secondPlayerWrapper: HTMLDivElement;
	// @ts-ignore
	private separator: HTMLDivElement;
	// @ts-ignore
	private htmlCircle: HTMLDivElement;
	// @ts-ignore
	private ca1: CanvasAbstraction;
	// @ts-ignore
	private ca2: CanvasAbstraction;
	// @ts-ignore
	private pc1: PlayerControls;
	// @ts-ignore
	private pc2: PlayerControls;
	// @ts-ignore
	private addButton: HTMLButtonElement;
	// @ts-ignore
	private pamc1: PlayerAnimationMovementCanvas;
	// @ts-ignore
	private pamc2: PlayerAnimationMovementCanvas;
	// @ts-ignore
	private pb1: PlayerBox;
	// @ts-ignore
	private pb2: PlayerBox;
	private secondPlayer = false;
	private animationSequence?: AnimationSequence | unset;
	private inited = false;

	private async start() {
		this.ca1.canvas.style.opacity = "0.4";
		this.ca2.canvas.style.opacity = "0.4";
		this.ca1.renderer.start();
		this.pc1.startListening();

		const p1 = texture.load();
		const p2 = textureDuck.load();
		const p3 = textureBro.load();
		const p4 = textureDuckBro.load();
		await p1;
		await p2;
		await p3;
		await p4;
		this.inited = true;
		this.pamc1.startListening();
		this.pamc1.start();
	}

	private addPlayer() {
		if (this.animationSequence)
			this.animationSequence.cancel();
		this.animationSequence = new AnimationSequence([
			() => {
				this.secondPlayerHolder.style.width = "0";
				this.secondPlayerWrapper.classList.add("absolute");
				this.pb2.toggleDisplay(true);
			},
			() => {
				this.secondPlayerHolder.style.width = this.pb2.holder.offsetWidth + "px";
				this.pb2.toggleHidden(false);
				this.separator.classList.add("right");
				this.p2AddedHandler();
			},
			1000,
			() => {
				this.secondPlayerHolder.style.width = null;
				this.secondPlayerWrapper.classList.remove("absolute");
			}
		]);
		this.animationSequence.start();
	}

	private removePlayer() {
		if (this.animationSequence)
			this.animationSequence.cancel();
		this.animationSequence = new AnimationSequence([
			() => {
				this.secondPlayerHolder.style.width = this.pb2.holder.offsetWidth + "px";
				this.secondPlayerWrapper.classList.add("absolute");
				this.separator.classList.remove("right");
			},
			() => {
				this.secondPlayerHolder.style.width = "0";
				this.pb2.toggleHidden(true);
			},
			1000,
			() => {
				this.pb2.toggleDisplay(false);
				this.p2RemovedHandler();
			}
		]);
		this.animationSequence.start();
	}

	private p2AddedHandler() {
		this.pc2.startListening();
		this.pamc2.start();
		this.pamc2.startListening();
		this.ca2.renderer.start();
	}

	private p1AddedHandler() {
		this.pc1.startListening();
		this.pamc1.start();
		this.pamc1.startListening();
		this.ca1.renderer.start();
	}

	private p2RemovedHandler() {
		this.pc2.stopListening();
		this.pamc2.stop();
		this.pamc2.stopListening();
		this.ca2.renderer.clear();
		this.ca2.renderer.stop();
	}

	private p1RemovedHandler() {
		this.pc1.stopListening();
		this.pamc1.stop();
		this.pamc1.stopListening();
		this.ca1.renderer.clear();
		this.ca1.renderer.stop();
	}

	private secondPlayerClick() {
		if (this.secondPlayer) {
			this.addButton.classList.add("rotate");
			this.secondPlayer = false;
			this.removePlayer();
		} else {
			this.addButton.classList.remove("rotate");
			this.secondPlayer = true;
			this.addPlayer();
		}
	}

	stopListening() {
		if (!this.inited) return;
		this.p1RemovedHandler();
		if (this.secondPlayer)
			this.p2RemovedHandler();
	}

	startListening() {
		if (!this.inited) return;
		this.p1AddedHandler();
		if (this.secondPlayer)
			this.p2AddedHandler();
	}

	render(attrs: IAttrs) {
		setTimeout(this.start.bind(this));

		const ret = (
			<div id="name-enquiry">
				<div className="container">

					<PlayerBox
						position="left"
						isBro={false}
						keys={controlSets.controls1}
						keyNames={{ left: "⬅", right: "➡", up: "⬆", down: "⬇" }}
						value={attrs.bootstrap.state.names[0]}
						ref={pb => this.pb1 = pb}
						refCA={ca => this.ca1 = ca}
						refPC={pc => this.pc1 = pc}
						refPAMC={pamc => this.pamc1 = pamc}
						refInput={input => this.input1 = input}
						onBlur={() => this.blurInputP1()}
						onFocus={() => this.focusInputP1()}
					>
						Player #1
					</PlayerBox>

					<div className="separator" ref={e => this.separator = e}>
						<div></div>
						<div
							className="start"
							onmousedown={e => (e.currentTarget as HTMLDivElement).classList.add("toggled")}
							onmouseleave={e => (e.currentTarget as HTMLDivElement).classList.remove("toggled")}
							onclick={this.onStart.bind(this)}
						>
							<div className="html-circle" ref={e => this.htmlCircle = e}></div>
							<div ref={e => e.innerHTML = `
								<svg width="120" height="120" class="play-icon" viewBox="0 0 120 120">
									<circle class="circle" r="56" cx="60" cy="60"></circle>
									<polygon points="44,40 84,60 44,80" class="play"></polygon>
								</svg>
								`} />
						</div>
						<div className="controls">
							<button className="control" onclick={() => attrs.info && attrs.info()}>?</button>
							<button className="control rotate" ref={e => this.addButton = e} onclick={this.secondPlayerClick.bind(this)}>
								<span>×</span>
							</button>
						</div>
					</div>

					<div className="player-box-holder" ref={e => this.secondPlayerHolder = e}>
						<div className="player-box-wrapper" ref={e => this.secondPlayerWrapper = e}>
							<PlayerBox
								position="right"
								isBro={true}
								keys={controlSets.controls2}
								value={attrs.bootstrap.state.names[1]}
								hidden={true}
								ref={pb => this.pb2 = pb}
								refCA={ca => this.ca2 = ca}
								refPC={pc => this.pc2 = pc}
								refPAMC={pamc => this.pamc2 = pamc}
								refInput={input => this.input2 = input}
								onBlur={() => this.blurInputP2()}
								onFocus={() => this.focusInputP2()}
							>
								Player #2
							</PlayerBox>
						</div>
					</div>

				</div>
			</div>
		);

		if (attrs.ref)
			attrs.ref(this);

		return ret;
	}

	private blinkError() {
		this.htmlCircle.animate([{
			background: "rgba(34, 117, 185, 0.8)",
			boxShadow: "0 0 4px 4px rgba(34, 117, 185, 0.8)"
		}, {
			background: "rgba(197, 62, 62, 0.8)",
			boxShadow: "0 0 4px 4px rgba(197, 62, 62, 0.8)"
		}, {
			background: "rgba(34, 117, 185, 0.8)",
			boxShadow: "0 0 4px 4px rgba(34, 117, 185, 0.8)"
		}], {
				duration: 500
			});
	}

	private onStart() {
		const { start, info } = this.attrs;
		if (!start) return;

		const name1 = this.input1.value.trim();
		const name2 = this.secondPlayer ? this.input2.value.trim() : undefined;

		const name1ok = !!name1;
		const name2ok = this.secondPlayer ? (name2 && name2 !== name1) : true;

		if (name1ok && name2ok) {
			if (start)
				start(name1, name2);
		} else {
			this.blinkError();
			if (!name1ok)
				this.pb1.blinkError();
			if (!name2ok)
				this.pb2.blinkError();
		}
	}

	private focusInputP1() {
		this.pc1.stopListening();
		this.pamc1.stopListening();
	}

	private blurInputP1() {
		this.pc1.startListening();
		this.pamc1.startListening();
	}

	private focusInputP2() {
		this.pc2.stopListening();
		this.pamc2.stopListening();
	}

	private blurInputP2() {
		this.pc2.startListening();
		this.pamc2.startListening();
	}

}
