export const preloaded: any[] = [];

export async function load(src: string): Promise<Blob> {
	const a = await fetch(src);
	const b = await a.blob();
	return b;
}

export default async function preload(src: string): Promise<Blob> {
	const b = await load(src);
	preloaded.push(b);
	return b;
}

export function preloadImage(src: string) {
	const img = new Image();
	const promise = new Promise<HTMLImageElement>((resolve, reject) => {
		img.addEventListener("error", reject);
		img.addEventListener("load", e => {
			preloaded.push(img);
			resolve(img);
		});
		img.src = src;
	});
	return { img, promise };
}

export function preloadAudio(src: string) {
	const audio = new Audio();
	const promise = new Promise<HTMLAudioElement>((resolve, reject) => {
		audio.addEventListener("error", reject);
		audio.addEventListener("canplaythrough", e => {
			preloaded.push(audio);
			resolve(audio);
		});
		audio.src = src;
		audio.load();
	});
	return { audio, promise };
}
