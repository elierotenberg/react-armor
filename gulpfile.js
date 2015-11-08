require('source-map-support').install();
require('babel-core/register')({
  ignore: ['node_modules', 'dist'],
  presets: ['./config/babel/node-dev'],
  sourceMaps: 'inline',
});
require('./config/gulp');
