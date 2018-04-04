import { InterfaceBuilder } from "../../InterfaceBuilder";

export type IStory = JSX.Element[];

export const intro: IStory = [
	<h1>SpaceHunt - Episode 1</h1>,
	<h2>Unexpected kidnap</h2>,
	<p>The year 3020 is written, and travel between planets and galaxies is finally becoming common, but this fact carries some pitfalls. The technological war between the Earth and the planet Eslan from a nearby galaxy broke out. During this battle, one of the respected biologists, Lucy Mikelson was abducted for unknown reasons. However, the government refuses to take part in any rescue action. Thus, everything remains in the hands of Lucy's husbandFreddy Mikelson.</p>
];

export const level1: IStory = [
	<h2>Level 1</h2>,
	<p>After a long intergalactic flight, Freddy finally finds himself on the planet Eslan, which, besides the absence of animals, does not any differ from Earth. The landing was not smooth and his first task is to get away from the crown of huge tree in the jungle.</p>
];

export const level2: IStory = [
	<h2>Level 2</h2>,
	<p>It seems he has mastered the jungle easily, but the river, which stands in his way now, is full of crocodiles, robotic crocodiles. The kidnapping of Lucy suddenly starts to make sense.</p>
];

export const level3: IStory = [
	<h2>Level 3</h2>,
	<p>Local inhabitants detect his presence and they are trying to stop him by rolling and bouncing boulders.</p>
];

export const level4: IStory = [
	<h2>Level 4</h2>,
	<p>The exhausted Freddy eventually meets a few Eslans who hold his Lucy and use her knowledge of animals to create their own. However, the Eslans are not very friendly, and Freddy confronts them in the struggle for life and death.</p>
];

export const end: IStory = [
	<h2>The End!</h2>,
	<p>After long fight, Freddy has handled to save love of his life. Then they have stolen Eslan's spaceship to be able to get back to the Earth, where they live happily ever after.</p>
];

export const death: IStory = [
	<h2>Ooops...</h2>,
	<p>Such a tragedy! Poor Freddy lost his life within trying to set free love of his life from the hands of the evil Eslans.</p>
];
