import { Actor, Vector } from "excalibur";
import { Class } from "../../../Class";
import { DrawAnimation, IDrawSetProvider } from "./DrawAnimation";
import { IBeforeDraw, IDrawBase, TransformDrawPart } from "./TransformDrawPart";
import { ITransformDrawStateCollection, TransformDrawSet } from "./TransformDrawSet";

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

export function createTransformDrawSetProvider<T extends string>(data: ITransformDrawSetProviderData<T>, anchor?: Vector): IDrawSetProvider<T> {
	const { states, selectedState, drawBase, beforeDraw } = data;

	return () => {
		const state = states[selectedState];
		const part = new TransformDrawPart<T>(
			state && state.start || {},
			state && state.end || {},
			state && state.duration || 0,
			state && state.easing,
			anchor
		);
		part.drawBase = drawBase;
		if (beforeDraw)
			part.beforeDraw = beforeDraw;

		return new TransformDrawSet<T>(states, selectedState, part);
	};
}
