# Project Setup

This document describes how to install and run the project.

## Prerequisites

To download, build and run the project, one needs the following:

- [Node.js](https://nodejs.org/en/) (version 8.9.4 or later),
- [npm](https://www.npmjs.com/) (version 5.5.0 or later; note that Node.js installer includes npm),
- [git](https://git-scm.com/),
- an ever green browser ([Google Chrome](https://www.google.com/chrome/), [Mozilla Firefox](https://www.mozilla.org/firefox/), [Microsoft Edge](https://www.microsoft.com/en-us/windows/microsoft-edge), [Safari](https://www.apple.com/safari/), [Opera](http://www.opera.com/), etc.).

Note that some features may not work on browsers such as [IE](https://support.microsoft.com/en-us/products/internet-explorer)11, due to disabled polyfill support.

Make sure to include git, node, and npm in your `PATH` variable, otherwise you may not be able to use these tools.

## Setting Up

### Cloning the repository

First, you need to download the project. You can do this by cloning this repository from TUT's git. Navigate to a desired directory and open it in your terminal. Then run:

```bash
git clone https://course-gitlab.tut.fi/sweng_2018/g10---thegroup.git
```

Note that you will be prompted for your credentials if you haven't configured this before.

This will create a folder called `g10---thegroup` in your current working directory, which is an exact copy of the repository. Change your current directory to the newly created one:

```bash
cd g10---thegroup
```

### Installing dependencies

You should now install all JavaScript packages (dependencies) required for the project. Open project directory in terminal and run:

```bash
npm install
```

This may take a few minutes, depending on your broadband speed. If any errors occur, please make sure you have acces to the internet and are not using an outdated version of npm (update npm with `npm install -g npm@latest`).

### Running

You now have all assets required for running the application. Open your project directory in terminal and run:

```bash
npm start
```

to run a development server, or

```bash
npm run build
```

to build the project for production. Please refer to [Build Process and Project Structure](build-process.md) for more information about build system.

## Development

This section covers general development principles and advice.

### Coding

For development, you should use your favourite text editor or IDE. Recommended editors:

- [Visual Studio Code](https://code.visualstudio.com/),
- [Sublime Text](https://www.sublimetext.com/) (TypeScript support available via a plugin),
- [Atom](https://atom.io/) (TypeScript support available via a plugin),
- [WebStorm](https://www.jetbrains.com/webstorm/).

Note that you may improve your editor/IDE experience by installing associated plugins.

### Additional tools

Additional (but optional) tools include TypeScript and TSLint.

[TypeScript](http://www.typescriptlang.org/) offers type support for JavaScript. If installed, one can use the `tsc` command to compile TypeScript to JavaScript and run the latter with node. This may be useful for learning, testing and general TypeScript development. To install TypeScript (globally), run:

```bash
npm install -g typescript
```

You may also choose to install `ts-node` (run `npm install -g ts-node`) to be able to run typescript files without compiling them to JavaScript beforehand (`ts-node` does this automatically for you). If you do this, run `ts-node <file>` to run selected file.

[TSLint](https://palantir.github.io/tslint/) offers linting support. It checks you code style and syntax and warns you about deviation from given guidelines. To install TSLint (globally), run:

```bash
npm install -g tslint
```

Note that both packages are installed locally in the project, thus, you don't *need* to install them globally. This is done to avoid version mismatches for building the project on different environments and machines.

You may find that some text editors or IDEs have build-in support for TypeScript or TSLint. They may, however, require you to install `typescript` or `tslint` npm packages in order to work. Sometimes these features are available via a plugins.

## Dependency Management and Imports

Please read [dependency-management.md](dependency-management.md) file to learn how dependencies are organised and handled and how developers should include and import their resources.
