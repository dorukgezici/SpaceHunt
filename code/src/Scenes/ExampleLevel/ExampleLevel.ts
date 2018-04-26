import { Scene, Actor, Color, CollisionType } from "excalibur";
import { IGameElement, GameBootstrap, IGameElementEvents, GameElementDoneType } from "../../GameBootstrap";
import { Class } from "../../Class";

export default class ExampleLevel extends Class<IGameElementEvents> implements IGameElement {

	items: string[] = [];
	gameBootstrap: GameBootstrap;
	scene: Scene;
	ball?: Actor;
	bricks: Actor[] = [];
	readonly sceneKey = "examplelevel";

	constructor(bootstrap: GameBootstrap) {
		super();

		const { engine } = bootstrap;
		this.gameBootstrap = bootstrap;
		const scene = this.scene = new Scene(engine);
		const bounds = engine.getWorldBounds();

		const paddle = new Actor(150, bounds.getHeight() - 40, 200, 20);
		paddle.color = Color.Chartreuse;
		paddle.collisionType = CollisionType.Fixed;
		scene.add(paddle);
		engine.addScene(this.sceneKey, scene);
		this.gameBootstrap.engine.input.pointers.primary.on("move", function (evt: any) {
			paddle.pos.x = evt.x;
		});
		this.createElements();
		this.gameBootstrap.engine.goToScene(this.sceneKey);
	}

	dispose() {
		this.gameBootstrap.engine.removeScene(this.sceneKey);
	}

	win() {
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Finished
		});
	}

	lose() {
		this.emit("done", {
			target: this,
			type: GameElementDoneType.Aborted
		});
	}

	createElements() {
		// add bricks and a ball
		const { scene, gameBootstrap } = this;
		const brickColor = [Color.Violet, Color.Orange, Color.Yellow];
		const bounds = gameBootstrap.engine.getWorldBounds();

		const padding = 20; // px
		const xoffset = 65; // x-offset
		const yoffset = 20; // y-offset
		const columns = 5;
		const rows = 3;
		const brickWidth = bounds.getWidth() / columns - padding - padding / columns; // px
		const brickHeight = 30; // px

		const bricks: Actor[] = [];
		this.bricks = bricks;
		for (let j = 0; j < rows; j++) {
			for (let i = 0; i < columns; i++) {
				bricks.push(new Actor(xoffset + i * (brickWidth + padding) + padding, yoffset + j * (brickHeight + padding) + padding, brickWidth, brickHeight, brickColor[j % brickColor.length]));
			}
		}

		bricks.forEach(function (brick) {
			brick.collisionType = CollisionType.Active;
			scene.add(brick);
		});

		const ball = new Actor(100, 300, 20, 20);
		this.ball = ball;
		ball.color = Color.Red;
		ball.vel.setTo(500, 500);
		ball.collisionType = CollisionType.Passive;

		ball.draw = function (ctx, delta) {
			ctx.fillStyle = this.color.toString();
			ctx.beginPath();
			ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		};

		ball.on("postupdate", function () {
			// @ts-ignore
			const that = this as any;
			if (that.pos.x < (that.getWidth() / 2))
				that.vel.x *= -1;
			if (that.pos.x + (that.getWidth() / 2) > bounds.getWidth())
				that.vel.x *= -1;
			if (that.pos.y < (that.getHeight() / 2)) {
				that.vel.y *= -1;
			}
		});

		ball.on("precollision", (ev: any) => {
			const index = bricks.indexOf(ev.other);
			if (index > -1) {
				ev.other.kill();
				bricks.splice(index, 1);
				if (!bricks.length) // we destroyed all the bricks
					this.win();
			}
			const intersection = ev.intersection.normalize();
			if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
				ball.vel.x *= -1;
			} else {
				ball.vel.y *= -1;
			}
		});

		ball.on("exitviewport", () => {
			ball.kill();
			this.lose();
		});

		scene.add(ball);
	}

}
