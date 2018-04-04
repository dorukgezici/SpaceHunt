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
import { getLoadableResources } from "./Resources";
import * as Stories from "./Scenes/Intro/Story";
import StarWarsIntro from "./Scenes/StarWarsIntro/StarWarsIntro";

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
 * Base game element interface. Include event mapping template parameters for strongly-typed events.
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
		this.loader.addResources(getLoadableResources());

		const level1 = new Level1(this);
		const level2 = new Level2(this);
		const level3 = new Level3(this);
		const level4 = new Level4(this);
		const nameEnquiry = new NameEnquiry();
		const intro = new Intro(this);
		const starWarsIntro = new StarWarsIntro();
		const menu = this.menu = new Menu();

		const gameElements = [level1, level2, level3, level4, nameEnquiry, intro, starWarsIntro, menu];
		const gameStory = [nameEnquiry, starWarsIntro, Stories.level1, level1, Stories.level2, level2, Stories.level3, level3, Stories.level4, level4, Stories.end];

		let sceneIndex = 0;
		let currentGameElement: IGameElement = menu;

		const resetGame = () => {
			currentGameElement.dispose();
			menu.start();
			sceneIndex = 0;
		};

		const showDeathStory = () => {
			sceneIndex = 0;
			currentGameElement.dispose();
			currentGameElement = intro;
			intro.setStory(Stories.death);
			intro.start();
			intro.once("done", () => {
				resetGame();
			});
		};

		const resetScene = () => sceneIndex = 0;
		const showScene = () => {
			if (sceneIndex >= gameStory.length || sceneIndex < 0) {
				resetGame();
				return;
			}

			currentGameElement.dispose();
			const next = gameStory[sceneIndex];

			if (Array.isArray(next)) {
				currentGameElement = intro;
				intro.setStory(next);
			} else
				currentGameElement = next;

			currentGameElement.start();
			currentGameElement.once("done", ({ type }) => {
				if (type === GameElementDoneType.Finished) {
					sceneIndex++;
					showScene();
				} else
					showDeathStory();
			});

		};

		const menuItems = [{
			element: level1,
			name: "Level 1"
		}, {
			element: level2,
			name: "Level 2"
		}, {
			element: level3,
			name: "Level 3"
		}, {
			element: level4,
			name: "Level 4"
		}, {
			element: null,
			name: "Start the Game!"
		}];

		gameElements.forEach((t: IGameElement) => t.init && t.init(this));

		this.menu.items = menuItems.map(t => t.name);
		this.menu.on("click", ({ id, name }) => {
			const elt = menuItems[id].element;
			if (!elt)
				resetScene();
			else
				sceneIndex = gameStory.indexOf(elt);
			showScene();
		});
	}

	/**
	 * Starts the game.
	 */
	start() {
		this.menu.start();
		this.engine.start(this.loader);
	}

}
