import { ITransformDrawStateCollection, TransformDrawSet, ITransformDrawPartProvider } from "./TransformDrawSet";
import { Class } from "../../Class";
import { DrawAnimation, IDrawSet, IDrawSetProvider } from "./DrawAnimation";
import { Actor } from "excalibur";
import { IDrawBase, TransformDrawPart, IBeforeDraw } from "./TransformDrawPart";

interface IActorClass<T extends Actor = Actor> {
	prototype: T;
}

interface IEventMapping<T extends string> {
	created: DrawAnimation<T>;
}

export class TransformDrawAnimationFactory<T extends string> extends Class<IEventMapping<T>> {

	constructor(
		public readonly sets: ReadonlyArray<IDrawSetProvider<T>>
	) {
		super();
	}

	create() {
		const drawSets = this.sets.map(t => t());
		const a = new DrawAnimation<T>(drawSets);
		this.emit("created", a);
		return a;
	}

	attachTo<T extends string, A extends Actor = Actor>(actorClass: IActorClass<A>): DrawAnimation<T>;
	attachTo(actor: Actor): DrawAnimation<T>;
	attachTo(actor: IActorClass | Actor): DrawAnimation<T> {
		const a = this.create();

		if (actor instanceof Actor)
			actor.draw = function (ctx: CanvasRenderingContext2D, delta: number) {
				a.draw(ctx, this.getWorldPos());
			};
		else
			actor.prototype.draw = function (ctx: CanvasRenderingContext2D, delta: number) {
				a.draw(ctx, this.getWorldPos());
			};

		return a;
	}

}

export interface ITransformDrawSetProviderData<T extends string> {
	states: ITransformDrawStateCollection<T>;
	selectedState: T;
	beforeDraw?: IBeforeDraw<T>;
	drawBase: IDrawBase<T>;
}

export function createTransformDrawSetProvider<T extends string>(data: ITransformDrawSetProviderData<T>): IDrawSetProvider<T> {
	const { states, selectedState, drawBase, beforeDraw } = data;

	const state = states[selectedState];
	if (!state || !state.duration)
		throw new Error("Initial state must have duration property declared.");

	const partProvider = () => {
		const part = new TransformDrawPart<T>(
			state.start,
			state.end,
			state.duration || 0,
			state.easing
		);
		part.drawBase = drawBase;
		if (beforeDraw)
			part.beforeDraw = beforeDraw;
		return part;
	};

	return () => new TransformDrawSet<T>(states, selectedState, partProvider);
}
