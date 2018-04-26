import SimplexNoise from "../../Components/NoiseAbstraction/SimplexNoise";
import Point from "../../Components/NoiseAbstraction/Point";
import Color from "../../Components/NoiseAbstraction/Color";
import { random, extend } from "../../Components/NoiseAbstraction/Static";
import { Component, InterfaceBuilder } from "../../InterfaceBuilder";

const PARTICLE_NUM = 500;
const STEP = 3;
const Z_INC = 0.001;
const S = 100; // Saturate
const L = 50; // Lightness

interface IAttrs {
	ref?: (ca: CanvasAbstraction) => void;
}

export default class CanvasAbstraction extends Component<IAttrs> {

	canvas = <canvas style={{ height: "100%", width: "100%" }} /> as HTMLCanvasElement;
	renderer: Renderer;

	constructor(attrs: IAttrs) {
		super(attrs);
		this.renderer = new Renderer(this.canvas);
		(window as any).ca = this;
	}

	render(attrs: IAttrs) {
		if (attrs && attrs.ref)
			attrs.ref(this);

		return this.canvas;
	}

}

/**
 * Renderer class.
 * 
 * Uses:
 * PerlinNoise class,
 * Point class,
 * Color class,
 * extend, random
 * @see http://jsdo.it/akm2/fhMC
 */
export class Renderer {

	private canvasWidth: number = 0;
	private canvasHeight: number = 0;
	private context: CanvasRenderingContext2D;
	private particles: Particle[];
	private center = new Point();
	private perlinNoise = new SimplexNoise();
	private zoff = 0;
	private animationFrame = NaN;

	constructor(
		protected readonly canvas: HTMLCanvasElement
	) {
		this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
		this.particles = new Array(PARTICLE_NUM);
		for (let i = 0; i < PARTICLE_NUM; i++)
			this.particles[i] = new Particle(this as any);
	}

	start() {
		this.resize();
		document.removeEventListener("resize", this.resize);
		if (!Number.isNaN(this.animationFrame)) return;
		const loop = () => {
			this.draw();
			this.animationFrame = requestAnimationFrame(loop);
		};
		this.animationFrame = requestAnimationFrame(loop);
	}

	stop() {
		if (!Number.isNaN(this.animationFrame)) {
			cancelAnimationFrame(this.animationFrame);
			document.removeEventListener("resize", this.resize);
			this.animationFrame = NaN;
		}
	}

	clear() {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	}

	private resize = () => {
		const { canvas, center } = this;
		this.canvasWidth = canvas.width = canvas.clientWidth;
		this.canvasHeight = canvas.height = canvas.clientHeight;
		const context = this.context = canvas.getContext("2d") as CanvasRenderingContext2D;

		context.lineWidth = 0.3;
		context.lineCap = context.lineJoin = "round";

		center.set(this.canvasWidth / 2, this.canvasHeight / 2);
	}

	private makeTransparent() {
		const { context, canvasWidth, canvasHeight } = this;
		const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
		const { data } = imageData;
		for (let i = 3; i < imageData.data.length; i += 4) {
			if (data[i] > 1)
				data[i]--;
		}
		context.putImageData(imageData, 0, 0);
	}

	private draw() {
		const { context, particles, zoff, perlinNoise, canvasWidth, canvasHeight } = this;
		let p, latest, color, angle;

		this.makeTransparent();

		for (let i = 0, len = particles.length; i < len; i++) {
			p = particles[i];
			latest = p.latest;
			color = p.color;

			context.beginPath();
			context.strokeStyle = color.toString();
			context.moveTo(latest.x, latest.y);
			context.lineTo(p.x, p.y);
			context.stroke();

			latest.set(p);

			angle = Math.PI * 6 * perlinNoise.noise(p.x / canvasWidth * 1.75, p.y / canvasHeight * 1.75, zoff);
			p.offset(Math.cos(angle) * STEP, Math.sin(angle) * STEP);

			if (color.a < 1) color.a += 0.01;

			if (p.x < 0 || p.x > canvasWidth || p.y < 0 || p.y > canvasHeight) {
				p.reborn();
			}
		}

		this.zoff += Z_INC;
	}

}

class Particle extends Point {

	latest: Point;
	color: Color.HSLA;
	age = 0;

	constructor(
		private ca: { canvasWidth: number; canvasHeight: number, center: Point }
	) {
		super();
		this.latest = new Point();
		this.color = new Color.HSLA(0, S, L, 0.5);
		this.reborn();

	}

	reborn() {
		this.set(random(this.ca.canvasWidth), random(this.ca.canvasHeight));
		this.latest.set(this);
		this.age = 0;
		this.color.h = this.ca.center.subtract(this).angle() * 180 / Math.PI;
		this.color.a = 0;
	}

}
