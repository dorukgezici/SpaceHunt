# Dependency Management and Imports

This section explains how files are link, how dependencies are fetched and how developers should include and import their recources.

## Webpack 

[webpack](https://webpack.js.org/) is a tool used for bundling dependencies together and create a build, which can be opened in a browser.

Webpack first looks at some _entry points_. In this project, entry points are two files: `code/app.ts` and `code/polyfills.ts`. If they require any dependeices, webpack learns this and includes the dependecies in the build. Newly included files are analysed again and the process continues untill all dependencies are included to the build. Webpack then bundles them together. These dependencies are not neceserily only TypeScript files, but can also be images, (S)CSS files, or other resources.

It is important to include all required resources when developing. Otherwise they may not show in the application when it is build.

## Inclusion Types

There are different approaches to including resource to the application.

### Static Resources

The directory `code/static` will get copied to `build/static` on every build. You can reference these resources with a hard-coded relative url.

### Assets

The directory `code/assets` contains assets tha need to be manually included to webpack build. Included resouce from the directory are copied to `build/assets` directory on every build. This method is preferred over the previous.

### Images

Including images to webpack build will copy them to `build/img` directory. Image's url is returned when importing explained bellow).

### Other Resources

Including other resource by including them to webpack build. Other resources, such as other TypeScript, CSS files only need to be included, the rest is done by webpack. More information can be found bellow.

## Including Resources

When developing the application, make sure you include your dependencies, otherwise they may not be included in the build. We should use [ES6 imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) when possible.

Including TypeScript files is easy. All included TypeScript files are bundled and compiled to `build/app.js` on every build. When importing, you may omit the `.ts` extension of local files. Note that importing local files should start with `./`, otherwise it is assumed that an npm package is supposed to be imported.

```typescript
import exc from "excalibur"; // import npm package called excalibur
import a from "./a"; // imports local file a.ts
```

CSS or SCSS files can also be imported. These files have no effect on TypeScript code at all. Once a (S)CSS file is imported, it will be added to the CSS bundle generated in the final build, located at `build/style.css`. To include a css or scss file, use:

```typescript
import "./style.scss"; // .css extension also supported
```

If an image is imported, it will be included in the webpack build, in the `build/img` directory. Relative url to target image is returned. `.png`, `.bmp` `.jpg`, `.jpeg`, `.gif` and `.svg` filestypes are supported.

```typescript
import imageUrl from "./my-image.png";
```

If a text file is imported, its content will be reutned. The file must have a `.txt` extension.

```typescript
import fileContent from "./my-file.txt";
```

If a JSON file is imported, its content will be returned as a JavaScript object or array. The file must have a `.json` extension.

```typescript
import myJsonObject from "./my-file.json";
```

If a file from the `code/assets` directory is imported, it will be included in the webpack build (in the `build/assets` directory). Relative url to the target asset is returned.

The file may have any extension. Therefore, the use of `require()` function is required instead of regular ES6 imports. If you wish to use ES6 imports so badly, the files's name must be added as a module to `code/types/webpack.d.ts` file, otherwise typescript won't recognise the import.

Note that this **will return an URL** for JSON and text files. If want your JSON or text file's content to be returned (as described above), the file should **not** be in the `code/assets` directory.

```typescript
const assetUrl1 = require("./assets/my-asset.bin");
import assetUrl2 from "./assets/my-asset.bin"; // not preferred - the .bin extension must be added to code/types/webpack.d.ts
```

## Notes About require()

`require()` can import any kind of asset to the build. It accepts one argument - the path to requested resource. It returns either an URL to the target resource or its content, as described for ES6 imports above.. It is declared as:

```typescript
declare function require(asset: string): any;
```

To dynamically access resouces once they have already been included, you can use `require()` Note that resources will **not** be included to the build if they are `require`d dynamically. Instead, required file paths should be hard-coded.

```typescript
const myResoucePath = "./my-resouce";
require(myResoucePath); // will NOT work

require("./my-resouce"); // will work
```

## How to Organise Resources?

Let's assume we are developing an application component in a dedicated directory `code/src/my-component`. Our component may use certain resouces.

If our component uses a few text files, JSON files, (S)CSS stylesheets or images, they should be included in the component directory (`code/src/my-component`) and included to the build with ES6 imports. Putting resouces in the same directory helps keeping code and resouces organised - what bellongs together, is located at the same location.

If we're using a few other types of resouces, we should add them to the `code/assets` directory and include them with `require()` (as described above).

If we're using many resouces (of any type, even images) we should consider putting them in the `code/static` directory to avoid referencing each of them manually.
