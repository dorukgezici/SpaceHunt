const path = require("path");

const root = path.resolve(__dirname, "..");
const resolve = p => path.resolve(root, p);

exports.root = root;
exports.resolve = resolve;

exports.paths = {
	root,
	src: {
		dir: resolve("code"),
		entryPoints: {
			app: resolve("code/app.ts"),
			polyfills: resolve("code/polyfills.ts")
		},
		static: resolve("code/static"),
		assets: resolve("code/assets"),
		html: resolve("code/index.html"),
		favicon: resolve("code/static/favicon/favicon.png")
	},
	build: {
		dir: resolve("build"),
		static: resolve("build/static"),
		assets: resolve("build/assets")
	}
};
