import { AnimationSequence } from "../../Components/Animations/AnimationSequence";
import Color from "../../Components/NoiseAbstraction/Color";
import { Component, InterfaceBuilder } from "../../InterfaceBuilder";
import CanvasAbstraction, { A } from "./CanvasAbstraction";
require("./modal-style.scss");

const modalSize = 400;

interface IAttrs {
	ref?: (m: Modal) => void;
}

export const ModalContentWrapper = (attrs: JSX.ElementAttrs<"div">, children: JSX.Children) => (
	<div {...attrs} className={(attrs.className || "") + " modal-content-wrapper"}>
		{children}
	</div>
);

/**
 * Modal box display.
 * 
 * First child is the content, second child is the dialog.
 */
export default class Modal extends Component<IAttrs> {

	// @ts-ignore
	private canvasAbstraction: CanvasAbstraction;
	// @ts-ignore
	private modalWrapper: HTMLDivElement;
	// @ts-ignore
	private modalDialog: HTMLDivElement;
	private modalInAnimation: AnimationSequence;
	private modalOutAnimation: AnimationSequence;

	constructor(attrs: IAttrs) {
		super(attrs);
		this.modalInAnimation = new AnimationSequence([
			() => this.modalDialog.style.display = "block",
			() => {
				this.modalWrapper.classList.add("toggled");
				this.canvasAbstraction.renderer.start();
			}
		]);
		this.modalOutAnimation = new AnimationSequence([
			() => this.modalWrapper.classList.remove("toggled"),
			1000,
			() => {
				this.canvasAbstraction.renderer.stop();
				this.modalDialog.style.display = "none";
			}
		]);
	}

	show() {
		this.modalOutAnimation.cancel();
		this.modalInAnimation.start();
	}

	hide() {
		this.modalInAnimation.cancel();
		this.modalOutAnimation.start();
	}

	render(attrs: IAttrs, children: JSX.Children) {
		const ret = (
			<div className="modal-wrapper" ref={e => this.modalWrapper = e}>
				<div className="modal-content">
					{children && children[0]}
				</div>
				<div className="modal-overlay" onclick={this.hide.bind(this)} />
				<div className="modal-dialog" ref={e => this.modalDialog = e}>
					<div className="container">
						<CanvasAbstraction baseColor={new Color.RGBA(229, 177, 58, A)} ref={ca => {
							this.canvasAbstraction = ca;
							ca.canvas.style.opacity = "0.4";
						}} />
						<div className="content">
							{children && children[1]}
						</div>
					</div>
					<div className="svg" ref={e => {
						const svg = (className: string) => `
							<svg
								width="${modalSize * 2}"
								height="${modalSize * 2}"
								class="modal-dialog-box ${className}"
								viewBox="0 0 ${modalSize * 2} ${modalSize * 2}"
							>
								<circle
									r="${modalSize}"
									cx="${modalSize}"
									cy="${modalSize}"
								/>
							</svg>`;
						e.innerHTML = svg("first") + svg("second");
					}} />
				</div>
			</div >

		);

		if (attrs.ref)
			attrs.ref(this);

		return ret;
	}

}
