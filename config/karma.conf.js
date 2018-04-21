const webpackTestConfig = require("./webpack.test")

module.exports = function (config) {
	config.set({
		browsers: ["Chrome", "ChromeHeadless", "CustomChrome"],
		customLaunchers: {
			CustomChrome: {
				base: "ChromeHeadless",
				flags: ["--disable-translate", "--disable-extensions"]
			}
		},
		frameworks: ["jasmine"],
		reporters: ["mocha"],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		singleRun: true,
		concurrency: Infinity,
		files: [{
			pattern: "test/**/*.ts",
			watched: false
		}],
		preprocessors: {
			"../test/**/*.ts": ["webpack", "sourcemap"],
		},
		webpack: webpackTestConfig,
		webpackMiddleware: {
			stats: "errors-only"
		},
		mime: {
			"text/x-typescript": ["ts"]
		},
	})
}