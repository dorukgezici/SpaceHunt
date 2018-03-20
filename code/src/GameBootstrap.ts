import { Engine, GameEvent, Color, Input, Loader, Texture } from "excalibur";
import { IEvented, Class } from "./Class";
import { NameEnquiry } from "./Scenes/NameEnquiry/NameEnquiry";
import ExampleLevel from "./Scenes/ExampleLevel/ExampleLevel";
import Menu from "./Scenes/Menu/Menu";
import Intro from "./Scenes/Intro/Intro";
import MovementTestLevel from "./Scenes/MovementTestLevel/MovementTestLevel";
import StateListener from "./Components/StateListener";
import Level1 from "./Scenes/Level1/Level1";
import Level2 from "./Scenes/Level2/Level2";
import Level3 from "./Scenes/Level3/Level3";
import Level4 from "./Scenes/Level4/Level4";
import resources from "./Resources";

/**
 * A game event that contains a related event value.
 */
export interface IGameEventValue<T> extends GameEvent<IGameElement> {
	value: T;
}

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
	/**
	 * Called when the component should run initialisation logic.
	 */
	init?(bootstrap: GameBootstrap): void;
	/**
	 * Called when the component should be run and display its content. Note that this may be called multiple times per component instance.
	 */
	start(): void;
	/**
	 * Called when the component should hide its content and stop its execution. Note that this may be called multiple times per component instance.
	 */
	dispose(): void;
}

/**
 * Interface for GameBootstrap state.
 */
export interface IGameBootstrapState {
	name: string | null;
}

/**
 * Game bootstrap object.
 *
 * Handles the logic behind switching levels and wiring everything up.
 */
export class GameBootstrap {

	/**
	 * State listener.
	 */
	readonly stateListener: StateListener<IGameBootstrapState>;
	/**
	 * State hold global game information. Every GameElement may change the state.
	 */
	readonly state: IGameBootstrapState;
	/**
	 * Excaliburjs' game engine.
	 */
	readonly engine: Engine;
	/**
	 * The key of the root (blank) scene.
	 */
	readonly rootSceneKey = "root";

	readonly loader: Loader;

	private menu: Menu;
	private intro: Intro;
	private exampleLevel: ExampleLevel;
	private movementTestLevel: MovementTestLevel;
	private level2: Level2;
	private nameEnquiry: NameEnquiry;
	private levels: { name: string, element: IGameElement }[];

	constructor(
		public readonly canvasId: string,
		public readonly overlay: HTMLElement
	) {
		this.stateListener = new StateListener<IGameBootstrapState>({
			name: null
		});
		this.state = this.stateListener.createListenableObject();

		// create the game engine
		this.engine = new Engine({
			width: 800,
			height: 600,
			canvasElementId: canvasId,
			backgroundColor: Color.Black,
			pointerScope: Input.PointerScope.Canvas
		});

		this.loader = new Loader();
		this.loader.addResources(Object.values(resources));

		this.intro = new Intro(this);
		this.menu = new Menu();
		this.exampleLevel = new ExampleLevel(this);
		this.movementTestLevel = new MovementTestLevel(this);
		this.level2 = new Level2(this);
		this.nameEnquiry = new NameEnquiry();

		this.levels = [{
			name: "Level 1",
			element: new Level1(this)
		}, {
			name: "Level 2",
			element: new Level2(this)
		}, {
			name: "Level 3",
			element: new Level3(this)
		}, {
			name: "Level 4",
			element: new Level4(this)
		}, {
			name: "Change your name!",
			element: this.nameEnquiry
		}, {
			name: "Intro (Story)",
			element: this.intro
		}, {
			name: "Test player movement",
			element: new MovementTestLevel(this)
		}, {
			name: "Play a Game!",
			element: this.exampleLevel
		}];

		const { state, levels, menu, intro, exampleLevel, nameEnquiry, stateListener } = this;

		// custom event listener logic
		exampleLevel.on("done", e => {
			if (e.type === GameElementDoneType.Finished)
				alert("Good job!");
		});

		// state change event bindings
		stateListener.on("name", e => {
			const level = levels.find(t => t.element === nameEnquiry);
			if (level)
				level.name = `Change your name, ${e.newValue}!`;
			menu.items = levels.map(t => t.name);
		});

		// init all levels and subscribe event listeners
		levels.forEach(level => {
			// init the level
			if (level.element.init)
				level.element.init(this);
			// decide what to do when the level is over
			level.element.on("done", e => {
				level.element.dispose(); // stop current scene
				menu.start(); // show menu
			});
		});

		// init menu as any other game elementWW
		menu.init(this);
		// assign custom properties
		menu.items = levels.map(t => t.name);
	}

	/**
	 * Starts the game.
	 */
	start() {
		this.menu.start();
		this.engine.start(this.loader).then(() => {
			this.menu.on("click", e => {
				const level = this.levels.find(t => t.name === e.name);
				this.menu.dispose(); // stop displaying menu

				if (!level) {
					throw new Error("level not found");
				}

				level.element.start(); // start the level
			});
		});
	}

}
