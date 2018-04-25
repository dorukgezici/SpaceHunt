import { Vector } from "excalibur";
import { Component, InterfaceBuilder } from "../../InterfaceBuilder";
import CanvasAbstraction from "./CanvasAbstraction";
import { IKeyInterface, IKeyNames } from "./NameEnquiry";
import PlayerAnimationMovementCanvas from "./PlayerAnimationMovementCanvas";
import PlayerControls from "./PlayerControls";

interface IAttrs {
	keys: IKeyInterface;
	keyNames?: IKeyNames;
	position: "right" | "left";
	hidden?: boolean;
	ref?: (pb: PlayerBox) => void;
	refCA?: (ca: CanvasAbstraction) => void;
	refPC?: (ca: PlayerControls) => void;
	refPAMC?: (pamc: PlayerAnimationMovementCanvas) => void;
	refInput?: (input: HTMLInputElement) => void;
	onBlur?: () => void;
	onFocus?: () => void;
}

export default class PlayerBox extends Component<IAttrs> {

	// @ts-ignore
	public holder: HTMLDivElement;
	// @ts-ignore
	public input: HTMLInputElement;

	blinkError() {
		this.input.animate([{
			// background: "#c53e3e00",
			borderBottomColor: "#c53e3e00"
		}, {
			// background: "#c53e3e55",
			borderBottomColor: "#c53e3e"
		}, {
			// background: "#c53e3e00",
			borderBottomColor: "#c53e3e00"
		}], {
				duration: 500
			});
	}

	toggleDisplay(visible: boolean = this.holder.style.display === "none") {
		this.holder.style.display = visible ? "block" : "none";
	}

	toggleHidden(hidden: boolean = !this.holder.classList.contains("hide")) {
		if (hidden)
			this.holder.classList.add("hide");
		else
			this.holder.classList.remove("hide");
	}

	render(attrs: IAttrs, children: JSX.Children) {
		const ret = (
			<div
				className={`display-box player-box ${attrs.position + (attrs.hidden ? " hide" : "")}`}
				style={{ display: attrs.hidden ? "none" : "block" }}
				ref={e => this.holder = e}>
				<div className="canvas-holder">
					<CanvasAbstraction ref={attrs.refCA} />
				</div>
				<div className="container">
					<div className="player-split">
						<div className="player-info">
							<h1>{children}</h1>
							<input
								ref={e => (this.input = e, attrs.refInput && attrs.refInput(e))}
								type="text"
								maxLength={24}
								placeholder="Name"
								onfocus={attrs.onFocus}
								onblur={attrs.onBlur}
							/>
							<PlayerControls keys={attrs.keys} keyNames={attrs.keyNames} ref={attrs.refPC} />
						</div>
						<div className="player-model">
							<canvas
								width="110"
								height="150"
								ref={e => {
									const pamc = new PlayerAnimationMovementCanvas(e, attrs.keys, new Vector(e.width / 2, e.height - 10));
									if (attrs.refPAMC)
										attrs.refPAMC(pamc);
								}}
							/>
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
