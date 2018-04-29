# Build Process and Project Structure

This document describes the build process of the project. Please refer [Project Setup](setup.md) document for more information on how to set up your workspace environment.

## Project Structure

Here you can find the outline of the project structure.

- `build/` includes production build of the project, once built
	- `assets/` includes imported assets
	- `static/` includes static resources copied from `code/static/`
	- `index.html` application entry point
	- other files
- `code/` includes project source code and assets
	- `src/` includes application source code
		- `Components/` includes components used across multiple scenes
		- `Resources/` includes static resources
		- `Scenes/` includes scenes of the game in separate sub-directories
		- other global source code
	- `static/` includes static resources (this directory is copied to build project)
	- `types/` includes additional TypeScript Type Definitions
	- `app.ts` main application entry point
	- `favicon.png` project's favicon (display icon)
	- `index.html` html template and webapp entry point 
	- `polyfills.ts` polyfill includes entry point (should not contain any game logic, only polyfill inclusion) 
	- `style.scss` main application stylesheets (note that custom stylesheets may be included)
- `config/` includes configuration files for building and running the project
- `doc/` includes documentation, notes and Project Plan
	- `G10_project_plan.docx` Project Plan and Diary
	- other notes and documentation files
- `internal/` includes personal files, notes and whatnots, that are not pushed to git
- `node_modules/` npm packages are installed here
- `.gitignore` git ignore list
- `package.json` npm project information and package list
- `package-lock.json` used by npm
- `readme.md` general project readme description file
- `tsconfig.json` typescript project configuration file
- `webpack.config.js` webpack configuration file
- `tslint.json` linting configuration file

## Building the Project

The project uses [webpack](https://webpack.js.org/) tool for building the application. Webpack bundles source code and other assets and compiles them into a build.

For more information about dependency management used by Webpack, please refer to the [Dependency Management and Imports](dependency-management.md) document.

Webpack configuration is located in the `config/` directory. It includes configurations for development, production, and test builds, `config/webpack.dev.js`, `config/webpack.prod.js`, and `config/webpack.test.js`. File `config/webpack.base.js` contains base configuration extended by development and production configurations. A global variable `ENV` exists on the `window` object and describes the type of the environment and build.

### Build Process

The build process starts at two entry points, `code/app.ts` and `code/polyfills.ts` and includes all their dependencies into the build process. Type of the dependencies affects how they are included. 

Relevant TypeScript files (with `.ts` or `.tsx` extension) are compiled into JavaScript and bundled into a core application source code bundle. Any included external libraries are included. Sourcemaps are produced. Polyfills are bundled in a separate polyfill bundle. JSON and text files (`.json` and `.txt` files) are included to the bundle as JavaScript object or strings.

All CSS stylesheets (`.css` files) are bundled into a single style bundle. Any SCSS code (`.scss` files) is compiled into CSS and then included in the style bundle.

Other resources included, are copied to the build. Note that their name and path may change during the copy process, therefore, they should **not** be hard-coded. Instead, they should be [included into the build](dependency-management.md).

The `code/static/` directory with all of its content is copied to the build at `build/static/`. The directory is not changed in any way; it is copied as-is.

The following table summarizes what happens during the build process with different types of resources.

| Type of resource | Build action |
| --- | --- |
| `.ts` and `.tsx` files | Compiled to JavaScript and included to the application bundle. |
| external libraries | Compiled (if necessary) and included to the application bundle. |
| polyfills | Compiled (if necessary) and included to the polyfill bundle. |
| `.css` and `.scss` files | Compiled (if necessary) and included to the style bundle. |
| other included resources | Copied to the build. |
| static resources (in `src/code/static`) | Directly copied to the build (`build/static`). |

The build process includes plugins and addons, which enhance the build process and produced code. Please refer to the configuration files and webpack's website for further details.

Please refer to the [Dependency Management and Imports](dependency-management.md) document for more information on dependency management of the build process.

### Development Build

Use `npm start` command to start the development build, which launches a development server. Source code is compiled and resources are cached and stored in memory for quick access via the server. No output file is generated. Webpack listens to file changes and re-compiles any changes made in real-time. Cheap source maps are used. This configurations is intended for developers and other personnel running and debugging the project. It should not be used for production.

### Production Build

Use `npm run build` command to create production build. This creates the `build/` directory and populates it with compiled source code and other assets. Any previous content in this directory is permanently deleted. The `build/` directory contains an entry point to the single-page web application which is the result of the build.

This build should be used for production as it is optimised for performance.

The build directory `build/` can be cleaned (permanently deleted) by running `npm run clean`.

### Test Build 

Test build differs from development and production in that it does not contain the application itself, but rather test suites from the `test/` directory. It should only be used for running unit test within a browser environment. Please refer to the next chapter for details about testing.

## Testing

Testing encompasses unit tests that are run in an actual browser environment - Firefox by default, but Chrome can also be used. Both need to be pre-installed on the host machine. A dedicated test exists for compiling the tests. Karma and Jasmine are used as testing frameworks. The test is run with `npm test`, but a dedicated build can be built with by running `npm run build:test`, though the use of the latter is discouraged. Linting is done before test are run when using `npm test`.

## Linting

The project declares style guidelines, which should be followed to a reasonable extent. Linting is not a part of the build process as style guidelines are not enforced, however, they are recommended to be followed.

Linting is done using [TSLint](https://palantir.github.io/tslint/). Configuration files for production and development linting are located in `config/` directory. Linting can be tested by running `npm test` (also runs unit tests) or `npm run lint:prod` for production linting or by running `npm run lint:dev` for development linting. Production linting considers all issues as errors, while development regards them as warning. For other details and differences between the two builds, please refer to the configuration files.

## CLI

Below is a list of all commands available.

| Command(s) | Description |
| --- | --- |
| `npm start`<br>`npm run webserver` | Runs the development build, runs a webserver at [localhost:8080](http://localhost:8080) and opens it in a browser. |
| `npm run webserver:noopen` | Runs the development build and runs a webserver at [localhost:8080](http://localhost:8080). |
| `npm run lan` | Runs the development build, runs a webserver at [0.0.0.0:8080](http://0.0.0.0:8080) and opens it in a browser. |
| `npm run build`<br>`npm run build:prod` | Builds the project for production. |
| `npm run build:dev` | Runs the production build. |
| `npm run build:test` | Runs the test build. |
| `npm run clean` | Cleans the build (deletes the `build/` directory). |
| `npm run clean` | Cleans the test build (deletes the `build-test/` directory). |
| `npm test` | Runs associated linter and carries out units tests. |
| `npm test:chrome` | Runs units tests in Chrome. |
| `npm test:firefox` | Runs units tests in Firefox. |
| `npm test:all` | Runs units tests in all associated browsers. |
| `npm run lint`<br>`npm run lint:prod` | Runs associated linter in production mode. |
| `npm run lint:dev` | Runs associated linter in development mode. |
| `npm run lint:test` | Runs associated linter in test mode. |
| `npm run serve` | Creates a server to serve content in the `build/` directory on [localhost:9090](http://localhost:9090). |

Please note:

- Building the project deletes previous build (if any) beforehand.
- Running the webserver builds the project internally, which is not written to the `build` directory.
- Building and bundling is done using [webpack](https://webpack.js.org/).
- `webpack.config.js` and `tslint.json` are in the root only for developer's convenience. They reference configuration files in the `config` directory.
- Sourcemaps are always created to link generated bundles with original source files. In browser, you can find source files located under `source://` and then `.`.
- For your convenience, if `npm start`, the webserver automatically forces the web page to refresh every time source files change.
