import { TransformDrawAnimationFactory, createTransformDrawSetProvider } from "../../Components/Animations/DrawAnimationFactory";
import { modelSize } from "../../Components/Animations/MichaelsonParts";
import { allData } from "../../Components/Animations/MichelsonAnimation";
import Level1Player from "./Level1Player";
import { IBeforeDraw } from "../../Components/Animations/TransformDrawPart";
import { IPlayerAnimations } from "../MovementTestLevel/PlayerAnimations";

export function attachPlayerAnimations(player: Level1Player) {

	const data = allData.map(data => {
		const bd = data.beforeDraw;
		const beforeDraw: typeof bd = function (_, __, position) {
			const t = bd && bd.apply(this, arguments);
			let translateX: number = (t && t.translateX) || 0;
			let translateY: number = (t && t.translateY) || 0;
			translateY += modelSize.h / 2;
			if (position && player.onVine) {
				translateX -= position.x;
				translateY -= position.y;
			}
			return { translateX, translateY };
		};
		return {
			...data,
			beforeDraw
		};
	});

	const animationProviders = data.map(t => createTransformDrawSetProvider(t));
	const playerAnimationFactory = new TransformDrawAnimationFactory(animationProviders);
	return playerAnimationFactory.attachTo(player);
}
