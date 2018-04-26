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
import GameBar from "./Scenes/GameBar/GameBar";
import GameInterface from "./Scenes/GameInterface/GameInterface";
import { InterfaceBuilder } from "./InterfaceBuilder";

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
	lives: number; // [1, 2, 3, ...]
	oxygen: number; // [0, 1]
	showOxygen: boolean;
}

const defaultGameBootstrapState: IGameBootstrapState = {
	title: null,
	lives: 5,
	oxygen: 1,
	showOxygen: false,
};

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
	// @ts-ignore
	readonly interface: GameInterface;
	readonly loader: Loader;

	private sceneIndex = 0;
	private currentGameElement: IGameElement | null = null;
	private menuItems = [{
		index: 3,
		name: "Level 1"
	}, {
		index: 5,
		name: "Level 2"
	}, {
		index: 7,
		name: "Level 3"
	}, {
		index: 9,
		name: "Level 4"
	}, {
		index: 1,
		name: "StarWars Intro"
	}, {
		index: 0,
		name: "Start the Game"
	}];

	private levels: (() => IGameElement)[] = [
		() => new NameEnquiry(this),
		() => new StarWarsIntro(),
		() => new Intro(this, Stories.level1),
		() => new Level1(this),
		() => new Intro(this, Stories.level2),
		() => new Level2(this),
		() => new Intro(this, Stories.level3),
		() => new Level3(this),
		() => new Intro(this, Stories.level4),
		() => new Level4(this),
		() => new Intro(this, Stories.end)
	];

	constructor() {
		this.stateListener = new StateListener<IGameBootstrapState>(defaultGameBootstrapState);
		this.state = this.stateListener.createListenableObject();

		// @ts-ignore
		this.interface = null;
		InterfaceBuilder.replaceContent(document.body, (
			<GameInterface
				bootstrap={this}
				ref={i =>
					// @ts-ignore
					this.interface = i
				}
			/>
		));

		// create the game engine
		this.engine = new Engine({
			width: 800,
			height: 600,
			canvasElementId: this.interface.canvas.id,
			backgroundColor: Color.Black,
			pointerScope: Input.PointerScope.Canvas
		});

		this.loader = new Loader();
		this.loader.addResources(getLoadableResources());
	}

	private showMenu() {
		const menu = new Menu(this.menuItems.map(t => t.name));
		this.currentGameElement = menu;
		menu.once("click", ({ id }) => {
			this.sceneIndex = this.menuItems[id].index;
			this.showScene();
		});
	}

	private resetLevel() {
		this.showScene();
	}

	private resetGame() {
		if (this.currentGameElement && this.currentGameElement.dispose)
			this.currentGameElement.dispose();
		this.sceneIndex = 0;
		this.showScene();
	}

	private showDeathStory() {
		this.sceneIndex = 0;
		if (this.currentGameElement && this.currentGameElement.dispose)
			this.currentGameElement.dispose();
		this.currentGameElement = new Intro(this, Stories.death);
		this.currentGameElement.once("done", () => this.resetGame());
	}

	private showScene() {
		if (this.sceneIndex >= this.levels.length || this.sceneIndex < 0) {
			this.resetGame();
			return;
		}

		if (this.currentGameElement && this.currentGameElement.dispose)
			this.currentGameElement.dispose();
		this.currentGameElement = this.levels[this.sceneIndex]();

		// Trigger to show lives
		this.state.lives = this.state.lives;

		this.currentGameElement.once("done", ({ type }) => {
			if (type === GameElementDoneType.Finished) {
				this.sceneIndex++;
				this.showScene();
			} else {
				if (this.state.lives > 1) {
					this.state.lives -= 1;
					this.resetLevel();
				} else {
					this.showDeathStory();
				}
			}
		});

	}

	/**
	 * Starts the game.
	 */
	start() {
		this.showMenu();
		this.engine.start(this.loader);
	}

}

export type GameBootstrapType = typeof GameBootstrap;
