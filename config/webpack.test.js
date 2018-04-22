const path = require("path");
const { paths, normalisePath } = require("./helpers");

module.exports = {
	entry: {
		test: paths.test.entry
	},
	output: {
		path: paths.test.dir,
		filename: "[name].js",
		sourceMapFilename: "[file].map",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"]
	},
	module: {
		rules: [{
			test: /\.(?!(?:tsx?|jsx?|json|txt|s?css)$)/,
			include: paths.code.src,
			use: {
				loader: "file-loader",
				options: {
					outputPath: "assets/",
					relative: true,
					name: "[path][name].[ext]",
					emitFile: false
				}
			}
		}, {
			test: /\.(?!(?:tsx?|jsx?|json|txt|s?css)$)/,
			include: paths.code.static,
			use: {
				loader: "file-loader",
				options: {
					relative: true,
					emitFile: false,
					name: file => normalisePath(path.join("static", path.relative(paths.code.static, file)))
				}
			}
		}, {
			test: /\.txt$/,
			use: "raw-loader"
		}, {
			test: /\.tsx?$/,
			use: "ts-loader"
		}, {
			test: /\.json$/,
			use: "json-loader"
		}]
	},
	devtool: "source-map"
}
