const { HotModuleReplacementPlugin } = require("webpack");
const configFactory = require("./webpack.base");
const path = require("path");
const { paths, normalisePath } = require("./helpers");

const config = configFactory({
	assetName: file => normalisePath(path.relative(paths.code.src, file))
});

module.exports = {
	...config,
	entry: {
		app: paths.code.entryPoints.appDev
	},
	devtool: "cheap-eval-source-map",
	devServer: {
		port: 8080,
		historyApiFallback: true,
		watchOptions: {
			ignored: /node_modules/
		}
	},
	plugins: [
		...config.plugins,
		new HotModuleReplacementPlugin()
	]
};
