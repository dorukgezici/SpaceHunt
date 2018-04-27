import { TransformDrawAnimationFactory, createTransformDrawSetProvider } from "../../Components/Animations/DrawAnimationFactory";
import { modelSize, spritesBro, sprites } from "../../Components/Animations/MichaelsonParts";
import { allData } from "../../Components/Animations/MichelsonAnimation";
import Level1Player from "./Level1Player";
import { IBeforeDraw } from "../../Components/Animations/TransformDrawPart";

export function attachPlayerAnimations(player: Level1Player, isBrother: boolean = false) {

	const sprs = isBrother ? spritesBro : sprites;
	const data = allData.map(data => {
		const { states, selectedState } = data;
		const bd = data.beforeDraw && data.beforeDraw(sprs);
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
			states,
			selectedState,
			beforeDraw,
			drawBase: data.drawBase(sprs)
		};
	});

	const animationProviders = data.map(t => createTransformDrawSetProvider(t));
	const playerAnimationFactory = new TransformDrawAnimationFactory(animationProviders);
	return playerAnimationFactory.attachTo(player);
}
