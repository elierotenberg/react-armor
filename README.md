This package is a simple library starterkit.

It provides sane defaults for:
- directory structure:
  - `src` for source files, `___tests___` (each subdirectory of `src` can have its `___tests___` folder)
  - `dist` for transpiled code (which `package.json` points to).
- `gulp` (default runs `gulp build`)
- `gulp lint` using `eslint` and `eslint-plugin-babel`
- `gulp test` using `mocha` and `should`
- `gulp build` using `babel` (with sourcemaps) on `.jsx` the following options:
  - `runtime`,
  - `es7.classProperties`,
  - `es7.objectRestSpread`,
  - `es7.decorators`.
