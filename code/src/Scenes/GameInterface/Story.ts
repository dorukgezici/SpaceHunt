import { IGameBootstrapState } from "../../GameBootstrap";

const addS = (name: string) => name.toLowerCase().endsWith("s") ? `${name}'` : `${name}'s`;
const nameText = (names: ReadonlyArray<string>) => names[1] ? `${names[0]} and ${names[1]}` : names[0];

export const level1 = ({ names }: IGameBootstrapState) =>
	`It seems ${nameText(names)} mastered the jungle easily, but a river, which stands on the way, is full of crocodiles, robotic crocodiles. The kidnapping of Lucy suddenly starts to make sense.`;

export const level2 = ({ names }: IGameBootstrapState) =>
	`Local inhabitants detect presence of our ${names[1] ? "heroes" : "hero"} and they are now rolling and bouncing boulders.`;

export const level3 = ({ names }: IGameBootstrapState) =>
	`Exhausted ${names[1] ? `${names[0]} and ${names[1]}` : names[0]} eventually ${names[1] ? "meet" : "meets"} a few Eslans who hold Lucy and use her knowledge of animals to create their own. The Eslans are not very friendly, and ${names[1] ? `${names[0]} and ${names[1]} confront` : names[0] + " confronts"} them in the struggle for life and death.`;

export const level4 = ({ names, winner }: IGameBootstrapState) =>
	`After a long fight, ${winner} has managed to save Lucy. Then they stole Eslans' spaceship to get back to Earth, where they live happily ever after.`;

export const death = ({ names }: IGameBootstrapState) =>
	`Such a tragedy! Poor ${nameText(names)} lost ${names[1] ? "lives" : "life"} trying to set Lucy free from the hands of the evil Eslans.`;
