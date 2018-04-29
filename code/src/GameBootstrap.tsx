import { Color, Engine, GameEvent, Input, Loader } from "excalibur";
import { IEvented } from "./Class";
import StateListener from "./Components/StateListener";
import { InterfaceBuilder } from "./InterfaceBuilder";
import { getLoadableResources } from "./Resources";
import GameInterface from "./Scenes/GameInterface/GameInterface";
import * as stories from "./Scenes/GameInterface/Story";
import Level1 from "./Scenes/Level1/Level1";
import Level2 from "./Scenes/Level2/Level2";
import Level3 from "./Scenes/Level3/Level3";
import Level4 from "./Scenes/Level4/Level4";

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
export interface IGameElement<T = {}> extends IEvented<T & IGameElementEvents> {
	/**
	 * Called when the component should hide its content and stop its execution. Note that this may be called multiple times per component instance.
	 */
	dispose?(): void;
}

/**
 * Interface for GameBootstrap state.
 */
export interface IGameBootstrapState {
	title: string | null;
	loaded: boolean;
	lives: number;
	score: number;
	oxygen: ReadonlyArray<number>; // array of numbers from interval [0, 1]
	showOxygen: boolean;
	names: ReadonlyArray<string>;
}

const defaultGameBootstrapState: IGameBootstrapState = {
	title: null,
	lives: 5,
	score: 0,
	oxygen: [],
	showOxygen: false,
	names: ["Freddy", "Bro"],
	loaded: false,
};

const INITIAL_LEVEL_INDEX = -1;
const levels = [Level1, Level2, Level3, Level4];
const transitionStories = [stories.level1, stories.level2, stories.level3, stories.level4];

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
	// @ts-ignore
	readonly engine: Engine = null;
	/**
	 * UI Interface.
	 */
	// @ts-ignore
	readonly interface: GameInterface = null;
	readonly loader: Loader;
	private levelIndex = INITIAL_LEVEL_INDEX;
	private currentGameElement: IGameElement | null = null;

	constructor() {
		this.stateListener = new StateListener<IGameBootstrapState>(defaultGameBootstrapState);
		this.state = this.stateListener.createListenableObject();
		this.loader = new Loader();
		this.loader.addResources(getLoadableResources());
	}

	private onLevelSelected({ level, players }: { level: number, players: number }) {
		this.levelIndex = level;
		const names = this.state.names;
		if (names.length !== players) {
			if (players === 2)
				this.state.names = [names[0], "Bro"];
			else
				this.state.names = [names[0]];
			this.state.title = this.state.names.join(" & ");
		}
		this.onShowContent();
	}

	private onPlayClicked(names: string[]) {
		this.levelIndex = 0;
		this.state.names = names;
		this.state.title = names.join(" & ");
		this.interface.showIntro();
	}

	private onShowContent() {
		if (this.levelIndex === INITIAL_LEVEL_INDEX) {
			this.interface.setContentType("menu");
			return;
		} else {
			this.interface.setContentType("game");
			this.startScene();
		}
	}

	private onHideContent() {
		this.stopCurrentElement();
	}

	private stopCurrentElement() {
		const { engine, currentGameElement } = this;

		if (currentGameElement) {
			if (currentGameElement.dispose)
				currentGameElement.dispose();
			this.currentGameElement = null;
		}
		engine.removeScene(engine.currentScene);
		engine.stop();
	}

	private startScene() {
		this.engine.start();
		const LevelClass = levels[this.levelIndex];
		const level = new LevelClass(this);
		this.currentGameElement = level;
		level.once("done", ({ type }) => {
			if (type === GameElementDoneType.Finished)
				if (this.levelIndex == 0 && this.state.lives > 0)
					this.resetLevel();
				else
					this.levelFinished();
			else
				this.levelAborted();
		});
	}

	// Doesn't work?
	private resetLevel() {
		this.stopCurrentElement();
		this.startScene();
	}

	private levelFinished() {
		const transition = transitionStories[this.levelIndex];
		this.levelIndex++;
		if (this.levelIndex >= levels.length)
			this.levelIndex = INITIAL_LEVEL_INDEX;
		this.interface.showTransition(transition);
	}

	private levelAborted() {
		this.levelIndex = INITIAL_LEVEL_INDEX;
		this.interface.showTransition(stories.death);
	}

	/**
	 * Starts the game.
	 */
	async start() {
		await this.loader.load();

		InterfaceBuilder.replaceContent(document.body, (
			<GameInterface
				bootstrap={this}
				ref={i =>
					// @ts-ignore
					this.interface = i
				}
			/>
		));

		this.interface.on("levelSelected", this.onLevelSelected.bind(this));
		this.interface.on("playClicked", this.onPlayClicked.bind(this));
		this.interface.on("moveDown", this.onShowContent.bind(this)); // move
		this.interface.on("movedUp", this.onHideContent.bind(this)); // moveD // note the D

		// @ts-ignore
		this.engine = new Engine({
			width: 1000,
			height: 600,
			canvasElementId: this.interface.canvas.id,
			backgroundColor: Color.Black,
			pointerScope: Input.PointerScope.Canvas
		});

		this.state.loaded = true;
	}

}

export type GameBootstrapType = typeof GameBootstrap;
