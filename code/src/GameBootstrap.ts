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
import { getLoadableResources } from "./Resources";
import { intro as introStory, level1 as level1Story, level2 as level2Story, death as deathStory, end as endStory } from "./Scenes/Intro/Story";
import Level3 from "./Scenes/Level3/Level3";
import Level4 from "./Scenes/Level4/Level4";
import resources from "./Resources";
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

	private level1: Level1;
	private level2: Level2;
	private nameEnquiry: NameEnquiry;
	private intro: Intro;

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
		const rsc = getLoadableResources();
		this.loader.addResources(rsc);

		this.level1 = new Level1(this);
		this.level2 = new Level2(this);
		this.nameEnquiry = new NameEnquiry();
		this.intro = new Intro(this);

		const { level1, level2, intro, nameEnquiry } = this;
		let state = 0;

		nameEnquiry.on("done", () => {
			nameEnquiry.dispose();
			intro.setStory(introStory);
			intro.start();
			intro.once("done", () => {
				intro.setStory(level1Story);
				intro.once("done", () => {
					intro.dispose();
					level1.start();
				});
			});
		});

		const showDeathStory = () => {
			intro.setStory(deathStory);
			intro.start();
		};

		level1.on("done", e => {
			level1.dispose();
			if (e.type === GameElementDoneType.Finished) {
				intro.setStory(level2Story);
				intro.start();
				intro.once("done", () => {
					intro.dispose();
					level2.start();
				});
			} else
				showDeathStory();
		});

		level2.on("done", e => {
			level2.dispose();
			if (e.type === GameElementDoneType.Finished) {
				intro.setStory(endStory);
				intro.start();
			} else
				showDeathStory();
		});

	}

	/**
	 * Starts the game.
	 */
	start() {
		this.nameEnquiry.start();
		this.engine.start(this.loader);
	}

}
