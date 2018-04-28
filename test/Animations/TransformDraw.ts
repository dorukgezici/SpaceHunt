import { TransformDrawPart } from "../../code/src/Components/Animations/Framework/TransformDrawPart";

describe("TransformDrawPart", () => {

	const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
	let data = {
		rotation: 0,
		// @ts-ignore
		part: null as TransformDrawPart<"default">
	};

	beforeEach(() => {
		data.part = new TransformDrawPart({ rotate: -1 }, { rotate: 1 }, 1000);
		data.part.drawBase = (ctx, path, position, state, delta, transformation) => data.rotation = transformation.rotate || 0;
	});

	const update = (delta: number) => data.part.draw(ctx, delta, undefined, "default");
	const reset = (delta: number = 0) => {
		data.part.resetDelta(delta);
		update(delta);
	};

	it("should calculate state correctly", () => {
		update(0);
		expect(data.rotation).toBeCloseTo(-1);
		update(500);
		expect(data.rotation).toBeCloseTo(0);
		update(1000);
		expect(data.rotation).toBeCloseTo(1);
		reset();
		update(0);
		expect(data.rotation).toBeCloseTo(-1);
	});

	it("should handle state transitions correctly", () => {
		data.part.makeTransition({ rotate: 2 }, { rotate: 3 }, 500, 1000);
		update(500);
		expect(data.rotation).toBeCloseTo(0);
		update(1000);
		expect(data.rotation).toBeCloseTo(2.5 / 2);
	});

});
