import * as ex from "excalibur";
import { controlSets } from "../../code/src/Components/BasePlayer";
import Level1Player from "../../code/src/Scenes/Level1/Level1Player";
import Vine from "../../code/src/Scenes/Level1/Vine";
import { IGameBootstrapState } from "../../code/src/GameBootstrap";

describe("Player and Vine interaction", () => {

	const state: IGameBootstrapState = {
		title: "Some title",
		loaded: true,
		lives: 5,
		score: 0,
		oxygen: [0.5],
		winner: null,
		showOxygen: false,
		names: ["Freddy"]
	};

	const engine = new ex.Engine();
	const scene = new ex.Scene(engine);
	const vine = new Vine(200, 0, 20, 1.0, 0.7);

	scene.add(vine);

	it("Should not be affected before colliding", () => {
		let player = new Level1Player(0, 100, 2000, controlSets.controls1, state, true);

		expect(player.getWorldPos().x).toEqual(0);
		expect(player.x).toEqual(0);
		expect(player.onVine).toBeFalsy();
		expect(player.collisionType).toEqual(ex.CollisionType.Active);

		vine.getAllParts().map(x => {
			expect(x.x).toEqual(200);
		});
	});

	it("Should attach to vine on collision", () => {
		let player = new Level1Player(199, 100, 2000, controlSets.controls1, state, true);
		scene.add(player);

		player.emit("precollision",
			new ex.PreCollisionEvent(player, vine.getAllParts()[5], ex.Side.Right, new ex.Vector(10, 10)));

		expect(player.onVine).toBeTruthy();
		expect(player.parent.constructor.name).toEqual("Vine");
		expect(vine.alreadyCollidedWith[0]).toEqual(player);
		expect(player.x).toEqual(0);
		expect(player.getWorldPos().x).toEqual(200);
	});

	it("Should detach after jump", () => {
		let player = new Level1Player(199, 100, 2000, controlSets.controls1, state, true);
		scene.add(player);
		player.attachToVine(vine.getAllParts()[5]);

		expect(player.onVine).toBeTruthy();

		player.jump();

		expect(player.onVine).toBeFalsy();
		expect(player.inJump).toBeTruthy();
		expect(player.parent).toBeFalsy();
		expect(player.vel.x).toEqual(600);
		expect(player.vel.y).toEqual(-500);
		expect(player.x).toEqual(vine.getAllParts()[5].x);
		expect(player.getWorldPos().x).toEqual(vine.getAllParts()[5].x);
	});
});
