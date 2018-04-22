const path = require("path");

const root = path.resolve(__dirname, "..");
const resolve = p => path.resolve(root, p);

exports.root = root;
exports.resolve = resolve;

exports.normalisePath = path => path.replace(/\\/g, "/");

exports.paths = {
	root,
	code: {
		dir: resolve("code"),
		src: resolve("code/src"),
		entryPoints: {
			appDev: resolve("code/app.dev.ts"),
			appProd: resolve("code/app.prod.ts"),
			polyfills: resolve("code/polyfills.ts")
		},
		env: {
			test: resolve("code/env.test.ts"),
			dev: resolve("code/env.dev.ts"),
			prod: resolve("code/env.prod.ts")
		},
		static: resolve("code/static"),
		html: resolve("code/index.html"),
		favicon: resolve("code/favicon.png")
	},
	build: {
		dir: resolve("build"),
		static: resolve("build/static"),
		assets: resolve("build/assets")
	},
	test: {
		entry: resolve("test/index.ts"),
		dir: resolve("build-test")
	}
};
