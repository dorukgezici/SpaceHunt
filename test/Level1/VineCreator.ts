import VineCreator from "../../code/src/Scenes/Level1/VineCreator";


describe("Vine Creator", () => {

	const START = 1000;
	const END = 3000;

	it("Should create correctly randomized vines", () => {
		let vineCreator = new VineCreator(START, END);
		let vines = vineCreator.createVines();

		let maxVines = Math.floor((END - START) / VineCreator.distRange.min);
		let minVines = Math.floor((END - START) / VineCreator.distRange.max);

		expect(vines.length).toBeLessThanOrEqual(maxVines);
		expect(vines.length).toBeGreaterThanOrEqual(minVines);

		vines.map(x => {
			expect(x.speed).toBeLessThanOrEqual(VineCreator.speedRange.max);
			expect(x.speed).toBeGreaterThanOrEqual(VineCreator.speedRange.min);
		});

		vines.map(x => {
			expect(x.maxRotation * 10).toBeLessThanOrEqual(VineCreator.rotRange.max);
			expect(x.maxRotation * 10).toBeGreaterThanOrEqual(VineCreator.rotRange.min);
		});

		vines.map(x => {
			expect(x.getAllParts().length).toBeLessThanOrEqual(VineCreator.lenRange.max);
			expect(x.getAllParts().length).toBeGreaterThanOrEqual(VineCreator.lenRange.min);
		});
	});

	it("Should create vines from right to left", () => {
		let vineCreator = new VineCreator(END, START);
		let vines = vineCreator.createVines();

		let maxVines = Math.floor((END - START) / VineCreator.distRange.min);
		let minVines = Math.floor((END - START) / VineCreator.distRange.max);

		expect(vines.length).toBeLessThanOrEqual(maxVines);
		expect(vines.length).toBeGreaterThanOrEqual(minVines);
	});

	it("Should create only one vine if the range is 0", () => {
		let vineCreator = new VineCreator(START, START);
		let vines = vineCreator.createVines();

		expect(vines.length).toEqual(1);
	});
});
