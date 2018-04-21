const { HotModuleReplacementPlugin } = require("webpack");
const configFactory = require("./webpack.base");
const path = require("path");
const { paths, normalisePath } = require("./helpers");

const config = configFactory({
	assetName: file => normalisePath(path.relative(paths.code.src, file)),
	envEntry: paths.code.env.dev
});

module.exports = {
	...config,
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
