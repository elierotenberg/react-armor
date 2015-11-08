This package is a simple general-purpose starterkit.

It provides a sane directory structure, and pre-wired gulp tasks including:
- linting with eslint and rules based on the coding styles
- transpiling with babel (see below) with appropriate presets for usage in the browser, and in node (with unnecessary transforms removed),
- bundling with webpack, for usage in the browser or in node.

By default, 4 bundles are produced when running `gulp`:

- `browser-dev`: package is transpiled using strict mode transforms, and bundled with `eval-source-map` and all debug flags,
- `browser-prod`: package is transpiled using loose-mode transforms (when appropriate), and bundled with `inline-source-maps`, and then minified using `uglifyjs2`.
- `node-dev`: package is transpiled using strict mode transforms, without the transforms not required by node `^5.0.0`, and bundled with `eval-source-map` and all debug flags,
- `node-prod`: package is transpiled using loose-mode transforms (when appropriate), without the transforms not required by node `^5.0.0`, and bundled with `inline-source-maps`, and then minified using `uglifyjs2`.

`package.json` sets the `private` flag to true by default. To actually publish your library, carefully edit `package.json`
to proper configuration and remove the `private` flag.

Several non-standard `babel` transforms are enabled by default, including:
- `decorators`,
- `class-properties`,
- `jsx`,
- `react-inline-elements` and `react-constant-elements` only in the dev builds,
- `object-rest-spread`,
- `async-functions`,
- `async-generators`,
- `exponentiation-operator`,
- `trailing-function-commas`.

Several other general-purpose libraries are also included by default, which you can of course remove if you don't want them:
- `lodash`,
- `bluebird`.

Test are pre-wired to use `mocha` and `should` but are very easy to replace.
