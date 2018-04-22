describe("Webpack", () => {
	it("should run in browser context", () => {
		expect(window).toBeTruthy();
	});
	it("should have global variables declared", () => {
		expect(window.ENV).toEqual("test");
	});
});
