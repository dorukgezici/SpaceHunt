import { ITransformDrawSetProviderData, createTransformDrawSetProvider, TransformDrawAnimationFactory } from "../../Components/Animations/DrawAnimationFactory";
import { cubicEasing, IBeforeDraw, IDrawBase } from "../../Components/Animations/TransformDrawPart";
import { IDrawSetProvider } from "../../Components/Animations/DrawAnimation";
import { PlainDrawSet } from "../../Components/Animations/PlainDrawSet";
import Player from "./Player";
import { sprites, bodyParts, IBodyParts, modelSize } from "../../Components/Animations/MichaelsonParts";

export type ITarzanAnimations = "idle" | "jump" | "grab";
type ITA = ITarzanAnimations;
const selectedState = "idle";

export function attachPlayerAnimations(player: Player) {

	function drawBaseFactory(part: IBodyParts): IDrawBase<ITA> {
		const sprite = sprites[part];
		const { x, y } = bodyParts[part].anchor;
		return (ctx) => {
			sprite.draw(ctx, -x, -y);
		};
	}

	function beforeDrawFactory(part: IBodyParts): IBeforeDraw<ITA> {
		let { x, y } = bodyParts[part].modelLocation;
		y += modelSize.h / 2;
		return (ctx, path, position) => {
			if (position && player.onVine)
				return { translateX: x - position.x, translateY: y - position.y };
			return { translateX: x, translateY: y };
			// ctx.translate(x - position.x, y - position.y);
		};
	}

	const armBack: ITransformDrawSetProviderData<ITA> = {
		selectedState,
		drawBase: drawBaseFactory("armRight"),
		beforeDraw: beforeDrawFactory("armRight"),
		states: {
			idle: {
				duration: 1000,
				start: { rotate: 0.1 },
				end: { rotate: -0.1 },
				transitionDuration: 200
			},
			jump: {
				duration: 800,
				start: { rotate: -1.9, translateX: -5 },
				end: { rotate: -2.2, translateX: -5 },
				transitionDuration: 100
			},
			grab: {
				duration: 800,
				start: { rotate: 3 + .1, translateX: -5 },
				end: { rotate: 3 - .1, translateX: -5 },
				transitionDuration: 100
			}
		}
	};

	const armFront: ITransformDrawSetProviderData<ITA> = {
		selectedState,
		drawBase: drawBaseFactory("armRight"),
		beforeDraw: beforeDrawFactory("armRight"),
		states: {
			idle: {
				duration: 1000,
				start: { rotate: -0.1 },
				end: { rotate: 0.1 },
				transitionDuration: 200
			},
			jump: {
				duration: 800,
				start: { rotate: -2.2, translateX: -5 },
				end: { rotate: -2.5, translateX: -5 },
				transitionDuration: 100
			},
			grab: {
				duration: 800,
				start: { rotate: 3 - .1, translateX: -5 },
				end: { rotate: 3 + .1, translateX: -5 },
				transitionDuration: 100
			}
		}
	};

	const legBack: ITransformDrawSetProviderData<ITA> = {
		selectedState,
		drawBase: drawBaseFactory("legRight"),
		beforeDraw: beforeDrawFactory("legRight"),
		states: {
			idle: {
				duration: 1000,
				start: {},
				end: {},
				transitionDuration: 200
			},
			jump: {
				duration: 500,
				start: { rotate: 0.15, translateX: 5 },
				end: { rotate: 0.3, translateX: 5 },
				transitionDuration: 200
			},
			grab: {
				duration: 500,
				start: { rotate: 0.15, translateX: 5 },
				end: { rotate: 0.3, translateX: 5 },
				transitionDuration: 200
			}
		}
	};

	const legFront: ITransformDrawSetProviderData<ITA> = {
		selectedState,
		drawBase: drawBaseFactory("legRight"),
		beforeDraw: beforeDrawFactory("legRight"),
		states: {
			idle: {
				transitionDuration: 200,
				start: {},
				end: {},
				duration: 1000
			},
			jump: {
				duration: 500,
				start: { rotate: -0.4, translateX: 5 },
				end: { rotate: -0.55, translateX: 5 },
				transitionDuration: 200
			},
			grab: {
				duration: 500,
				start: { rotate: -0.4, translateX: 5 },
				end: { rotate: -0.55, translateX: 5 },
				transitionDuration: 200
			},
		}
	};

	const torso: ITransformDrawSetProviderData<ITA> = {
		selectedState,
		drawBase: drawBaseFactory("torso"),
		beforeDraw: beforeDrawFactory("torso"),
		states: {
			idle: {
				duration: 1000,
				start: {},
				end: {},
				transitionDuration: 200
			},
			jump: {
				duration: 1000,
				start: { rotate: -0.2 },
				end: { rotate: -0.2 },
				transitionDuration: 200
			},
			grab: {
				duration: 1000,
				start: {},
				end: {},
				transitionDuration: 200
			}
		}
	};

	const head: ITransformDrawSetProviderData<ITA> = {
		selectedState,
		drawBase: drawBaseFactory("headRight"),
		beforeDraw: beforeDrawFactory("headRight"),
		states: {
			idle: {
				duration: 1500,
				start: { rotate: 0.05 },
				end: { rotate: -0.05 },
				transitionDuration: 200
			},
			jump: {
				duration: 500,
				start: { rotate: -0.1, translateX: -5 },
				end: { rotate: 0.1, translateX: -5 },
				transitionDuration: 200
			},
			grab: {
				duration: 500,
				start: { rotate: -0.1 },
				end: { rotate: 0.1 },
				transitionDuration: 200
			}
		}
	};

	const allData = [
		legBack,
		armBack,
		torso,
		head,
		legFront,
		armFront,
	]

	const animationProviders = allData.map(createTransformDrawSetProvider);
	const playerAnimationFactory = new TransformDrawAnimationFactory(animationProviders);
	return playerAnimationFactory.attachTo(player);
}
