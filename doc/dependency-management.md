# Dependency Management and Imports

This section explains how files are link, how dependencies are fetched and how developers should include and import their recources.

## Webpack 

[webpack](https://webpack.js.org/) is a tool used for bundling dependencies together and create a build, which can be opened in a browser.

Webpack first looks at some _entry points_. In this project, entry points are two files: `code/app.ts` and `code/polyfills.ts`. If they require any dependeices, webpack learns this and includes the dependecies in the build. Newly included files are analysed again and the process continues untill all dependencies are included to the build. Webpack then bundles them together. These dependencies are not neceserily only TypeScript files, but can also be images, (S)CSS files, or other resources.

## Including Resources

When developing the application, make sure you include your dependencies, otherwise they may not be included in the build. We should use [ES6 imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) to include TypeScript and the `require(...)` function to include any other resource.

### TypeScript

Including TypeScript files is easy. All included TypeScript files are bundled and compiled to `build/app.js` on every build. When importing, you may omit the `.ts` extension of local files. Note that imports of local files should start with `./`, otherwise it is assumed that an npm package is supposed to be imported.

```typescript
import * as ex from "excalibur"; // import all content from npm package called excalibur
import { Engine } from "excalibur"; // import Engine class from the excalibur npm package
import * as a from "./a"; // imports all content from local file a.ts
import { b } from "./a"; // imports feature b from local file a.ts
```

### (S)CSS

CSS or SCSS files can also be imported. These files have no effect on TypeScript code at all. Once an (S)CSS file is imported, it will be added to the CSS bundle generated in the final build, located at `build/style.css`. To include a css or scss file, use:

```typescript
require("./style.scss"); // .css extension also supported
```

Using images or other resources in (S)CSS stylesheets will include the assets to the build. There is no need to import these assets again from TypeScript code.

```css
body {
	background: url("./my-image.png"); /* the image will be included in the build */
}
```

### Text and JSON Files

If text files or JSON files are imported, their content is returned as a string or JavaScript object. Files should have the appropriate `.txt` or `.json` extension.

```typescript
const contentString = require("./text-file.txt");
const contentObject = require("./json-file.json");
```

### Other Resources

Importing images, videos, 3D models or any other resources will return their relative URL. The URL should not be hard-coded as it may change from build to build and differ in development and production environment. The resource may have any extension.

```typescript
const imageUrl = require("./my-image.png");
const resourceUrl = require("./my-resource.bin");
```

## Notes About require()

Including resources dynamically with `require(...)` will **not** include them to the build; instead, their paths should be hard-coded. Once a resource **had already been included**, you may use require to access the resource again.

```typescript
const myResoucePath = "./my-resouce";
require(myResoucePath); // will NOT work

require("./my-resouce"); // will work
```

## How to Organise Resources?

Let's assume we are developing an application component in a dedicated directory `code/src/my-component`. Our component may use certain resouces.

If our component uses a few text files, JSON files, (S)CSS stylesheets, images or any other resources, they should be put into the component directory (`code/src/my-component`) and included to the build with the `require(...)` function. Putting resouces in the same directory helps keeping code and resouces organised - what bellongs together, is located at the same location.

If we're using many resouces (of any type) we should consider putting them in the `code/static` directory to avoid referencing each of them manually.
