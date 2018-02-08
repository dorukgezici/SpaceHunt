import * as ex from "excalibur";

export default class LockLevelCameraStrategy implements ex.ICameraStrategy<ex.Actor> {

	target: ex.Actor;
	private minX: number;
	private maxX: number;

	constructor(screenBounds: ex.BoundingBox, levelBounds: ex.BoundingBox) {
		this.minX = levelBounds.left + screenBounds.getWidth() / 2;
		this.maxX = levelBounds.right - screenBounds.getWidth() / 2;
	}

	action(target: ex.Actor, cam: ex.BaseCamera, _eng: ex.Engine, _delta: number): ex.Vector {
		let newPosition = cam.pos;
		newPosition.x = newPosition.x < this.minX ? this.minX : newPosition.x;
		newPosition.x = newPosition.x > this.maxX ? this.maxX : newPosition.x;
		return newPosition;
	}
}
