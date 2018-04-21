const autoprefixer = require("autoprefixer");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { paths, normalisePath } = require("./helpers");

const sassExtractPlugin = new ExtractTextPlugin({
	filename: "style.css"
});

module.exports = options => ({
	entry: {
		env: options.envEntry,
		...paths.code.entryPoints
	},
	output: {
		path: paths.build.dir,
		filename: "[name].js",
		sourceMapFilename: "[file].map",
	},
	resolve: {
		extensions: [".html", ".css", ".scss", ".ts", ".tsx", ".js", ".jsx"]
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
					name: options.assetName
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
					name: file => console.log(file) || normalisePath(path.join("static", path.relative(paths.code.static, file)))
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
		}, {
			test: /\.html$/,
			use: "html-loader"
		}, {
			test: /\.s?css$/,
			use: sassExtractPlugin.extract({
				use: [{
					loader: "css-loader",
					options: {
						sourceMap: true
					}
				}, {
					loader: "sass-loader",
					options: {
						sourceMap: true
					}
				}, {
					loader: "postcss-loader",
					options: {
						plugins: [
							autoprefixer(),
						]
					}
				}]
			})
		}]
	},
	plugins: [
		new CopyWebpackPlugin([{
			from: paths.code.static,
			to: paths.build.static
		}]),
		new HtmlWebpackPlugin({
			template: paths.code.html,
			filename: "index.html",
			inject: "head",
			favicon: paths.code.favicon
		}),
		new CommonsChunkPlugin({
			name: "polyfills",
			chunks: ["polyfills"]
		}),
		sassExtractPlugin
	]
});
