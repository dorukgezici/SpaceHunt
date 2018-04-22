const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const configFactory = require("./webpack.base");
const {	paths } = require("./helpers")

const config = configFactory({
	assetName: "[hash].[ext]",
	envEntry: paths.code.env.prod
});

module.exports = {
	...config,
	entry: {
		app: paths.code.entryPoints.appProd,
		polyfills: paths.code.entryPoints.polyfills
	},
	plugins: [
		...config.plugins,
		new UglifyJsPlugin()
	]
};
