const { HotModuleReplacementPlugin } = require("webpack");
const config = require("./webpack.base");

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
