require("particles.js");

export default class ParticlesJS {

	constructor(holderID: string, config: any) {
		if (window.pJSDom === null)
			window.pJSDom = [];
		let index = window.pJSDom
			? window.pJSDom.length
			: 0;
		particlesJS(holderID, config);
		if (!window.pJSDom)
			throw new Error("Particles not created.");
		const pJS = window.pJSDom[index].pJS;
		this.destroy = () => {
			pJS.fn.vendors.destroypJS();
		};
	}

	destroy() { /* */ }

}
