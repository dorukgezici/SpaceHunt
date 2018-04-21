const configFactory = require("./webpack.base");
const path = require("path");
const {	paths, normalisePath } = require("./helpers");

const config = configFactory({
	assetName: file => normalisePath(path.relative(paths.code.src, file)),
	envEntry: paths.code.env.test
});

module.exports = {
	...config,
	devtool: "inline-source-map"
};
