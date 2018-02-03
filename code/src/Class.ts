import { GameEvent, EventDispatcher, Class as EClass } from "excalibur";

interface IEventMapping<T = any> {
	[key: string]: any;
}

/**
 * Strongly-typed event interface. Prefered over Excalibur's.
 */
export interface IEvented<T = IEventMapping> {

	/**
	 * Emits an event for target
	 * @param eventName  The name of the event to publish
	 * @param event      Optionally pass an event data object to the handler
	 */
	emit<K extends keyof T>(eventName: K, event: T[K]): void;

	/**
	 * Subscribe an event handler to a particular event name, multiple handlers per event name are allowed.
	 * @param eventName  The name of the event to subscribe to
	 * @param handler    The handler callback to fire on this event
	 */
	on<K extends keyof T>(eventName: K, handler: (event: T[K]) => void): void;

	/**
	 * Unsubscribe an event handler(s) from an event. If a specific handler
	 * is specified for an event, only that handler will be unsubscribed.
	 * Otherwise all handlers will be unsubscribed for that event.
	 *
	 * @param eventName  The name of the event to unsubscribe
	 * @param handler    Optionally the specific handler to unsubscribe
	 *
	 */
	off<K extends keyof T>(eventName: K, handler: (event: T[K]) => void): void;

	/**
	 * Once listens to an event once then auto unsubscribes from that event
	 *
	 * @param eventName The name of the event to subscribe to once
	 * @param handler   The handler of the event that will be auto unsubscribed
	 */
	once<K extends keyof T>(eventName: K, handler: (event: T[K]) => void): void;

}

/**
 * Base class which implements stronlgy-typed event handling. Preferd over Excalibur's.
 */
export class Class<T = IEventMapping> implements IEvented<T> {

	/**
	 * Direct access to the game object event dispatcher.
	 */
	eventDispatcher: EventDispatcher;

	constructor() {
		this.eventDispatcher = new EventDispatcher(this);
	}

	/**
	 * Alias for `addEventListener`. You can listen for a variety of
	 * events off of the engine; see the events section below for a complete list.
	 * @param eventName  Name of the event to listen for
	 * @param handler    Event handler for the thrown event
	 */
	on<K extends keyof T>(eventName: K, handler: (event: T[K]) => void): void {
		this.eventDispatcher.on(eventName, handler as any);
	}

	/**
	 * Alias for `removeEventListener`. If only the eventName is specified
	 * it will remove all handlers registered for that specific event. If the eventName
	 * and the handler instance are specified only that handler will be removed.
	 *
	 * @param eventName  Name of the event to listen for
	 * @param handler    Event handler for the thrown event
	 */
	off<K extends keyof T>(eventName: K, handler: (event: T[K]) => void): void {
		this.eventDispatcher.off(eventName, handler as any);
	}

	/**
	 * Emits a new event
	 * @param eventName   Name of the event to emit
	 * @param eventObject Data associated with this event
	 */
	emit<K extends keyof T>(eventName: K, event: T[K]): void {
		this.eventDispatcher.emit(eventName, event as any);
	}

	/**
	 * Once listens to an event one time, then unsubscribes from that event
	 *
	 * @param eventName The name of the event to subscribe to once
	 * @param handler   The handler of the event that will be auto unsubscribed
	 */
	once<K extends keyof T>(eventName: K, handler: (event: T[K]) => void): void {
		this.eventDispatcher.once(eventName, handler as any);
	}

}
