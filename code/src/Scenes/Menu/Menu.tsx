import { IGameElement, GameBootstrap, IGameElementEvents, GameElementDoneType } from "../../GameBootstrap";
import { InterfaceBuilder } from "../../InterfaceBuilder";
import { Class } from "../../Class";
require("./style.scss");

interface IMenuEvents extends IGameElementEvents {
	click: {
		target: IGameElement;
		id: number;
		name: string;
	};
}

export default class Menu extends Class<IMenuEvents> implements IGameElement {

	items?: string[];

	init(bootstrap: GameBootstrap): void {
		void (0); // do nothing
	}

	private itemClick(id: number, name: string) {
		this.emit("click", {
			target: this,
			id,
			name
		});
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Finished
		});
	}

	start(): void {
		InterfaceBuilder.displayDefault(
			<div id="game-menu">
				<div className="dialog">
					<div className="items">
						{this.items && this.items.map((t, i) => (
							<div className="item" onclick={e => this.itemClick(i, t)}>{t}</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	dispose(): void {
		InterfaceBuilder.clearDefault();
	}

}
