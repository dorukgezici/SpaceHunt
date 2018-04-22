module.exports = function (config) {
	config.set({
		browsers: ["Chrome", "ChromeHeadless", "CustomChrome", "FirefoxHeadless", "Firefox", "FirefoxDeveloper", "FirefoxAurora", "FirefoxNightly"],
		customLaunchers: {
			CustomChrome: {
				base: "ChromeHeadless",
				flags: ["--disable-translate", "--disable-extensions"]
			},
			FirefoxHeadless: {
				base: "Firefox",
				flags: ["-headless"]
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
			pattern: "build-test/test.js",
			watched: false
		}],
		preprocessors: {
			"build-test/test.js": ["sourcemap"],
		}
	})
}