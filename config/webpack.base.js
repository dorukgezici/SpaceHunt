const autoprefixer = require("autoprefixer");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const EvalSourceMapDevToolPlugin = require("webpack/lib/EvalSourceMapDevToolPlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { paths } = require("./helpers");

const sassExtractPlugin = new ExtractTextPlugin({
	filename: "style.css"
});

module.exports = {
	entry: paths.src.entryPoints,
	output: {
		path: paths.build.dir,
		filename: "[name].js",
		sourceMapFilename: "[file].map",
	},
	resolve: {
		extensions: [".html", ".css", ".scss", ".ts", ".js"]
	},
	module: {
		rules: [{
			include: paths.src.assets,
			use: {
				loader: "file-loader",
				options: {
					outputPath: "assets/",
					relative: true,
					name: file => path.relative(paths.src.assets, file)
				}
			}
		}, {
			test: /\.(png|bmp|jpg|jpeg|gif|svg)$/,
			exclude: paths.src.assets,
			use: {
				loader: "file-loader",
				options: {
					outputPath: "img/",
					relative: true,
					name: "[name].[hash].[ext]"
				}
			}
		}, {
			test: /\.txt$/,
			exclude: paths.src.assets,
			use: "raw-loader"
		}, {
			test: /\.ts$/,
			exclude: paths.src.assets,
			use: "ts-loader"
		}, {
			test: /\.json$/,
			exclude: paths.src.assets,
			use: "json-loader"
		}, {
			test: /\.html$/,
			exclude: paths.src.assets,
			use: "html-loader"
		}, {
			test: /\.s?css$/,
			exclude: paths.src.assets,
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
			from: paths.src.static,
			to: paths.build.static
		}]),
		new HtmlWebpackPlugin({
			template: paths.src.html,
			filename: "index.html",
			inject: "head",
			favicon: paths.src.favicon
		}),
		new CommonsChunkPlugin({
			name: "polyfills",
			chunks: ["polyfills"]
		}),
		sassExtractPlugin,
		new EvalSourceMapDevToolPlugin({
			moduleFilenameTemplate: "[resource-path]",
			sourceRoot: "source:///"
		})
	]
};
