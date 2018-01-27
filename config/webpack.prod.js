const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const config = require("./webpack.base");

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
