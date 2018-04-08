import { ITransformDrawSetProviderData, createTransformDrawSetProvider, TransformDrawAnimationFactory } from "../../Components/Animations/DrawAnimationFactory";
import { cubicEasing, IBeforeDraw } from "../../Components/Animations/TransformDrawPart";
import { IDrawSetProvider } from "../../Components/Animations/DrawAnimation";
import { PlainDrawSet } from "../../Components/Animations/PlainDrawSet";
import Player from "./Player";

export type IPlayerAnimations = "idle" | "jump" | "grab";
type IPA = IPlayerAnimations;

export function attachPlayerAnimations(player: Player) {

	const beforeDraw: IBeforeDraw<IPlayerAnimations> = (ctx, path, position) => {
		if (position && player.onVine)
			ctx.translate(-position.x, -position.y);
	};

	const baseArmTransform = {
		translateY: -33
	};

	const rightArmData: ITransformDrawSetProviderData<IPA> = {
		states: {
			idle: {
				duration: 1000,
				start: { rotate: -0.1, ...baseArmTransform },
				end: { rotate: 0.1, ...baseArmTransform },
				transitionDuration: 200
			},
			jump: {
				duration: 800,
				start: { rotate: 2.2, translateX: -5, ...baseArmTransform },
				end: { rotate: 2.5, translateX: -5, ...baseArmTransform },
				transitionDuration: 100
			},
			grab: {
				duration: 800,
				start: { rotate: 3 + .1, translateX: -5, ...baseArmTransform },
				end: { rotate: 3 - .1, translateX: -5, ...baseArmTransform },
				transitionDuration: 100
			}
		},
		selectedState: "idle",
		drawBase: (ctx) => {
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#efb9a5";
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, 30);
			ctx.stroke();
		},
		beforeDraw
	};

	const leftArmData: ITransformDrawSetProviderData<IPA> = {
		states: {
			idle: {
				duration: 1000,
				start: { rotate: 0.1, ...baseArmTransform },
				end: { rotate: -0.1, ...baseArmTransform },
				transitionDuration: 200
			},
			jump: {
				duration: 800,
				start: { rotate: 1.9, translateX: -5, ...baseArmTransform },
				end: { rotate: 2.2, translateX: -5, ...baseArmTransform },
				transitionDuration: 100
			},
			grab: {
				duration: 800,
				start: { rotate: 3 - .1, translateX: -5, ...baseArmTransform },
				end: { rotate: 3 + .1, translateX: -5, ...baseArmTransform },
				transitionDuration: 100
			}
		},
		selectedState: "idle",
		drawBase: (ctx) => {
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#efb9a5";
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, 30);
			ctx.stroke();
		},
		beforeDraw
	};

	const baseLegTransform = {
		translateY: -8
	};

	const rightLegData: ITransformDrawSetProviderData<IPA> = {
		states: {
			idle: {
				duration: 1000,
				start: { rotate: 0, ...baseLegTransform },
				end: { rotate: 0, ...baseLegTransform },
				transitionDuration: 200
			},
			jump: {
				duration: 500,
				start: { rotate: -0.4, translateX: 5, ...baseLegTransform },
				end: { rotate: -0.55, translateX: 5, ...baseLegTransform },
				transitionDuration: 200
			},
			grab: {
				duration: 500,
				start: { rotate: -0.4, translateX: 5, ...baseLegTransform },
				end: { rotate: -0.55, translateX: 5, ...baseLegTransform },
				transitionDuration: 200
			}
		},
		selectedState: "idle",
		drawBase: (ctx) => {
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#2e4aba";
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, 30);
			ctx.stroke();
		},
		beforeDraw
	};

	const leftLegData: ITransformDrawSetProviderData<IPA> = {
		states: {
			idle: {
				duration: 1000,
				start: { rotate: 0, ...baseLegTransform },
				end: { rotate: 0, ...baseLegTransform },
				transitionDuration: 200
			},
			jump: {
				duration: 500,
				start: { rotate: -0.15, translateX: 5, ...baseLegTransform },
				end: { rotate: -0.3, translateX: 5, ...baseLegTransform },
				transitionDuration: 200
			},
			grab: {
				duration: 500,
				start: { rotate: -0.15, translateX: 5, ...baseLegTransform },
				end: { rotate: -0.3, translateX: 5, ...baseLegTransform },
				transitionDuration: 200
			},
		},
		selectedState: "idle",
		drawBase: (ctx) => {
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#2e4aba";
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, 30);
			ctx.stroke();
		},
		beforeDraw
	};

	const baseTorsoTransform = {
		translateY: -23
	};

	const torsoData: ITransformDrawSetProviderData<IPA> = {
		states: {
			idle: {
				duration: 1000,
				start: { rotate: 0, ...baseTorsoTransform },
				end: { rotate: 0, ...baseTorsoTransform },
				transitionDuration: 200
			},
			jump: {
				duration: 1000,
				start: { rotate: -0.2, ...baseTorsoTransform },
				end: { rotate: -0.2, ...baseTorsoTransform },
				transitionDuration: 200
			},
			grab: {
				duration: 1000,
				start: { rotate: 0, ...baseTorsoTransform },
				end: { rotate: -0, ...baseTorsoTransform },
				transitionDuration: 200
			}
		},
		selectedState: "idle",
		drawBase: (ctx) => {
			ctx.fillStyle = "#ba402e";
			ctx.fillRect(-10, -20, 20, 40);
		},
		beforeDraw
	};

	const head = new PlainDrawSet<IPA>(function (ctx, delta, position, state) {
		if (!position) return;
		const { x, y } = position;

		ctx.save();

		if (player.onVine)
			ctx.translate(0, -43);
		else
			ctx.translate(x, y - 43);

		ctx.fillStyle = "#efb9a5";
		ctx.beginPath();
		ctx.arc(0, 0, 20, Math.PI, 0);
		ctx.fill();

		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(7, -6, 2.5, 0, 2 * Math.PI);
		ctx.arc(-7, -6, 2.5, 0, 2 * Math.PI);
		ctx.fill();

		ctx.restore();
	}, "idle");

	const animationProviders: IDrawSetProvider<IPA>[] = [
		() => head,
		createTransformDrawSetProvider(leftLegData),
		createTransformDrawSetProvider(leftArmData),
		createTransformDrawSetProvider(torsoData),
		createTransformDrawSetProvider(rightLegData),
		createTransformDrawSetProvider(rightArmData),
	];

	const playerAnimationFactory = new TransformDrawAnimationFactory(animationProviders);
	return playerAnimationFactory.attachTo(player);
}
