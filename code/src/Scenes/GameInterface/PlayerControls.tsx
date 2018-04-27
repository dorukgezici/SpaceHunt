import { Input } from "excalibur";
import { Component, InterfaceBuilder } from "../../InterfaceBuilder";
import { IKeyInterface, IKeyNames } from "./NameEnquiry";

interface IAttrs {
	keys: IKeyInterface;
	keyNames?: IKeyNames;
	ref?: (pc: PlayerControls) => void;
}

export default class PlayerControls extends Component<IAttrs> {

	private listening = false;
	public isListening() { return this.listening; }
	// @ts-ignore
	private controls: {
		up: HTMLButtonElement,
		down: HTMLButtonElement,
		left: HTMLButtonElement,
		right: HTMLButtonElement
	} = {
			up: null,
			down: null,
			left: null,
			right: null
		};

	render(attrs: IAttrs) {
		const { controls } = this;
		const { keys, keyNames, ref } = attrs;

		const getKey = (s: keyof IKeyInterface) => {
			if (keyNames && s in keyNames)
				return keyNames[s];
			else
				return Input.Keys[keys[s]];
		};

		const Control = ({ key }: { key: keyof IKeyInterface }) => (
			<button
				className="control"
				ref={e => controls[key] = e}
				onkeydown={e => e.preventDefault()}
			>
				{getKey(key)}
			</button>
		);

		const ret = (
			<div className="controls">
				<div className="row">
					<Control key="left" />
					<div className="col">
						<Control key="up" />
						<Control key="down" />
					</div>
					<Control key="right" />
				</div>
			</div>
		);

		if (ref)
			ref(this);

		return ret;
	}

	private keyChanged(keyCode: number, toggled: boolean) {
		const { attrs: { keys }, controls } = this;

		const a = Object.entries(keys).find(t => t[1] === keyCode);
		if (!a) return;
		const key = a[0] as keyof IKeyInterface;
		if (toggled)
			controls[key].classList.add("toggled");
		else
			controls[key].classList.remove("toggled");
	}

	private onKeyDown = (e: KeyboardEvent) => {
		this.keyChanged(e.keyCode, true);
	}

	private onKeyUp = (e: KeyboardEvent) => {
		this.keyChanged(e.keyCode, false);
	}

	private unToggleAll() {
		Object.values(this.controls).forEach(t => {
			t.classList.remove("toggled");
		});
	}

	startListening() {
		if (this.listening) return;
		document.addEventListener("keydown", this.onKeyDown);
		document.addEventListener("keyup", this.onKeyUp);
		this.listening = true;
	}

	stopListening() {
		if (!this.listening) return;
		document.removeEventListener("keydown", this.onKeyDown);
		document.removeEventListener("keyup", this.onKeyUp);
		this.unToggleAll();
		this.listening = false;
	}

}
