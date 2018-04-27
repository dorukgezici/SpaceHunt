import * as ex from "excalibur";
import Background from "../../code/src/Components/Background";
import resources from "../../code/src/Resources";


describe("Background Movement", () => {

	const START_X = 0;
	const START_Y = 0;
	const MIN_LEFT = 400;
	const MIN_RIGHT = 400;
	const LVL_LENGTH = 4000;
	const IMG = resources.level1.bg.asSprite();
	const IMG_WIDTH = 1600;

	const engine = new ex.Engine();

	it("Should not move in the start", () => {
		let player = new ex.Actor(0, 0);
		let background = new Background(IMG, player, START_X, START_Y, MIN_LEFT, MIN_RIGHT, LVL_LENGTH);

		background.update(engine, 0);
		expect(background.x).toEqual(0);

		player.x = 100;
		background.update(engine, 1);
		expect(background.x).toEqual(0);

		player.x = 400;
		background.update(engine, 1);
		expect(background.x).toEqual(0);
	});

	it("Should move based on player's position in the middle", () => {
		let player = new ex.Actor(0, 0);
		let background = new Background(IMG, player, START_X, START_Y, MIN_LEFT, MIN_RIGHT, LVL_LENGTH);

		player.x = 800;
		background.update(engine, 0);
		expect(background.x).toEqual(300);

		player.x = 2000;
		background.update(engine, 1);
		expect(background.x).toEqual(1200);

		player.x = 3200;
		background.update(engine, 2);
		expect(background.x).toEqual(2100);
	});

	it("Should nto move in the end", () => {
		let player = new ex.Actor(0, 0);
		let background = new Background(IMG, player, START_X, START_Y, MIN_LEFT, MIN_RIGHT, LVL_LENGTH);

		player.x = 3600;
		background.update(engine, 0);
		expect(background.x).toEqual(2400);

		player.x = 3800;
		background.update(engine, 0);
		expect(background.x).toEqual(2400);


		player.x = 4000;
		background.update(engine, 0);
		expect(background.x).toEqual(2400);
	});
});

