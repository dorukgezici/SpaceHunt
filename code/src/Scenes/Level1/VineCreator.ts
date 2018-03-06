import * as ex from "excalibur";
import Vine from "./Vine";


export default class VineCreator {
	static readonly distRange = {min: 350, max: 450};
	static readonly lenRange = {min: 12, max: 17};
	static readonly speedRange = {min: 0.8, max: 1.6};
	static readonly rotRange = {min: 0.5, max: 0.9};

	start: number;
	end: number;
	rightToLeft: boolean = false;

	constructor(start: number, end: number) {
		this.start = start;
		this.end = end;
		this.rightToLeft = start > end;
	}

	createVines(): Vine[] {
		let vines: Vine[] = [];
		let position = this.start;

		while(true) {
			let distance = VineCreator.randomNumber(VineCreator.distRange.min, VineCreator.distRange.max);
			let vineLength = Math.round(VineCreator.randomNumber(VineCreator.lenRange.min, VineCreator.lenRange.max));
			let speed = VineCreator.randomNumber(VineCreator.speedRange.min, VineCreator.speedRange.max);
			let maxRotation = VineCreator.randomNumber(VineCreator.rotRange.min, VineCreator.rotRange.max);

			let vine = new Vine(position, 0, vineLength, speed, maxRotation);
			vines.push(vine);
			position = this.rightToLeft ? position - distance : position + distance;

			if(position <= this.end) {
				break;
			}
		}

		return vines;
	}

	private static randomNumber(from: number, to: number): number {
		let diff = to - from;
		return Math.random() * diff + from;
	}
}
