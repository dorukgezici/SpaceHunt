import { Class } from "../../Class";
import { IGameElement, GameBootstrap, IGameElementEvents, IGameEventValue, GameElementDoneType } from "../../GameBootstrap";
import { InterfaceBuilder } from "../../InterfaceBuilder";
require("./style.scss");

export class NameEnquiry extends Class implements IGameElement {

	private inputElement: HTMLInputElement;
	private gameBoostrap: GameBootstrap;

	get value() {
		return this.inputElement && this.inputElement.value.trim() || null;
	}

	init(bootstrap: GameBootstrap) {
		this.gameBoostrap = bootstrap;
	}

	start() {
		InterfaceBuilder.dispalyDefault(this.render());
		this.inputElement.select();
	}

	dispose() {
		InterfaceBuilder.clearDefault();
	}

	private done() {
		this.gameBoostrap.state.name = this.value;
		this.emit("done", { target: this, type: GameElementDoneType.Finished });
	}

	private onClick() {
		if (this.value) {
			this.done();
		} else
			alert("Please enter a name.");
	}

	private onKeyPress(keyCode: number) {
		if (keyCode === 13) // enter
			this.done();
	}

	private render() {
		return (
			<div id="pname-enquiry">
				<div className="bg"></div>
				<div className="content-holder">
					<div className="dialog">
						<div className="label">Enter your name:</div>
						<div className="form">
							<input
								ref={elt => this.inputElement = elt}
								className="name"
								type="text"
								onpointerdown={e => e.target.focus()}
								value={this.value || this.gameBoostrap.state.name || ""}
								onkeyup={e => this.onKeyPress(e.keyCode)}
								autoFocus
								maxLength={32}
							/>
							<button className="submit" onpointerdown={this.onClick.bind(this)}>Let's go!</button>
						</div>
					</div>
				</div>
			</div >
		);
	}

}
