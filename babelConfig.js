module.exports = {
  only: /\.jsx$/,
  optional: [
    'runtime',
    'es7.classProperties',
    'es7.decorators',
    'es7.objectRestSpread',
  ],
  loose: [
    'es6.classes',
    'es6.destructuring',
    'es6.properties.computed',
    'es6.modules',
    'es6.forOf',
    'es6.templateLiterals',
  ],
};
