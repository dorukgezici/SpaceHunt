import {
	createTransformDrawSetProvider,
	TransformDrawAnimationFactory
} from "../../Components/Animations/DrawAnimationFactory";
import Player from "./Player";
import {modelSize} from "../../Components/Animations/MichaelsonParts";
import {allData} from "../../Components/Animations/MichelsonAnimation";

export function attachPlayerAnimations(player: Player) {

	allData.forEach(data => {
		const bd = data.beforeDraw;
		data.beforeDraw = function (_, __, position) {
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
	});

	const animationProviders = allData.map(createTransformDrawSetProvider);
	const playerAnimationFactory = new TransformDrawAnimationFactory(animationProviders);
	return playerAnimationFactory.attachTo(player);
}
