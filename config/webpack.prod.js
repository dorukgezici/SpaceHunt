const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const configFactory = require("./webpack.base");

const config = configFactory({
	assetName: "[hash].[ext]"
});

module.exports = {
	...config,
	devtool: "source-map",
	plugins: [
		...config.plugins,
		new UglifyJsPlugin({
			sourceMap: true
		})
	]
};
