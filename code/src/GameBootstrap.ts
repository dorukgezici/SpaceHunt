import { Engine, GameEvent, Color } from "excalibur";
import { IEvented } from "./Class";
import Menu from "./Scenes/Menu/Menu";
import ExampleLevel from "./Scenes/ExampleLevel/ExampleLevel";
import MovementTestLevel from "./Scenes/MovementTestLevel/MovementTestLevel";

/**
 * Event interface used by `IGameElement`.
 */
export interface IGameElementDoneEvent extends GameEvent<IGameElement> {
	type: GameElementDoneType;
}

/**
 * Determines the reason for GameElement to be done. 
 */
export enum GameElementDoneType {
	/**
	 * Everything is fine, proceed, or the player has won.
	 */
	Finished,
	/**
	 * An error occurred, don't proceed, or the player has died.
	 */
	Aborted
}

/**
 * Default event-mapping for `IGameElement` interface.
 * 
 * It is recommended to inherit from this interface when new `IGameElement`s are made.
 */
export interface IGameElementEvents {
	done: IGameElementDoneEvent;
}

/**
 * Base game element interface. Include event mapping template paramtere for strongly-typed events.
 */
export interface IGameElement<T extends IGameElementEvents = IGameElementEvents> extends IEvented<T> {
	init(bootstrap: GameBootstrap): void;
	start(): void;
	dispose(): void;
}

/**
 * Game bootstrap object.
 * 
 * Handles the logic behind switching levels and wiring everything up.
 */
export class GameBootstrap {

	/**
	 * State hold global game information. Every GameElement may change the state.
	 */
	readonly state = {};
	/**
	 * Excaliburjs' game engine.
	 */
	readonly engine: Engine;
	/**
	 * The key of the root (blank) scene.
	 */
	readonly rootSceneKey = "root";

	private menu = new Menu();

	private levels = [
		{name: "Play a Game!", element: new ExampleLevel()},
		{name: "Test player movement", element: new MovementTestLevel()},
	];

	constructor(
		public readonly canvasId: string,
		public readonly overlay: HTMLElement
	) {
		// create the game engine
		this.engine = new Engine({
			canvasElementId: canvasId,
			backgroundColor: Color.Black
		});

		const { levels, menu } = this;

		// init all levels and subscribe event listeners
		levels.forEach(level => {
			// init the level
			level.element.init(this);
			// decide what to do when the level is over
			level.element.on("done", e => {
				if (e.type === GameElementDoneType.Finished) // successfully finished
					alert("Good job!");
				else // aborter, lost
					alert("Oh no! :(");
				level.element.dispose(); // stop current scene
				menu.start(); // show menu
			});
		});

		// init menu as any other game element
		menu.init(this);
		// assign custom properties
		menu.items = levels.map(t => t.name);
		// subscribe custom listeners
		menu.on("click", e => {
			const level = levels.find(t => t.name === e.name);
			menu.dispose(); // stop displaying menu
			if (!level)
				throw new Error("level not found");
			level.element.start(); // start the level
		});
	}

	/**
	 * Starts the game.
	 */
	start() {
		this.menu.start();
		this.engine.start();
	}

}
